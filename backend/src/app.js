import express from "express";

const app = express();

app.get("/", (req, res) => {
  res.send("Bienvenido a la API de FocusFlow");
});

export default app;