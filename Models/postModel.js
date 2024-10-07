const mongoose = require("mongoose");
const postSchema = mongoose.Schema(
    {
        userId: { type: String, required: true },
        desc: { type: String, required: true },
        likes: [],
        createdAt: {
            type: Date,
            default: new Date(),
        },
        image: String,
        comments: [
            {
                userId: { type: String, required: true },
                text: { type: String, required: true },
                createdAt: { type: Date, default: Date.now },
            }
        ]
    },
    {
        timestamps: true,
    }
);

var PostModel = mongoose.model("Posts", postSchema);
module.exports = PostModel