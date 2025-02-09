import { verifyToken } from "../config/helper.js";

export const authValidate = async (req, res, next) => {
    try {
        const token = req.headers['authorization'].split(" ")[1]
        const decodedData = await verifyToken(token)
        if (!decodedData) return res.status(200).send({ msg: "Un-Authorized", success: false })

        req.userId = decodedData._id
        req.userDetails = decodedData
        next()
    } catch (e) {
        console.log("🚀 ~ Authorization ~ e:", e)
        res.status(500).send({ msg: e.message, success: false })
    }
}