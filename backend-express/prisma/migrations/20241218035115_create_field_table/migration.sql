/*
  Warnings:

  - Added the required column `wide` to the `fields` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `fields` ADD COLUMN `wide` DECIMAL(10, 2) NOT NULL;
