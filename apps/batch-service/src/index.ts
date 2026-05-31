import cron from 'node-cron';
import { createServer, startServer } from '@bankeros/shared-utils/src/server';
import { batchRoutes } from './routes/batch';
import { prisma } from '@bankeros/database';
import { runEodInterestAccrual } from './jobs/eod.job';

async function scheduleDailyEod() {
  // Run EOD at 23:55 every day
  cron.schedule('55 23 * * *', async () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const job = await prisma.batchJob.create({
      data: {
        name: `EOD_INTEREST_${today.toISOString().split('T')[0]}`,
        type: 'EOD_INTEREST',
        businessDate: today,
        status: 'PENDING',
      },
    });

    await runEodInterestAccrual(job.id, today);
  }, { timezone: 'UTC' });

  console.log('EOD cron scheduler registered (23:55 UTC daily)');
}

async function main() {
  const app = await createServer({ serviceName: 'Batch Service' });
  await app.register(batchRoutes, { prefix: '/v1/batch-jobs' });
  await app.register(batchRoutes, { prefix: '/v1/reporting' });

  await scheduleDailyEod();

  const port = parseInt(process.env.PORT || '3010');
  await startServer(app, port, 'Batch Service');
}

main();
