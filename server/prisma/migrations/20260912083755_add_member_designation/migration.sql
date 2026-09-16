-- AlterTable
ALTER TABLE "Member" ADD COLUMN     "designation" TEXT,
ADD COLUMN     "designationOrder" INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE INDEX "Member_designation_idx" ON "Member"("designation");

-- CreateIndex
CREATE INDEX "Member_designationOrder_idx" ON "Member"("designationOrder");
