import express from "express";

const app = express();
const PORT = 8080;

app.get("/", (_req, res) => {
  res.send("Welcome to Brainflix API");
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}...`);
});
