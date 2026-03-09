import mongoose from "mongoose";


const userSchema = new mongoose.Schema(
  {
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    cartData:{
        type:Object,
        default:{}

    }
},{minimize: false , timestamps: true}) // to store empty objects in cartData field(mongoose removes empty objects by default)

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;
