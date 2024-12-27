const prisma = require("../prisma/client");
const { validationResult } = require("express-validator");

// Create Transaction
const createTransaction = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({
      success: false,
      message: "Validation error",
      errors: errors.array(),
    });
  }

  const { items, paymentMethod } = req.body;
  const buyerId = req.userId;

  try {
    const transactions = [];

    for (const item of items) {
      const field = await prisma.field.findUnique({
        where: { id: item.fieldId },
      });

      if (!field) {
        return res.status(404).json({
          success: false,
          message: `Field with ID ${item.fieldId} not found`,
        });
      }

      if (field.stock < item.qty) {
        return res.status(400).json({
          success: false,
          message: `Not enough stock for Field ID ${item.fieldId}. Available stock: ${field.stock}`,
        });
      }

      // Buat transaksi utama
      const transaction = await prisma.transaction.create({
        data: {
          buyerId,
          fieldId: item.fieldId,
          qty: item.qty,
          duration: item.duration,
          totalPrice: item.totalPrice,
          paymentMethod,
        },
      });

      // Tambahkan detail transaksi dengan qty default pada `health`
      await prisma.transactionDetail.create({
        data: {
          transactionId: transaction.id,
          health: item.qty,
          sick: 0,
          death: 0,
        },
      });

      // Update stok field
      await prisma.field.update({
        where: { id: item.fieldId },
        data: {
          stock: field.stock - item.qty,
        },
      });

      transactions.push(transaction);
    }

    res.status(201).json({
      success: true,
      message: "Transactions created successfully with details",
      data: transactions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Get Transactions by Buyer
const findTransactionsByBuyer = async (req, res) => {
  const buyerId = req.userId;

  try {
    const transactions = await prisma.transaction.findMany({
      where: { buyerId },
      include: { field: true },
      orderBy: { date: "desc" },
    });

    res.status(200).json({
      success: true,
      message: "Transactions retrieved successfully",
      data: transactions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Cancel Transaction
const cancelTransaction = async (req, res) => {
  const { id } = req.params;
  const buyerId = req.userId;

  try {
    const transaction = await prisma.transaction.findUnique({
      where: { id: Number(id) },
      include: { field: true },
    });

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found",
      });
    }

    if (transaction.buyerId !== buyerId) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to cancel this transaction",
      });
    }

    if (transaction.status === "cancelled") {
      return res.status(400).json({
        success: false,
        message: "Transaction has already been cancelled",
      });
    }

    await prisma.transaction.update({
      where: { id: Number(id) },
      data: { status: "cancelled" },
    });

    await prisma.field.update({
      where: { id: transaction.fieldId },
      data: {
        stock: transaction.field.stock + transaction.qty,
      },
    });

    res.status(200).json({
      success: true,
      message: "Transaction cancelled successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

const updateTransactionDetail = async (req, res) => {
  const { transactionDetailId } = req.params;
  const { health, sick, death } = req.body;

  try {
    const detail = await prisma.transactionDetail.findUnique({
      where: { id: Number(transactionDetailId) },
      include: { transaction: true },
    });

    if (!detail) {
      return res.status(404).json({
        success: false,
        message: "Transaction detail not found",
      });
    }

    const totalUpdate =
      (health ?? detail.health) +
      (sick ?? detail.sick) +
      (death ?? detail.death);

    if (totalUpdate > detail.transaction.qty) {
      return res.status(400).json({
        success: false,
        message: `Total of health, sick, and death cannot exceed transaction quantity (${detail.transaction.qty})`,
      });
    }

    const updatedDetail = await prisma.transactionDetail.update({
      where: { id: Number(transactionDetailId) },
      data: {
        health: health ?? detail.health,
        sick: sick ?? detail.sick,
        death: death ?? detail.death,
      },
    });

    res.status(200).json({
      success: true,
      message: "TransactionDetail updated successfully",
      data: updatedDetail,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

const getTransactionsWithDetails = async (req, res) => {
  const { userId, role } = req; // Ambil userId dan role dari request

  try {
    let transactions;

    if (role === "buyer") {
      // Buyer melihat transaksi mereka sendiri
      transactions = await prisma.transaction.findMany({
        where: { buyerId: userId },
        include: {
          field: {
            include: {
              seller: {
                // Tambahkan data seller
                select: {
                  id: true,
                  name: true,
                  email: true,
                  username: true,
                },
              },
            },
          },
          details: true, // Detail transaksi
          buyer: {
            select: { name: true }, // Nama pembeli
          },
        },
      });
    } else if (role === "seller") {
      // Seller melihat transaksi barang yang dijual
      transactions = await prisma.transaction.findMany({
        where: {
          field: {
            sellerId: userId, // SellerId sesuai dengan userId
          },
        },
        include: {
          field: {
            include: {
              seller: {
                // Tambahkan data seller
                select: {
                  id: true,
                  name: true,
                  email: true,
                  username: true,
                },
              },
            },
          },
          details: true, // Detail transaksi
          buyer: {
            select: { name: true, email: true, username: true }, // Data pembeli
          },
        },
      });
    } else {
      // Jika role tidak sah
      return res.status(403).json({
        success: false,
        message: "You are not authorized to view these transactions",
      });
    }

    res.status(200).json({
      success: true,
      data: transactions,
    });
  } catch (error) {
    // Error handling
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

module.exports = {
  createTransaction,
  findTransactionsByBuyer,
  cancelTransaction,
  updateTransactionDetail,
  getTransactionsWithDetails,
};
