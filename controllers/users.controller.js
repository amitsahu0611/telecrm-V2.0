/** @format */

const {default: axios, create} = require("axios");
const {hashPassword} = require("../config/config");
const Users = require("../models/users.model");
const {createSuccess} = require("../utils/response");
const jwt = require("jsonwebtoken");
const {Parser} = require("json2csv");

const register = async (req, res) => {
  try {
    const {name, initials, email, password, role_id, workspace_id, phone} =
      req.body;

    const existingUser = await Users.findOne({where: {email}});
    if (existingUser)
      return res.status(400).json({message: "Email already registered"});

    const hashedPassword = hashPassword(password);

    const user = await Users.create({
      name,
      initials,
      email,
      password: hashedPassword,
      role_id,
      workspace_id,
      phone,
    });

    const subject = "Welcome to Nowgray – Your Account is Ready!";

    const content = `
      <div style="font-family: Arial, sans-serif; background-color: #f6f8fa; padding: 30px;">
        <div style="max-width: 600px; margin: auto; background: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
          <h2 style="text-align: center; color: #333333;">Welcome to Nowgray, ${name}!</h2>
          <p style="font-size: 16px; color: #555555;">We’re excited to have you on board. Your account has been created successfully. Below are your login credentials:</p>
          
          <div style="margin-top: 20px; background-color: #f0f4f8; padding: 15px; border-radius: 5px;">
            <p style="margin: 0; font-size: 15px;"><strong>Username (Email):</strong> ${email}</p>
            <p style="margin: 0; font-size: 15px;"><strong>Password:</strong> ${password}</p>
          </div>

          <p style="margin-top: 25px; font-size: 15px; color: #666666;">
            Please keep this information secure. You can now log in and start using our platform.
            If you have any questions or face issues, don’t hesitate to contact our support team.
          </p>

          <p style="font-size: 14px; color: #999999; margin-top: 30px;">
            This is an auto-generated email. If you did not register for Nowgray, please disregard this message.
          </p>

          <p style="font-size: 14px; color: #333333; margin-top: 20px;">Warm regards,<br/>Team Nowgray</p>
        </div>
      </div>
    `;

    // Send email using external API
    try {
      const response = await axios.get(
        `https://inhouse.digitalsnug.com/API/CRON/OtpEmail`,
        {
          params: {
            EmailID: email,
            Subject: subject,
            Content: content,
            AuthCode: 12662,
          },
        }
      );
      console.log("Welcome email sent:", response.data);
    } catch (emailError) {
      console.error("Error sending welcome email:", emailError.message);
    }

    res.status(201).json(createSuccess("User registered successfully", user));
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({message: "Server error"});
  }
};

const login = async (req, res) => {
  try {
    const {email, password} = req.body;

    const user = await Users.findOne({where: {email, is_deleted: false}});
    if (!user) return res.status(401).json({message: "Invalid credentials"});

    const hashedPassword = hashPassword(password);
    if (user.password !== hashedPassword)
      return res.status(401).json({message: "Invalid credentials"});

    const token = jwt.sign(
      {user_id: user.user_id, role_id: user.role_id},
      process.env.JWTKEY,
      {
        expiresIn: "1d",
      }
    );

    res.json(createSuccess("Login successful", {token, user}));
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({message: "Server error"});
  }
};

const getUserById = async (req, res) => {
  try {
    const {user_id} = req.params;

    const user = await Users.findOne({where: {user_id}});
    if (!user) return res.status(404).json({message: "User not found"});

    res.json(createSuccess("User retrieved successfully", user));
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({message: "Server error"});
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await Users.findAll({
      where: {is_deleted: false},
      order: [["user_id", "DESC"]],
    });

    res.json(createSuccess("Users retrieved successfully", users));
  } catch (error) {
    console.error("Get all users error:", error);
    res.status(500).json({message: "Server error"});
  }
};

const updateUser = async (req, res) => {
  try {
    const {user_id} = req.params;
    const {name, initials, email, password, role_id, phone, workspace_id} =
      req.body;

    const user = await Users.findOne({where: {user_id}});
    if (!user) return res.status(404).json({message: "User not found"});

    let isChanged = false;
    if (user.password !== hashPassword(password)) {
      isChanged = true;
    }

    const hashedPassword = isChanged ? hashPassword(password) : user.password;

    const data = await Users.update(
      {
        name,
        initials,
        email,
        password: hashedPassword,
        role_id,
        workspace_id,
        phone,
      },
      {where: {user_id}}
    );

    res.json(createSuccess("User updated successfully", data));
  } catch (error) {
    console.error("Update user error:", error);
    res.status(500).json({message: "Server error"});
  }
};

const exportAllUsers = async (req, res) => {
  try {
    const users = await Users.findAll({
      where: {is_deleted: false},
      order: [["user_id", "DESC"]],
    });

    const csvData = users.map((user) => ({
      user_id: user.user_id,
      name: user.name,
      initials: user.initials,
      email: user.email,
      role_id: user.role_id,
      workspace_id: user.workspace_id,
      phone: user.phone,
    }));

    const json2csvParser = new Parser();
    const csv = json2csvParser.parse(csvData);

    res.header("Content-Type", "text/csv");
    res.attachment("users.csv");
    return res.send(csv);
  } catch (error) {
    console.error("Export all users error:", error);
    res.status(500).json({message: "Server error"});
  }
};

module.exports = {
  login,
  getUserById,
  register,
  getAllUsers,
  updateUser,
  exportAllUsers,
};
