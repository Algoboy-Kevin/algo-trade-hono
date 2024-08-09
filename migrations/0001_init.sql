-- CreateTable
CREATE TABLE "LogsWebhook" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "alert_name" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "LogsOrder" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "alert_name" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "is_error" BOOLEAN NOT NULL DEFAULT false,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

