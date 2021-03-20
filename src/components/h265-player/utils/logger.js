import LogT from 'logt';
const TAG = 'h265-player';
const log = new LogT(5);
export const logger = {
    ok: (...args) => {
        log.silly(TAG, '', ...args);
    },
    info: (...args) => {
        log.info(TAG, '', ...args);
    },
    warn: (...args) => {
        log.warn(TAG, '', ...args);
    },
    fatal: (...args) => {
        log.error(TAG, '', ...args);
    },
    verbose: (...args) => {
        log.verbose(TAG, '', ...args);
    }
};
