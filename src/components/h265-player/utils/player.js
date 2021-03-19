import WasmPlayer from '@easydarwin/easywasmplayer/EasyWasmPlayer.js';
import Emittery from 'emittery';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
export const getRandomElemId = () => {
    return uuidv4();
};
const log = {
    info: (...args) => {
        console.log('[h265-player]', ...args);
    },
    warn: (...args) => {
        console.warn('[h265-player]', ...args);
    },
    fatal: (...args) => {
        console.error('[h265-player]', ...args);
    },
};
export var H265PlayerConstants;
(function (H265PlayerConstants) {
    H265PlayerConstants["on_play"] = "on_play";
    H265PlayerConstants["on_stop"] = "on_stop";
    H265PlayerConstants["on_endLoading"] = "on_endLoading";
    H265PlayerConstants["on_pause"] = "on_pause";
    H265PlayerConstants["on_resume"] = "on_resume";
    H265PlayerConstants["on_dispose"] = "on_dispose";
    H265PlayerConstants["on_error"] = "on_error";
    H265PlayerConstants["on_player_cb"] = "on_player_cb";
})(H265PlayerConstants || (H265PlayerConstants = {}));
export class H265Player extends Emittery {
    constructor(elemId, maxRetryCount = 3) {
        super();
        this.timer = 0;
        this.currentUrl = '';
        this.elemId = elemId;
        this.maxRetryCount = maxRetryCount <= 0 ? 3 : maxRetryCount;
        this.retryCount = this.maxRetryCount;
        this.init();
    }
    init() {
        if (this.player) {
            this.dispose();
        }
        log.info('init player ~');
        this.player = new WasmPlayer(null, this.elemId, this.playerCbFunc.bind(this), {
            Height: true,
            HideKbs: true,
        });
    }
    play(url) {
        var _a;
        if (!url) {
            log.fatal('url is not valid');
            this.dispose();
            return;
        }
        log.info('start to play ~');
        (_a = this.player) === null || _a === void 0 ? void 0 : _a.play(url, 1);
        this.currentUrl = url;
        this.startUrlHeartBeat();
    }
    pause() {
        var _a;
        log.warn('player pause');
        this.emit(H265PlayerConstants.on_pause);
        (_a = this.player) === null || _a === void 0 ? void 0 : _a.destroy();
        this.player = null;
        this.stopUrlHeartBeat();
    }
    resume() {
        log.info('player resume');
        this.emit(H265PlayerConstants.on_resume);
        this.init();
        this.play(this.currentUrl);
    }
    playerCbFunc(type) {
        log.info('player cb function：', type);
        this.emit(H265PlayerConstants.on_player_cb, type);
        switch (type) {
            case 'play':
                this.emit(H265PlayerConstants.on_play);
                this.player.endLoading();
                break;
            case 'stop':
                this.emit(H265PlayerConstants.on_stop);
                this.dispose();
                break;
            case 'endLoading':
                this.emit(H265PlayerConstants.on_endLoading);
                break;
            case 'pause':
                this.emit(H265PlayerConstants.on_pause);
                break;
            default:
                break;
        }
    }
    changeUrl(newUrl) {
        log.info('change url');
        this.dispose();
        this.init();
        this.play(newUrl);
    }
    dispose() {
        var _a;
        log.warn('dispose player');
        this.stopUrlHeartBeat();
        (_a = this.player) === null || _a === void 0 ? void 0 : _a.destroy();
        this.player = null;
        this.currentUrl = '';
        this.retryCount = this.maxRetryCount;
        this.emit(H265PlayerConstants.on_dispose);
    }
    stopUrlHeartBeat() {
        log.warn('stop url alive heartbeat');
        if (this.timer) {
            window.clearTimeout(this.timer);
        }
    }
    startUrlHeartBeat() {
        this.stopUrlHeartBeat();
        const url = this.currentUrl;
        if (!url) {
            log.fatal('start url heart beat failed , because of url is not ok, url is:', url);
            return;
        }
        const HEART_BEAT_TIMEOUT = 6 * 1000;
        log.info(`start url alive heartbeat, every ${HEART_BEAT_TIMEOUT} seconds`);
        checkUrlIsValid(url)
            .then(() => {
            log.info('url heartbeat ok, prepare for next ~');
            this.timer = window.setTimeout(() => {
                this.startUrlHeartBeat();
            }, HEART_BEAT_TIMEOUT);
        })
            .catch((e) => {
            this.retryCount--;
            log.fatal('url heartbeat failed with');
            log.fatal(e);
            if (this.retryCount <= 0) {
                log.warn('reach max retry count, will dispose player ');
                this.emit(H265PlayerConstants.on_error, e);
                this.dispose();
            }
            else {
                log.info('left retry count is: ', `${this.retryCount} / ${this.maxRetryCount} (used / total)`);
                log.info('retry heartbeat ...');
                this.timer = window.setTimeout(() => {
                    this.startUrlHeartBeat();
                }, HEART_BEAT_TIMEOUT);
            }
        });
    }
}
const checkUrlIsValid = (url, timeout = 5 * 1000) => {
    return new Promise((resolve, reject) => {
        if (!url.includes('m3u8'))
            return resolve();
        axios
            .get(`${url}&__time=${Date.now()}`, {
            responseType: 'blob',
            timeout,
        })
            .then(resolve)
            .catch((e) => {
            if (e.response) {
                const { status, statusText } = e.response || {};
                reject({ status, statusText });
            }
            else {
                reject({
                    status: 500,
                    statusText: (e === null || e === void 0 ? void 0 : e.message) || 'network error',
                });
            }
        });
    });
};
