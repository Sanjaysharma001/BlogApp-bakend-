const Post = require("../models/post");

exports.createPost = async (req, res) => {
  try {
    const { title, body } = req.body;

    // Create and save new post
    const newPost = new Post({ title, body });
    const savedPost = await newPost.save();

    // Convert to plain object and format response
    const formattedPost = savedPost.toObject();
    formattedPost.postid = formattedPost._id;
    delete formattedPost._id;
    delete formattedPost.__v;

    res.status(200).json({ post: formattedPost });
  } catch (error) {
    console.error("Error:", error);
    return res
      .status(500)
      .json({ error: error.message || "Error while creating post" });
  }
};

exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("likes")
      .populate("comments")
      .exec();

    // Format posts before sending response
    const formattedPosts = posts.map((post) => {
      const formattedPost = post.toObject();
      formattedPost.postid = formattedPost._id;
      delete formattedPost._id;
      delete formattedPost.__v;

      // Format comments inside each post
      formattedPost.comments = formattedPost.comments.map((comment) => {
        const formattedComment = comment.toObject();
        formattedComment.commentid = formattedComment._id;
        delete formattedComment._id;
        delete formattedComment.__v;
        return formattedComment;
      });

      return formattedPost;
    });

    res.status(200).json({ posts: formattedPosts });
  } catch (error) {
    console.error("Error:", error);
    return res
      .status(500)
      .json({ error:"Error while fetching posts" });
  }
};
