const express = require("express");

const app = express();

require("dotenv").config();
const PORT = process.env.PORT || 7000;

app.use(express.json());

const blog = require("./routes/blog");
app.use("/api/v1", blog);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

const dbConnect = require("./config/database");
dbConnect();

app.patch("/ping", (req, res) => {
  res.send({
    message: "pong",
  });
});
