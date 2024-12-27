const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const router = require("./routes");
const errorHandler = require("./middlewares/errrorHandle.js");
const path = require("path");

const app = express();
app.use(errorHandler);
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
const port = 3000;

app.get("/", (req, res) => {
  res.send("Hello Asep");
});
app.use("/api", router);

app.listen(port, () => {
  console.log(`Server berjalan pada http://localhost:${port}`);
});

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
