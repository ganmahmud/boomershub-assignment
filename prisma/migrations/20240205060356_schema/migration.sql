/*
  Warnings:

  - A unique constraint covering the columns `[name,address]` on the table `Provider` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `Provider` ADD COLUMN `mapUrl` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `ProviderImage` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `url` VARCHAR(191) NOT NULL,
    `providerId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Provider_name_address_key` ON `Provider`(`name`, `address`);

-- AddForeignKey
ALTER TABLE `ProviderImage` ADD CONSTRAINT `ProviderImage_providerId_fkey` FOREIGN KEY (`providerId`) REFERENCES `Provider`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
