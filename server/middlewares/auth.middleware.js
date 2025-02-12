import { verifyToken } from "../config/helper.js";

export const authValidate = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ msg: "Unauthorized: No token provided", success: false });
        }

        const token = authHeader.split(" ")[1];

        const decodedData = await verifyToken(token);
        if (!decodedData) {
            return res.status(403).json({ msg: "Unauthorized: Invalid or expired token", success: false });
        }

        req.userId = decodedData.user._id;
        req.userDetails = decodedData.user;
        next();
    } catch (e) {
        console.log(`error: ${e}`)
        res.status(500).json({ msg: "Internal Server Error", success: false, error: e.message });
    }
};
