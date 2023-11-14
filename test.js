const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const port = 3000;

// MongoDB bağlantı URL'si
const dbUrl = "mongodb://localhost:27017/cleanblog-test-db";

// Mongoose bağlantısını yap
mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true });

// Bağlantı başarılı olduğunda
mongoose.connection.on("connected", () => {
  console.log("MongoDB bağlantısı başarılı.");
});

// Bağlantı hatası olduğunda
mongoose.connection.on("error", (err) => {
  console.error("MongoDB bağlantı hatası:", err);
});

// Post modeli oluştur
const postSchema = new mongoose.Schema({
  title: String,
  detail: String,
  dateCreated: { type: Date, default: Date.now },
});

const Post = mongoose.model("Post", postSchema);

// Middleware: JSON verilerini işlemek için
app.use(bodyParser.json());

// Middleware: Form verilerini işlemek için
app.use(bodyParser.urlencoded({ extended: true }));

// Yeni post eklemek için route
app.post("/add_post", (req, res) => {
  const { title, detail } = req.body;

  const newPost = new Post({
    title,
    detail,
  });

  newPost.save((err) => {
    if (err) {
      console.error("Post kaydedilirken hata oluştu:", err);
      res.status(500).send("Internal Server Error");
    } else {
      console.log("Post başarıyla kaydedildi.");
      res.redirect("/");
    }
  });
});

// Anasayfada postları göstermek için route
app.get("/", (req, res) => {
  Post.find({}, (err, posts) => {
    if (err) {
      console.error("Postları getirirken hata oluştu:", err);
      res.status(500).send("Internal Server Error");
    } else {
      res.render("/", { posts });
    }
  });
});

// Uygulama dinleme
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
