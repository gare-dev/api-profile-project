const express = require("express");
const ProfileController = require("./controllers/ProfileController");
require("dotenv").config();
const verifyJWT = require("./middleware/verifyJWT");
const RequestLogger = require("./controllers/RequestLogController");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(RequestLogger.requestLog);

app.post("/api/auth", ProfileController.authProfile);
app.get("/", (req, res) => {
  res.send("Olá!");
});

app.use(verifyJWT);

app.post("/api/createProfile", ProfileController.createProfile);
app.get("/api/getAllProfile", ProfileController.getAllProfiles);
app.get("/api/getProfile/:id", ProfileController.getProfile);
app.delete("/api/deleteProfile/:id", ProfileController.deleteProfile);
app.post("/api/editProfile", ProfileController.editProfile);
app.post("/api/changePassword", ProfileController.changePassword);

app.listen(PORT, () => {
  console.log("Server running!");
});
