const express = require("express");
const app = express();
const apiRouter = require("./routes");
const cookieParser = require("cookie-parser");

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// middleware routes

app.use(express.json());
app.use(cookieParser());
app.use("/api/v1", apiRouter);
app.listen(8000, () => {
  console.log("Example app listening on port 8000!");
});
