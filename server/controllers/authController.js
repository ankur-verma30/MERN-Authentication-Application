import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";



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
      return response.status(400).json({ success: false, message: "Already registered" });
    }

    //hash the password to prevent the password from being exposed
    const hashedPassword =await bcrypt.hash(password, 10);
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
    //send a success message to the user
    response.status(200).json({ success: true, message: "User registered successfully" });
  } catch (error) {
    response.json({ success: false, message: error.message });
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
