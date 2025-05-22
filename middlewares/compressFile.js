const sharp = require("sharp");
const { PDFDocument, PDFName } = require("pdf-lib");
const fs = require("fs");
const docxPdf = require("docx-pdf");

const compressFile = async (filePath) => {
  const fileExtension = filePath.split(".").pop().toLowerCase();

  try {
    if (
      fileExtension === "jpg" ||
      fileExtension === "jpeg" ||
      fileExtension === "png"
    ) {
      const outputFilePath = filePath.replace(
        /\.(jpg|jpeg|png)$/,
        "_compressed.$1"
      );
      await sharp(filePath).jpeg({ quality: 85 }).toFile(outputFilePath);
      return outputFilePath;
    } else if (fileExtension === "pdf") {
      const pdfDoc = await PDFDocument.load(fs.readFileSync(filePath));
      const pages = pdfDoc.getPages();
      for (const page of pages) {
        page.setContextWidth(page.getWidth() / 2);
      }
      const compressedPdfBytes = await pdfDoc.save();
      const outputFilePath = filePath.replace(".pdf", "_compressed.pdf");
      fs.writeFileSync(outputFilePath, compressedPdfBytes);
      return outputFilePath;
    } else if (fileExtension === "docx") {
      const pdfBuffer = await docxPdf(filePath);
      const outputFilePath = filePath.replace(".docx", "_compressed.pdf");
      fs.writeFileSync(outputFilePath, pdfBuffer);
      return outputFilePath;
    } else {
      throw new Error("Unsupported file type for compression.");
    }
  } catch (error) {
    console.error("Error compressing file:", error);
    throw error;
  }
};

module.exports = { compressFile };
