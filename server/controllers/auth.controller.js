import axios from "axios";
import { comparePassword, hashedPassword, tokenGenerate } from "../config/helper.js";
import User from "../models/auth.model.js";

// Manual Registration
export const registerController = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Validate input
        if (!name || !email || !password) {
            return res.status(400).json({ msg: "All fields are required" });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ msg: "User already exists" });
        }

        // Hash the password
        const hashedPasswordRes= await hashedPassword(password);

        // Create user
        const newUser = await User.create({ name, email, password: hashedPasswordRes });

        res.status(201).json({ msg: "Registration successful", user: newUser });
    } catch (e) {
        console.log(`error: ${e}`)
        res.status(500).json({ msg: "Server error", error: e.message });
    }
};

// Manual Login
export const loginController = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({ msg: "Email and password are required" });
        }

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: "Invalid email or password" });
        }

        // Compare passwords
        const isMatch = await comparePassword(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: "Invalid email or password" });
        }

        // Generate token
        const token = await tokenGenerate({ user });

        res.status(200).json({ msg: "Login successful", token, user });
    } catch (e) {
        console.log(`error: ${e}`)
        res.status(500).json({ msg: "Server error", error: e.message });
    }
};

// Google OAuth Login
export const googleLoginController = async (req, res) => {
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

        let user = await User.findOne({ email });

        if (!user) {
            // Register user via Google OAuth
            user = await User.create({ email, name, googleId });
        }

        // Generate token
        const token = await tokenGenerate({ user });

        console.log("🚀 ~ googleLoginController ~ token:", token)
        res.status(200).json({ msg: "Login successful", token, user });
    } catch (e) {
        console.log(`error: ${e}`)
        res.status(500).json({ msg: "Google authentication failed", error: e.message });
    }
};
