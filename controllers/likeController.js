const Like = require("../models/like");
const Post = require("../models/post");

exports.likePost = async (req, res) => {
    try {
        const { post, user } = req.body;

        // Create a new like instance
        const newLike = new Like({ post, user });
        const savedLike = await newLike.save();

        // Add like to the post
        const updatedPost = await Post.findByIdAndUpdate(
            post,
            { $push: { likes: savedLike._id } },
            { new: true }
        );

        if (!updatedPost) {
            return res.status(404).json({ error: "Post not found" });
        }

        // Convert post to plain object
        const formattedPost = updatedPost.toObject();
        formattedPost.postid = formattedPost._id;
        delete formattedPost._id;
        delete formattedPost.__v;

        // Format likes
        formattedPost.likes = formattedPost.likes.map((like) => ({
            likeid: like._id, // Rename _id to likeid
            postid: like.post, // Keep post reference
            user: like.user,
        }));

        res.status(200).json({ post: formattedPost });

    } catch (error) {
        console.error("Error:", error);
        return res.status(400).json({ error: error.message || "Error while liking post" });
    }
};


exports.unlikePost = async (req, res) => {
    try {
        const { post, like } = req.body;

        // Remove the like document
        const deletedLike = await Like.findOneAndDelete({ post: post, _id: like });

        if (!deletedLike) {
            return res.status(404).json({ error: "Like not found" });
        }

        // Remove like reference from post
        const updatedPost = await Post.findByIdAndUpdate(
            post,
            { $pull: { likes: like } },
            { new: true }
        );

        if (!updatedPost) {
            return res.status(404).json({ error: "Post not found" });
        }

        // Convert post to plain object
        const formattedPost = updatedPost.toObject();
        formattedPost.postid = formattedPost._id;
        delete formattedPost._id;
        delete formattedPost.__v;

        // Format likes
        formattedPost.likes = formattedPost.likes.map((like) => ({
            likeid: like._id, // Rename _id to likeid
            postid: like.post, // Keep post reference
            user: like.user,
        }));

        res.status(200).json({ post: formattedPost });

    } catch (error) {
        console.error("Error:", error);
        return res.status(400).json({ error: error.message || "Error while unliking post" });
    }
};
