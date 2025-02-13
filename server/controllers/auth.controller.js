import axios from "axios";
import mongoose from "mongoose";
import { comparePassword, hashedPassword, tokenGenerate } from "../config/helper.js";
import User from "../models/auth.model.js";

// Manual Registration with Transactions
export const registerController = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ msg: "All fields are required" });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email }).session(session);
        if (existingUser) {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({ msg: "User already exists" });
        }

        // Hash password
        const hashedPasswordRes = await hashedPassword(password);

        // Create new user
        const [newUser] = await User.create([{ name, email, password: hashedPasswordRes }], { session });

        await session.commitTransaction();
        session.endSession();

        res.status(201).json({ msg: "Registration successful", user: newUser });
    } catch (e) {
        await session.abortTransaction();
        session.endSession();
        console.error(`Error: ${e}`);
        res.status(500).json({ msg: "Server error", error: e.message });
    }
};

// Manual Login with Transactions
export const loginController = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ msg: "Email and password are required" });
        }

        // Find user
        const user = await User.findOne({ email }).session(session);
        if (!user) {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({ msg: "Invalid email or password" });
        }

        // Compare passwords
        const isMatch = await comparePassword(password, user.password);
        if (!isMatch) {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({ msg: "Invalid email or password" });
        }

        // Generate token
        const token = await tokenGenerate({ user });

        await session.commitTransaction();
        session.endSession();

        res.status(200).json({ msg: "Login successful", token, user });
    } catch (e) {
        await session.abortTransaction();
        session.endSession();
        console.error(`Error: ${e}`);
        res.status(500).json({ msg: "Server error", error: e.message });
    }
};

// Google OAuth Login with Transactions
export const googleLoginController = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { access_token } = req.body;

        if (!access_token) {
            return res.status(400).json({ msg: "Access token is required" });
        }

        // Verify Google Access Token
        const googleResponse = await axios.get("https://www.googleapis.com/oauth2/v2/userinfo", {
            headers: { Authorization: `Bearer ${access_token}` },
        });

        const { email, name, id: googleId } = googleResponse.data;

        let user = await User.findOne({ email }).session(session);

        if (!user) {
            // Register user via Google OAuth
            [user] = await User.create([{ email, name, googleId }], { session });
        }

        // Generate token
        const token = await tokenGenerate({ user });

        await session.commitTransaction();
        session.endSession();

        res.status(200).json({ msg: "Login successful", token, user });
    } catch (e) {
        await session.abortTransaction();
        session.endSession();
        console.error(`Error: ${e}`);
        res.status(500).json({ msg: "Google authentication failed", error: e.message });
    }
};
