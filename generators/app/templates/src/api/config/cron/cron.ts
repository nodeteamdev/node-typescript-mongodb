import { CronJob } from 'cron';

const TEST_CRON_INTERVAL: string = '* * 1 * * *';

/**
 * @export
 * @class Cron
 */
export default class Cron {
    /**
     * @private
     * @static
     * @memberof Cron
     */
    private static testCron(): void {
        new CronJob(TEST_CRON_INTERVAL, (): void => {
            console.log('Hello, I am Cron! Please see ../config/cron.ts');
        },
            null,
            true);
    }

    /**
     * @static
     * @memberof Cron
     */
    static init(): void {
        Cron.testCron();
    }
}
