import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true,
        enum: ['Admin','Security','Manager','HR']
    }
},
{
    timestamps: true
});

const User = mongoose.model("User",userSchema);

export default User;