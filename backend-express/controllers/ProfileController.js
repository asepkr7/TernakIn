const prisma = require("../prisma/client");
const { validationResult } = require("express-validator");

// GET Profile by User ID
const findProfileByUserId = async (req, res) => {
  const { userId } = req.params;

  try {
    const profile = await prisma.profile.findUnique({
      where: { userId: Number(userId) },
      include: { user: true }, // Relasi ke User
    });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found",
      });
    }

    res.status(200).json({
      success: true,
      message: `Get profile for user ID: ${userId}`,
      data: profile,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// CREATE or UPDATE Profile
const upsertProfile = async (req, res) => {
  const { userId } = req.params;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({
      success: false,
      message: "Validation error",
      errors: errors.array(),
    });
  }

  const image = req.file ? req.file.filename : null;

  try {
    const profile = await prisma.profile.upsert({
      where: { userId: Number(userId) },
      update: {
        image,
        address: req.body.address,
        postalCode: req.body.postalCode,
        gender: req.body.gender,
        city: req.body.city,
        phoneNumber: req.body.phoneNumber,
      },
      create: {
        userId: Number(userId),
        image,
        address: req.body.address,
        postalCode: req.body.postalCode,
        gender: req.body.gender,
        city: req.body.city,
        phoneNumber: req.body.phoneNumber,
      },
    });

    res.status(200).json({
      success: true,
      message: "Profile upserted successfully",
      data: profile,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// DELETE Profile
const deleteProfile = async (req, res) => {
  const { userId } = req.params;

  try {
    await prisma.profile.delete({
      where: { userId: Number(userId) },
    });

    res.status(200).json({
      success: true,
      message: "Profile deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = {
  findProfileByUserId,
  upsertProfile,
  deleteProfile,
};
