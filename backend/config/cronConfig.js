// cron/cleanupUnverifiedUsers.js
const cron = require("node-cron");
const Users = require("../models/userModel");
const logger = require("../Utils/logger");

// Configuration
const CRON_SCHEDULE = "0 0 * * *"; // every midnight
const VERIFICATION_TTL_MINUTES = 10; // delete unverified users older than this
const BATCH_SIZE = 100;

const cleanupUnverifiedUsers = async () => {
  try {
    const cutoff = new Date(Date.now() - VERIFICATION_TTL_MINUTES * 60 * 1000);

    let usersToDelete;
    let totalDeleted = 0;

    do {
      usersToDelete = await Users.find({
        isAccountVerified: false,
        createdAt: { $lt: cutoff },
      }).limit(BATCH_SIZE);

      if (usersToDelete.length > 0) {
        const emails = usersToDelete.map(u => u.email);
        totalDeleted += usersToDelete.length;

        // Delete batch
        await Users.deleteMany({
          _id: { $in: usersToDelete.map(u => u._id) }
        });

        logger.info(`[CRON] Deleted ${usersToDelete.length} unverified users: ${emails.join(", ")}`);
      }
    } while (usersToDelete.length > 0);

    if (totalDeleted > 0) {
      logger.info(`[CRON] Total unverified users deleted this run: ${totalDeleted}`);
    }
  } catch (err) {
    logger.error("[CRON ERROR] Failed to delete unverified users", {
      error: err.message,
      stack: err.stack
    });
  }
};

// Schedule the cron job
cron.schedule(CRON_SCHEDULE, cleanupUnverifiedUsers);

