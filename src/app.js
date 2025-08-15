import express from "express";

const app = express();
app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.get("/about", (req, res) => {
  res.send("About Page");
});

export default app;
