//import express
const express = require("express");

// Import validationResult from express-validator
const { validationResult } = require("express-validator");

//import bcrypt
const bcrypt = require("bcryptjs");

//import jsonwebtoken
const jwt = require("jsonwebtoken");

//import prisma client
const prisma = require("../prisma/client");

//function login
const login = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({
      success: false,
      message: "Validation error",
      errors: errors.array(),
    });
  }

  try {
    // Cari pengguna berdasarkan email
    const user = await prisma.user.findFirst({
      where: {
        email: req.body.email,
      },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        role: true, // Ambil role dari database
        password: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Incorrect password or email",
      });
    }

    // Bandingkan password yang diinput dengan password yang di-hash
    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!validPassword) {
      return res.status(401).json({
        success: false,
        message: "Incorrect password or email",
      });
    }

    // Sertakan role ke dalam payload token
    const token = jwt.sign(
      { id: user.id, role: user.role }, // Role disertakan di sini
      process.env.JWT_SECRET,
      { expiresIn: "11h" }
    );

    // Hapus password dari objek user
    const { password, ...userWithoutPassword } = user;

    // Kembalikan respons
    res.status(200).send({
      success: true,
      message: "Login successfully",
      data: {
        user: userWithoutPassword,
        token: token,
      },
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = { login };
