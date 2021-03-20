import LogT from 'logt'

const TAG = 'h265-player'

const log = new LogT(5)

export const logger = {
  ok: (...args: any[]) => {
    log.silly(TAG, '', ...args)
  },
  info: (...args: any[]) => {
    log.info(TAG, '', ...args)
  },
  warn: (...args: any[]) => {
    log.warn(TAG, '', ...args)
  },
  fatal: (...args: any[]) => {
    log.error(TAG, '', ...args)
  },
  verbose: (...args: any[]) => {
    log.verbose(TAG, '', ...args)
  }
}
