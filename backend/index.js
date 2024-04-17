const express = require("express");
const session = require("express-session");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const User = require("./models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI;
const JWT_SECRET = process.env.JWT_SECRET;

mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(
  session({
    secret: JWT_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);
app.use(cors());

app.post("/signup", async (req, res) => {
  const { name, lastName, password, contactValue } = req.body;

  try {
    const existingUser = await User.findOne({ contactValue });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const otp = Math.floor(100000 + Math.random() * 900000);

    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    const newUser = new User({
      name,
      lastName,
      password: hashedPassword,
      contactValue,
      otp: { code: otp, expiresAt },
    });
    await newUser.save();

    await sendOTPByEmail(contactValue, otp);

    res.status(200).json({ success: true, message: "OTP sent successfully" });
  } catch (error) {
    console.error("Error signing up:", error);
    res
      .status(500)
      .json({ error: "Failed to sign up. Please try again later." });
  }
});

app.post("/verify-otp", async (req, res) => {
  const { contactValue, otp } = req.body;

  try {
    console.log("Contact Value received:", contactValue);

    const user = await User.findOne({ contactValue });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.otp && user.otp.code === otp && user.otp.expiresAt > new Date()) {
      user.otp = { code: null, expiresAt: null };
      await user.save();
      res
        .status(200)
        .json({ success: true, message: "OTP verified successfully" });
    } else {
      res.status(400).json({ error: "Invalid OTP" });
    }
  } catch (error) {
    console.error("Error verifying OTP:", error);
    res
      .status(500)
      .json({ error: "Failed to verify OTP. Please try again later." });
  }
});

app.post("/resend-otp", async (req, res) => {
  const { contactValue } = req.body;

  try {
    const existingUser = await User.findOne({ contactValue });
    if (!existingUser) {
      return res.status(404).json({ error: "User not found" });
    }

    if (
      existingUser.lastOtpSentAt &&
      Date.now() - existingUser.lastOtpSentAt < 60000
    ) {
      return res
        .status(400)
        .json({ error: "You can resend OTP only once per minute" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000);

    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    existingUser.otp = { code: otp, expiresAt };
    existingUser.lastOtpSentAt = Date.now();
    await existingUser.save();

    await sendOTPByEmail(contactValue, otp);

    res.status(200).json({ success: true, message: "OTP resent successfully" });
  } catch (error) {
    console.error("Error resending OTP:", error);
    res
      .status(500)
      .json({ error: "Failed to resend OTP. Please try again later." });
  }
});

function sendOTPByEmail(contactValue, otp) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USERNAME,
    to: contactValue,
    subject: "OTP Verification",
    text: `Your OTP for verification is: ${otp}. This OTP will expire in 5 minutes.`,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.error("Error sending email:", error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
}

app.post("/login", async (req, res) => {
  const { contactValue, password } = req.body;

  try {
    const user = await User.findOne({ contactValue });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid password" });
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET);
    res.status(200).json({ success: true, token });
  } catch (error) {
    console.error("Error logging in:", error);
    res
      .status(500)
      .json({ error: "Failed to log in. Please try again later." });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
