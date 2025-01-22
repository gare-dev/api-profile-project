const ProfileModel = require("../models/ProfileModel");

const ProfileController = {
  createProfile: async (req, res) => {
    const { name, password } = req.body;
    try {
      const newProfile = await ProfileModel.createProfile(name, password);
      res.status(201).json({ message: "Profile created successfully!" });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error! Profile not created.", error: error });
    }
  },
  getAllProfiles: async (req, res) => {
    try {
      const profiles = await ProfileModel.getAllProfiles();
      res.status(200).json(profiles);
    } catch (error) {
      res.status(500).json({
        message: "Error! It wasn't possible to list all profiles.",
        error: error,
      });
    }
  },
  getProfile: async (req, res) => {
    const id = +req.params.id;
    try {
      const profile = await ProfileModel.getProfile(id);
      if (profile.length === 0) {
        return res.status(404).json({ message: "Profile not found." });
      }
      res.status(200).json(profile);
    } catch (error) {
      res.status(404).json({
        message: "Error!",
        error: error,
      });
    }
  },
  deleteProfile: async (req, res) => {
    const id = +req.params.id;
    try {
      const profile = await ProfileModel.deleteProfile(id);
      if (profile === 1) {
        return res
          .status(201)
          .json({ message: "Profile deleted successfully!" });
      }
      res.status(404).json({ message: "Error! Profile not found." });
    } catch (error) {
      res.status(404).json({
        message: "Error! It wasn't possible to delete the profile.",
        error,
      });
    }
  },
  editProfile: async (req, res) => {
    const { currentName, newName, lastName } = req.body;
    try {
      const editProfile = await ProfileModel.editProfile(
        currentName,
        newName,
        lastName
      );
      res
        .status(203)
        .json({ message: "Profile edited successfully!", editProfile });
    } catch (error) {
      res.status(404).json({
        message: "Error! It wasn't possible to edit the profile.",
        error,
      });
    }
  },
  changePassword: async (req, res) => {
    const { name, newPassword, password } = req.body;
    if (password === newPassword) {
      return res.status(400).json({
        message: "The new password is the same as the current password.",
      });
    }
    try {
      const pass = await ProfileModel.changePassword(
        name,
        newPassword,
        password
      );
      if (!pass) {
        return res.status(403).json({
          message: "Error! You can not change your password! Wrong password.",
        });
      }
      res.status(202).json({ message: "Password changed successfully!", pass });
    } catch (error) {
      res
        .status(404)
        .json({ message: "Error when changing the password", error });
    }
  },
};

module.exports = ProfileController;
