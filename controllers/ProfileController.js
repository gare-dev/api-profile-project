const ProfileModel = require("../models/ProfileModel");
const jwt = require("jsonwebtoken");
const cryptr = require("../cryptr/cryptr");

const ProfileController = {
  createProfile: async (req, res) => {
    const { name, password } = req.body;
    if (!name || !password) {
      return res.status(400).json({
        message: "Profile not created. Name or password is missing.",
        error: "NO_NAME_OR_PASS",
      });
    }

    if (typeof name === number) {
      return res.status(400).json({
        message: "Profile not created. Your username can not be a number.",
        error: "USER_HAS_NUM",
      });
    }

    try {
      const result = await ProfileModel.checkUsername(name);
      if (result.rowCount === 1) {
        return res.status(409).json({
          message:
            "Profile not created. A profile with this username already exists.",
          error: "DUPLICATED_PROFILE",
        });
      }
    } catch (error) {
      res.status(500).json({ message: "Server error." });
    }

    try {
      await ProfileModel.createProfile(name, password);
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
        message: "Server error.",
        error: error,
      });
    }
  },
  getProfile: async (req, res) => {
    const id = +req.params.id;

    if (!id) {
      return res.status(405).json({
        message: "Error! The id must be a number.",
        error: "INVALID_ID",
      });
    }

    try {
      const profile = await ProfileModel.getProfile(id);
      if (profile.length === 0) {
        return res
          .status(404)
          .json({ message: "Profile not found.", error: "PROFILE_NOT_FOUND" });
      }
      res.status(200).json(profile);
    } catch (error) {
      res.status(500).json({
        message: "Server error.",
        error: error,
      });
    }
  },
  deleteProfile: async (req, res) => {
    const id = +req.params.id;
    if (!id) {
      return res.status(405).json({
        message: "Error! The id must be a number.",
        error: "INVALID_ID",
      });
    }
    try {
      const profile = await ProfileModel.deleteProfile(id);
      if (profile === 1) {
        return res
          .status(200)
          .json({ message: "Profile deleted successfully!" });
      }
      res.status(404).json({
        message: "Error! Profile not found.",
        error: "PROFILE_NOT_FOUND",
      });
    } catch (error) {
      res.status(500).json({
        message: "Server error.",
        error,
      });
    }
  },
  editProfile: async (req, res) => {
    const { name, newName, lastName } = req.body;

    if (name === newName) {
      return res.status(400).json({
        message: "Error! Your new name can not be your current name.",
        error: "REPEATED_NAME",
      });
    }

    if (!name || !newName) {
      return res.status(404).json({
        message:
          "Impossible edit the profile. Missing name, newName or lastName.",
        error: "MISSING_INFO",
      });
    }

    try {
      const checkUsername = await ProfileModel.checkUsername(newName);
      const checkCurrentName = await ProfileModel.checkUsername(name);

      if (checkCurrentName.rowCount === 0) {
        return res.status(400).json({
          message: "Error! Profile not found.",
          error: "PROFILE_NOT_FOUND",
        });
      }

      if (checkUsername.rowCount === 1) {
        return res.status(400).json({
          message: "Error! Already exits an account with this name.",
          error: "USED_NAME",
        });
      }
    } catch (error) {
      return res.status(500).json({
        message: "Server error while checking username.",
        error,
      });
    }

    try {
      const editProfile = await ProfileModel.editProfile(
        name,
        newName,
        lastName
      );
      if (editProfile.rowCount === 0) {
        return res.status(404).json({
          message: "Error. Profile not found.",
          error: "PROFILE_NOT_FOUND",
        });
      }

      res.status(201).json({ message: "Profile edited successfully!" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "Server error.",
        error,
      });
    }
  },
  changePassword: async (req, res) => {
    const { name, newPassword, password } = req.body;
    if (!name || !newPassword || !password) {
      return res.status(404).json({
        messsage: "Error. Missing name, password or newPassword.",
        error: "MISSING_INFO",
      });
    }
    if (newPassword.length < 3) {
      return res.status(400).json({
        message: "Error! Your new password must have at least 7 characters.",
        error: "INVALID_NUM_PASSWORD",
      });
    }
    if (cryptr.decrypt(password) === newPassword) {
      return res.status(400).json({
        message: "Error. The new password is the same as the current password.",
        error: "REPEATED_PASSWORD",
      });
    }
    try {
      const pass = await ProfileModel.changePassword(
        name,
        newPassword,
        password
      );
      if (!pass) {
        return res.status(400).json({
          message: "Error! You can not change your password! Wrong password.",
          error: "WRONG_PASSWORD",
        });
      }
      res.sendStatus(204);
    } catch (error) {
      res.status(500).json({ message: "Server error.", error });
    }
  },
  authProfile: async (req, res) => {
    const { name, password } = req.body;
    if (!name || !password) {
      res.status(404).json({
        message: "Error! Missing name or password.",
        error: "MISSING_INFO",
      });
    }
    try {
      const login = await ProfileModel.loginProfile(name, password);

      if (login.rowCount === 1) {
        const name = login.rows[0].name;
        const token = jwt.sign(
          { name, id: login.rows[0].id },
          process.env.SECRET,
          {
            expiresIn: 3600,
          }
        );

        return res
          .status(200)
          .json({ message: "Logged successfully!", token: token, auth: true });
      }
      return res.status(404).json({
        message: "Error! Wrong username or password.",
        error: "WRONG_INFO",
      });
    } catch (error) {
      res.status(500).json({ message: "Server error.", error });
    }
  },
};

module.exports = ProfileController;
