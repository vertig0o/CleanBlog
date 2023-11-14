const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ejs = require("ejs");
const path = require("path");
const postControllers = require("./controllers/postControllers");
const pageControllers = require("./controllers/pageControllers");

const app = express();

//Connect MONGODB

mongoose.connect("mongodb://127.0.0.1:27017/cleanblog-test-db");

//TEMPLATE ENGINE
app.set("view engine", "ejs");

//MIDDLEWARES
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
  methodOverride("_method", {
    methods: ["POST", "GET"],
  })
);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});

//ROUTES
app.get("/about", pageControllers.getAboutPage);
app.get("/post", pageControllers.getPostPage);
app.get("/add_post", pageControllers.getAddPage);

app.get("/", postControllers.getAllPosts);
app.get("/posts/:id", postControllers.getPost);
app.post("/posts", postControllers.createPost);
app.get("/posts/edit/:id", postControllers.getEditPage);
app.put("/posts/:id", postControllers.updatePost);
app.delete("/posts/:id", postControllers.deletePost);

const port = 3000;
app.listen(port, () => {
  console.log(`Sunucu ${port} portunda baslatildi..`);
});
