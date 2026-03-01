require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/properties", require("./routes/propertyRoutes"));

app.listen(5000, () => {
  console.log("Server running on port 5000");
});