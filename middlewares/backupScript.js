const fs = require("fs-extra");
const path = require("path");
const mysql = require("mysql2");
const archiver = require("archiver");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");

dotenv.config({
  path: "./.env",
});
const dbConfig = {
  host: process.env.HOST_NAME,
  user: process.env.USER_NAME,
  password: process.env.PASSWORD,
  database: process.env.DATABASE_NAME,
};

const timestamp = new Date().toISOString().replace(/:/g, "-");
const backupFolderPath = path.join("backup", `backup-${timestamp}`);
const sqlBackupFile = path.join(backupFolderPath, "database-backup.sql");
const publicFolderPath = "public";
const archiveFile = path.join(backupFolderPath, "public-folder-backup.zip");

const logFilePath = path.join(backupFolderPath, "backup-log.txt");
const errorLogFilePath = path.join(backupFolderPath, "error-log.txt");

fs.ensureDirSync(backupFolderPath);

fs.ensureFileSync(logFilePath);
fs.ensureFileSync(errorLogFilePath);

function logMessage(message, isError = false) {
  const logStream = fs.createWriteStream(
    isError ? errorLogFilePath : logFilePath,
    { flags: "a" }
  );
  logStream.write(`${new Date().toISOString()}: ${message}\n`);
  logStream.end();
}

function escapeValue(value) {
  if (value === null) return "NULL";
  return `'${String(value).replace(/'/g, "''")}'`;
}

async function backupDatabase() {
  const connection = mysql.createConnection(dbConfig);
  return new Promise((resolve, reject) => {
    connection.query("SHOW TABLES", async (err, tables) => {
      if (err) {
        logMessage(`Error fetching tables: ${err}`, true);
        connection.end();
        reject(err);
        return;
      }

      const backupStream = fs.createWriteStream(sqlBackupFile);
      const queryPromises = tables.map((table) => {
        const tableName = table[`Tables_in_${dbConfig.database}`];

        return new Promise((resolve, reject) => {
          connection.query(
            `SHOW CREATE TABLE \`${tableName}\``,
            (err, result) => {
              if (err) {
                logMessage(
                  `Error fetching table schema for ${tableName}: ${err}`,
                  true
                );
                return reject(err);
              }

              backupStream.write(`${result[0]["Create Table"]};\n\n`);

              connection.query(
                `SELECT * FROM \`${tableName}\``,
                (err, rows) => {
                  if (err) {
                    logMessage(
                      `Error fetching rows for table ${tableName}: ${err}`,
                      true
                    );
                    return reject(err);
                  }

                  rows.forEach((row) => {
                    const values = Object.values(row)
                      .map(escapeValue)
                      .join(", ");
                    backupStream.write(
                      `INSERT INTO \`${tableName}\` VALUES (${values});\n`
                    );
                  });

                  backupStream.write("\n");
                  resolve();
                }
              );
            }
          );
        });
      });

      try {
        await Promise.all(queryPromises);
        backupStream.end(() => {
          logMessage("Database backup completed successfully.");
          connection.end();
          resolve();
        });
      } catch (err) {
        logMessage(`Error during database backup: ${err}`, true);
        connection.end();
        reject(err);
      }
    });
  });
}

function archivePublicFolder() {
  return new Promise((resolve, reject) => {
    const output = fs.createWriteStream(archiveFile);
    const archive = archiver("zip", { zlib: { level: 9 } });

    output.on("close", () => {
      logMessage("Public folder archived successfully.");
      resolve();
    });

    archive.on("error", (err) => {
      logMessage(`Error during archiving public folder: ${err}`, true);
      reject(err);
    });

    archive.pipe(output);
    archive.directory(publicFolderPath, false);
    archive.finalize();
  });
}

async function copyBackupToLocal() {
  const localBackupFolderPath = path.join(
    "C:",
    "local-backup",
    `backup-${timestamp}`
  );
  await fs.ensureDir(localBackupFolderPath);

  await fs.copy(backupFolderPath, localBackupFolderPath);
  logMessage("Backup folder copied to local system successfully.");
}

async function sendBackupEmail() {
  // Check if files exist
  try {
    await checkFileExists(sqlBackupFile);
    await checkFileExists(archiveFile);
  } catch (err) {
    logMessage(`Error checking file existence: ${err.message}`, true);
    return;
  }

  const transporter = nodemailer.createTransport({
    host: "mail.loms-law.com",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: "noreply@loms-law.com",
      pass: "loms123456@@",
    },
  });

  const mailOptions = {
    from: "noreply@loms-law.com",
    to: "vivekmishra8009@gmail.com",
    subject: "Backup Files",
    text: "Please find attached the backup files.",
    attachments: [
      {
        filename: path.basename(sqlBackupFile),
        path: sqlBackupFile,
        contentType: "application/sql",
      },
      {
        filename: path.basename(archiveFile),
        path: archiveFile,
        contentType: "application/zip",
      },
    ],
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    logMessage(`Email sent successfully: ${info.response}`);
  } catch (error) {
    logMessage(`Error sending email: ${error.message}`, true);
    logMessage(`Error stack trace: ${error.stack}`, true);
  }
}

async function checkFileExists(filePath) {
  const exists = await fs.pathExists(filePath);
  if (!exists) {
    throw new Error(`File not found: ${filePath}`);
  }
}

module.exports = {
  backupDatabase,
  archivePublicFolder,
  copyBackupToLocal,
  logMessage,
  sendBackupEmail,
};
