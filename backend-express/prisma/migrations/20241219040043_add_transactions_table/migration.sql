/*
  Warnings:

  - Added the required column `paymentMethod` to the `transactions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `transactions` ADD COLUMN `paymentMethod` VARCHAR(50) NOT NULL;
