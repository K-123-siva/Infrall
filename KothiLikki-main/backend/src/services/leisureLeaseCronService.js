const cron = require('node-cron');
const LeisureLease = require('../models/LeisureLease');
const { Op } = require('sequelize');

class LeisureLeaseCronService {
  constructor() {
    this.job = null;
  }

  start() {
    // Run every day at midnight to check for expired leases
    this.job = cron.schedule('0 0 * * *', async () => {
      console.log('🏖️ Running leisure lease expiry check...');
      await this.checkExpiredLeases();
    });

    console.log('✅ Leisure lease cron service started');
    
    // Run immediately on startup
    this.checkExpiredLeases();
  }

  async checkExpiredLeases() {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Find all active leases that have ended
      const expiredLeases = await LeisureLease.findAll({
        where: {
          status: 'active',
          paymentStatus: 'paid',
          endDate: {
            [Op.lt]: today
          }
        }
      });

      if (expiredLeases.length > 0) {
        console.log(`📋 Found ${expiredLeases.length} expired leisure leases`);

        // Mark them as completed
        for (const lease of expiredLeases) {
          await lease.update({ status: 'completed' });
          console.log(`✅ Marked lease ${lease.id} as completed (ended on ${lease.endDate})`);
        }

        console.log(`✅ Completed ${expiredLeases.length} expired leisure leases`);
      } else {
        console.log('✅ No expired leisure leases found');
      }
    } catch (error) {
      console.error('❌ Error checking expired leases:', error);
    }
  }

  stop() {
    if (this.job) {
      this.job.stop();
      console.log('⏹️ Leisure lease cron service stopped');
    }
  }
}

module.exports = new LeisureLeaseCronService();
