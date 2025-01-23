require("dotenv").config();
const express = require("express");
const ProfileController = require("./controllers/ProfileController");
const verifyJWT = require("./functions/verifyJWT");

const app = express();
const PORT = 3000;

app.use(express.json());

app.post("/api/loginProfile", ProfileController.loginProfile);

// app.use(verifyJWT);

app.get("/", (req, res) => {
  res.send("<h1>Olá!</h1>");
});
app.post("/api/createProfile", ProfileController.createProfile);
app.get("/api/getAllProfile", verifyJWT, ProfileController.getAllProfiles);
app.get("/api/getProfile/:id", ProfileController.getProfile);
app.delete("/api/deleteProfile/:id", ProfileController.deleteProfile);
app.post("/api/editProfile", ProfileController.editProfile);
app.post("/api/changePassword", ProfileController.changePassword);

app.listen(PORT, () => {
  console.log("Server running!");
});
