import { CronJob } from 'cron';

const TEST_CRON_INTERVAL: string = '* 1 * * * *';

/**
 * @class Cron
 */
export default class Cron {
    private static testCron(): void {
        new CronJob(TEST_CRON_INTERVAL, (): void => {
            console.log('Hello, I am Cron! Please see ../config/cron.ts');
        },
            null,
            true);
    }

    // init
    static init(): void {
        Cron.testCron();
    }
}
