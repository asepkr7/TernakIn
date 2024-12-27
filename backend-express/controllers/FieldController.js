const express = require("express");
const prisma = require("../prisma/client");
const { validationResult } = require("express-validator");

// Ambil konfigurasi upload Multer
const { upload } = require("../middlewares/multer");

// GET all fields
const findFields = async (req, res) => {
  try {
    const fields = await prisma.field.findMany({
      include: { seller: true },
      orderBy: { id: "desc" },
    });

    res.status(200).json({
      success: true,
      message: "Get all fields successfully",
      data: fields,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const findFieldsByLoggedInSeller = async (req, res) => {
  const sellerId = req.sellerId; // Dapatkan sellerId dari middleware

  try {
    const fields = await prisma.field.findMany({
      where: { sellerId }, // Filter berdasarkan sellerId
      include: { seller: true },
      orderBy: { id: "desc" },
    });

    res.status(200).json({
      success: true,
      message: "Get fields for logged-in seller successfully",
      data: fields,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
const findFieldById = async (req, res) => {
  const { id } = req.params;

  try {
    const field = await prisma.field.findUnique({
      where: { id: Number(id) },
      include: { seller: true },
    });

    if (!field) {
      return res.status(404).json({
        success: false,
        message: "Field not found",
      });
    }

    res.status(200).json({
      success: true,
      message: `Get field by ID: ${id}`,
      data: field,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// CREATE a new field
const createField = async (req, res) => {
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
    const field = await prisma.field.create({
      data: {
        name: req.body.name,
        address: req.body.address,
        city: req.body.city,
        type: req.body.type,
        image: req.file ? req.file.filename : null,
        description: req.body.description,
        price: Number(req.body.price),
        stock: Number(req.body.stock),
        wide: Number(req.body.wide),
        sellerId: Number(req.body.sellerId),
      },
    });

    res.status(201).json({
      success: true,
      message: "Field created successfully",
      data: field,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// UPDATE a field
const updateField = async (req, res) => {
  const { id } = req.params;
  const {
    name,
    address,
    city,
    type,
    price,
    wide,
    stock,
    description,
    sellerId,
  } = req.body;

  try {
    // Prepare data object with conditional image handling
    const dataToUpdate = {
      name,
      address,
      city,
      type,
      price: Number(price),
      wide: Number(wide),
      stock: Number(stock),
      description,
      sellerId: Number(sellerId),
    };

    // Add image only if it's provided in the request
    if (req.file) {
      dataToUpdate.image = req.file.filename;
    }

    const updatedField = await prisma.field.update({
      where: { id: Number(id) },
      data: dataToUpdate,
    });

    res.status(200).json({
      success: true,
      message: "Field updated successfully",
      data: updatedField,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to update the field. Please try again.",
    });
  }
};

// DELETE a field
const deleteField = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.field.delete({
      where: { id: Number(id) },
    });
    res.status(200).json({
      success: true,
      message: "Field deleted successfully",
    });
  } catch (error) {
    if (error.code === "P2003") {
      // Prisma error code P2003: Foreign key constraint failed
      res.status(400).json({
        success: false,
        message:
          "The data cannot be deleted because it is referenced by other records..",
      });
    } else {
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }
};

module.exports = {
  findFields,
  findFieldsByLoggedInSeller,
  findFieldById,
  createField,
  updateField,
  deleteField,
};
