const Comment = require("../models/comment");
const Post = require("../models/post");

exports.createComment = async (req, res) => {
  try {
    const { post, user, body } = req.body;

    // Create a new comment instance
    const newComment = new Comment({ post, user, body });

    // Save the comment to the database
    const savedComment = await newComment.save();

    // Find the associated post and update its comments array
    const updatedPost = await Post.findByIdAndUpdate(
      post,
      { $push: { comments: savedComment._id } },
      { new: true }
    )
      .populate("comments") // Populates comments field
      .exec(); // Executes the query

    if (!updatedPost) {
      return res.status(404).json({ error: "Post not found" });
    }

    // Convert post to plain object
    const formattedPost = updatedPost.toObject();
    formattedPost.postid = formattedPost._id;
    delete formattedPost._id;
    delete formattedPost.__v;

    // Format comments
    formattedPost.comments = formattedPost.comments.map((comment) => ({
      commentid: comment._id, // Rename _id to commentid
      postid: comment.post, // Keep post reference
      user: comment.user,
      body: comment.body,
    }));

    res.status(200).json({ post: formattedPost });
  } catch (error) {
    console.error("Error:", error);
    return res
      .status(500)
      .json({ error: "Error while creating comment" });
  }
};
