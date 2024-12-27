/*
  Warnings:

  - A unique constraint covering the columns `[username]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `username` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `users` ADD COLUMN `role` ENUM('seller', 'buyer') NOT NULL DEFAULT 'seller',
    ADD COLUMN `username` VARCHAR(255) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `username` ON `users`(`username`);
