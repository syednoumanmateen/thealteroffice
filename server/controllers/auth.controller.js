import axios from "axios";
import { comparePassword, tokenGenerate } from "../config/helper.js";
import User from "../models/auth.model.js";

// Manual Registration
export const registerController = async (req, res) => {
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await hashedPassword(password);
        await User.create({ name, email, password: hashedPassword });

        res.status(201).json({ message: "User registered successfully" });
    } catch (e) {
        res.status(500).json({ message: e?.message });
    }
};

// Manual Login
export const loginController = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user || !user?.password) {
            res.status(400).json({ message: "Invalid credentials" });
        }

        const isMatch = await comparePassword(password, user?.password);
        if (!isMatch) {
            res.status(400).json({ message: "Invalid credentials" });
        }

        const token = await tokenGenerate({ id: user?._id });
        res.json({ token, user });
    } catch (e) {
        res.status(500).json({ message: e?.message });
    }
};

export const googleLoginController = async (req, res) => {
    try {
        const { credential } = req.body;

        const googleResponse = await axios.get(`https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${credential}`);
        const { email, name, sub } = googleResponse.data;

        let user = await User.findOne({ email });
        if (!user) {
            user = await User.create({ email, name, googleId: sub });
        }

        const token = await tokenGenerate({ id: user?._id });
        res.json({ token, user });
    } catch (e) {
        res.status(500).json({ message: "Google authentication failed" });
    }
};

export const googleAuthController = async (req, res) => {
    try {
        const { access_token } = req.body;

        // Verify Google Access Token
        const googleResponse = await axios.get("https://www.googleapis.com/oauth2/v2/userinfo", {
            headers: { Authorization: `Bearer ${access_token}` },
        });

        const userData = googleResponse.data;

        return res.json({ user: userData });
    } catch (error) {
        return res.status(500).json({ message: "Google authentication failed" });
    }
};