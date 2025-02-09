import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    googleId: { type: String }
}, {
    timestamps: true,
     collection:"user"
})

const user = mongoose.model("user", userSchema)

export default user