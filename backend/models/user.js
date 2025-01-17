import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
    { username: {
        type: String,
        required: true,
        unique: true
    },
    fullname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    ip: {
        type: String,
        default: "",
    },
    password: {
        type: String,
        required: true,
        minLength: 6,
    },
    location:{
        latitude: {
            type: Number,
        },
        longitude: {
            type: Number,
        },
    },
    followers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: [],
        }
    ],
    following: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: [],
        }
    ],
    profileImg: {
        type: String,
        default: "",
    },
    coverImg: {
        type: String,
        default: "",
    },
    bio: {
        type: String,
        default: "",
    },
    link: {
        type: String,
        default: "",
    },
    likedPosts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Post',
            default: [],
        }
    ],
},
    {timestamps: true}
);

export default mongoose.model('User', userSchema);