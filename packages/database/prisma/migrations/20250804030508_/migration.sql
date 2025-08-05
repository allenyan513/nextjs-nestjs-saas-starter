/*
  Warnings:

  - You are about to drop the column `bindingFormId` on the `Product` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "public"."Product_slug_key";

-- AlterTable
ALTER TABLE "public"."Product" DROP COLUMN "bindingFormId",
ALTER COLUMN "url" SET DEFAULT '';
