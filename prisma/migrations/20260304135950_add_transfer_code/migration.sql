-- CreateTable
CREATE TABLE "TransferCode" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "codeHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "usedAt" TIMESTAMP(3),

    CONSTRAINT "TransferCode_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TransferCode_codeHash_key" ON "TransferCode"("codeHash");

-- CreateIndex
CREATE INDEX "TransferCode_userId_createdAt_idx" ON "TransferCode"("userId", "createdAt");

-- AddForeignKey
ALTER TABLE "TransferCode" ADD CONSTRAINT "TransferCode_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
