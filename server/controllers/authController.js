import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";
import transporter from "../config/nodemailer.js";
import { EMAIL_VERIFY_TEMPLATE,PASSWORD_RESET_TEMPLATE } from "../config/emailTemplates.js";

export const register = async (request, response) => {
  const { name, email, password } = request.body;
  if (!name || !email || !password) {
    return response.status(400).json({
      success: false,
      message: "Please provide all the required fields",
    });
  }
  try {
    //if the existing user is already registered we will return the success false and not create a new user
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return response
        .status(400)
        .json({ success: false, message: "Already registered" });
    }

    //hash the password to prevent the password from being exposed
    const hashedPassword = await bcrypt.hash(password, 10);
    //create a new user document and save it in the database
    const user = new userModel({ name, email, password: hashedPassword });
    //now save the user in the database
    await user.save();

    //generate a jwt token for the user
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    //in response we will add token in the cookie
    response.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    //script to send an welcome email to the user
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "Welcome to CodeSpace!",
      text: `Welcome to CodeSpace. Your account has been created successfully with email id: ${email}. Please verify your account.`,
    };

    //verifying the SMTP server connection
    transporter.verify((error, success) => {
      if (error) {
        console.error("SMTP Error:", error.message);
      } else {
        console.log("SMTP Config is working");
      }
    });
    await transporter.sendMail(mailOptions);

    //send a success message to the user
    response
      .status(200)
      .json({ success: true, message: "User registered successfully" });
  } catch (error) {
    return response.json({ success: false, message: error.message });
  }
};

export const login = async (request, response) => {
  const { email, password } = request.body;
  if (!email || !password) {
    return response.status(400).json({
      success: false,
      message: "Please provide all the required fields",
    });
  }
  try {
    const user = await userModel.findOne({ email });
    //check if the user is not presnet in the user database
    if (!user) {
      return response.status(404).json({
        success: false,
        message: "User does not exist, Invalid email",
      });
    }
    //check for the password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return response
        .status(404)
        .json({ success: false, message: "Incorrect password" });
    }

    //generate a jwt token for the user
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    //in response we will add token in the cookie
    response.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    //send a success message to the user
    response.json({ success: true, message: "Logged in successfully" });
  } catch (error) {
    return response.json({ success: false, message: error.message });
  }
};

export const logout = async (request, response) => {
  //log out the user clearning the cookie for the user
  try {
    response.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });

    //send a success message to the user
    response.json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    return response.json({ success: false, message: error.message });
  }
};

export const sendVerifyOtp = async (request, response) => {
  try {
    const { userId } = request.body;
    //check if the user is authenticated and find the user
    const user = await userModel.findById(userId);
    if (user.isAccountVerified) {
      return response
        .status(400)
        .json({ success: false, message: "User is already verified" });
    }
    //generate a random 6 digit otp
    const otp = String(Math.floor(100000 + Math.random() * 900000));

    //save the otp in the database
    user.verifyOtp = otp;
    user.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000; //24hrs
    await user.save();

    //send the otp to the user's registered email
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Account Verification OTP",
      // text: `Your verification otp is: ${otp}. This otp is only valid for the next 15 minutes.`,
      html:EMAIL_VERIFY_TEMPLATE.replace("{{otp}}",otp).replace("{{email}}",user.email)
    };
    await transporter.sendMail(mailOptions);

    //send a success message to the user
    return response.json({
      success: true,
      message: "Verification otp sent successfully",
    });
  } catch (error) {
    return response
      .status(400)
      .json({ success: false, message: error.message });
  }
};

export const verifyEmail = async (request, response) => {
  const { userId, otp } = request.body;
  if (!userId || !otp) {
    return response
      .status(400)
      .json({ success: false, message: "Missing Details" });
  }

  try {
    //find the user in the database
    const user = await userModel.findById(userId);

    //if user is not present in the database
    if (!user) {
      return response
        .status(404)
        .json({ success: false, message: "User Not Found" });
    }

    //if the opt entered by the user is not matching to the opt provided
    if (!user.verifyOtp || user.verifyOtp !== otp) {
      return response
        .status(400)
        .json({ success: false, message: "Invalid OTP" });
    }

    //check the expiry of the opt
    if (!user.verifyOtpExpireAt || user.verifyOtpExpireAt < Date.now()) {
      return response
        .status(400)
        .json({ success: false, message: "OTP Expired" });
    }

    //if the opt entered by the user is matching to the opt provided
    //update the user's account verification status
    user.isAccountVerified = true;
    user.verifyOtp = null;
    user.verifyOtpExpireAt = null;
    await user.save();

    //send a success message to the user
    response.json({ success: true, message: "Email verified successfully" });
  } catch (error) {
    return response
      .status(400)
      .json({ success: false, message: error.message });
  }
};

//check user is authenticated
export const isAuthenticated = async (request, response) => {
  try {
    return response.json({
      success: true,
      message: "User is authenticated successfully",
    });
  } catch (error) {
    return response
      .status(401)
      .json({ success: false, message: "Unauthorized" });
  }
};

//send password reset opt

export const sendResetPasswordOtp = async (request, response) => {
  try {
    const { email } = request.body;
    //check if the user is authenticated and find the user
    if (!email) {
      return response
        .status(400)
        .json({ success: false, message: "Please provide email" });
    }
    const user = await userModel.findOne({ email });
    if (!user) {
      return response
        .status(404)
        .json({ success: false, message: "User Not Found" });
    }

    //generate a random 6 digit otp
    const otp = String(Math.floor(100000 + Math.random() * 900000));

    //save the otp in the database
    user.resetOtp = otp;
    user.resetOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000; //24hrs
    await user.save();

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Password Reset OTP",
      // text: `Your password reset otp is: ${otp}. This otp is only valid for the next 24 hrs. Use this otp to reset your password`,
      html:PASSWORD_RESET_TEMPLATE.replace("{{otp}}",otp).replace("{{email}}",user.email)
    };
    await transporter.sendMail(mailOptions);

    //return a success response
    return response.json({
      success: true,
      message: "Reset otp sent successfully",
    });
  } catch (error) {
    return response
      .status(400)
      .json({ success: false, message: error.message });
  }
};

//reset user password
export const resetUserPassword = async (request, response) => {
  const { email, otp, newPassword } = request.body;
  if (!email || !otp || !newPassword) {
    return response
      .status(400)
      .json({ success: false, message: "Please provide all required fields" });
  }

  try {
    const user = await userModel.findOne({ email });

    //if the user is not present
    if (!user) {
      return response
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    //if the otp provided by the user is not same as the otp present in the database
    if (user.resetOtp === "" || user.resetOtp !== otp) {
      return response
        .status(400)
        .json({ success: false, message: "Invalid OTP" });
    }

    //if the opt provided by the user is expired
    if (user.resetOtpExpireAt < Date.now()) {
      return response
        .status(400)
        .json({ success: false, message: "OTP expired" });
    }

    //if all conditions are satisfied, reset the password and remove the otp and expiry
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetOtp = "";
    user.resetOtpExpireAt = 0;
    await user.save();

    //sending mail notification for the password reset
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Password Reset Successful",
      text: "Your password has been successfully reset. You can now login with your new password.",
    };

    await transporter.sendMail(mailOptions);

    //return a success response
    return response.json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    return response
      .status(400)
      .json({ success: false, message: error.message });
  }
};

