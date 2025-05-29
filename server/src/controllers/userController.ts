import { Request, Response } from "express";
import User from "../models/userModel";
import bcrypt from "bcryptjs";
import {
  GetUserRequest,
  GetUserResponse,
  RegisterUserRequest,
  RegisterUserResponse,
  LoginUserRequest,
  LoginUserResponse,
  LogoutUserResponse,
} from "../interfaces/controllers/userInterface";
import { generateToken } from "../ultis/generateToken";
import { ObjectId, Types } from "mongoose";

export const getUser = async (
  req: GetUserRequest,
  res: GetUserResponse
): Promise<void> => {
  res.send("User data retrieved successfully");
};

export const registerUser = async (
  req: RegisterUserRequest,
  res: RegisterUserResponse
): Promise<void> => {
  try {
    const { username, email, password } = req.body;
    const user = await User.find({ email });
    if (user.length > 0) {
      res.status(400).json({ message: "User already exists" });
      return;
    }
    const salt = await bcrypt.genSalt(10);
    if (!password) {
      res.status(400).json({ message: "Password is required" });
      return;
    }
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({ username, email, password: hashedPassword, boards: [] });
    await newUser.save();
    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser._id.toString(),
        username: newUser.username,
        email: newUser.email,
        boards: newUser.boards.map((board: Types.ObjectId) => board.toString()),
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Register error",
        error: error instanceof Error ? error.message : String(error),
      });
  }
};

export const loginUser = async (
  req: LoginUserRequest,
  res: LoginUserResponse
): Promise<void> => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      res.status(400).json({ message: "User not found" });
      return;
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(400).json({ message: "Invalid credentials" });
      return;
    }
    generateToken(user._id.toString(), res);
    res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id.toString(),
        username: user.username,
        email: user.email,
        boards: user.boards.map((board: Types.ObjectId) => board.toString()),
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Login error",
        error: error instanceof Error ? error.message : String(error),
      });
  }
};

export const logoutUser = (req: Request, res: LogoutUserResponse): void => {
  try {
    res.clearCookie("Usertoken");
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Logout error",
        error: error instanceof Error ? error.message : String(error),
      });
  }
};
