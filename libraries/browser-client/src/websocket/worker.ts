export default `/**
 * Known WebSocket response types.
 * @public
 */
var WebsocketResponseType;
(function (WebsocketResponseType) {
    WebsocketResponseType["Opened"] = "WEBSOCKET_OPEN";
    WebsocketResponseType["SourceSampleRateSetSuccess"] = "SOURSE_SAMPLE_RATE_SET_SUCCESS";
    WebsocketResponseType["Started"] = "started";
    WebsocketResponseType["Stopped"] = "stopped";
})(WebsocketResponseType || (WebsocketResponseType = {}));
var CONTROL = {
    WRITE_INDEX: 0,
    FRAMES_AVAILABLE: 1,
    LOCK: 2
};
var WebsocketClient = /** @class */ (function () {
    function WebsocketClient(ctx) {
        var _this = this;
        this.isContextStarted = false;
        this.isStartContextConfirmed = false;
        this.shouldResendLastFramesSent = false;
        this.buffer = new Float32Array(0);
        this.lastFramesSent = new Int16Array(0); // to re-send after switch context
        this.debug = false;
        this.initialized = false;
        // WebSocket's close handler, called e.g. when
        // - normal close (code 1000)
        // - network unreachable or unable to (re)connect (code 1006)
        // List of CloseEvent.code values: https://developer.mozilla.org/en-US/docs/Web/API/CloseEvent/code
        this.onWebsocketClose = function (event) {
            if (_this.debug) {
                console.log('[SpeechlyClient]', 'onWebsocketClose');
            }
            _this.websocket.removeEventListener('open', _this.onWebsocketOpen);
            _this.websocket.removeEventListener('message', _this.onWebsocketMessage);
            _this.websocket.removeEventListener('error', _this.onWebsocketError);
            _this.websocket.removeEventListener('close', _this.onWebsocketClose);
            _this.websocket = undefined;
            _this.workerCtx.postMessage({ type: 'WEBSOCKET_CLOSED', code: event.code, reason: event.reason, wasClean: event.wasClean });
        };
        this.onWebsocketOpen = function (_event) {
            if (_this.debug) {
                console.log('[SpeechlyClient]', 'websocket opened');
            }
            if (_this.isContextStarted && !_this.isStartContextConfirmed) {
                _this.send(_this.outbox);
            }
            _this.workerCtx.postMessage({ type: 'WEBSOCKET_OPEN' });
        };
        this.onWebsocketError = function (_event) {
            if (_this.debug) {
                console.log('[SpeechlyClient]', 'websocket error');
            }
        };
        this.onWebsocketMessage = function (event) {
            var response;
            try {
                response = JSON.parse(event.data);
            }
            catch (e) {
                console.error('[SpeechlyClient] Error parsing response from the server:', e);
                return;
            }
            if (response.type === WebsocketResponseType.Started) {
                _this.isStartContextConfirmed = true;
                if (_this.shouldResendLastFramesSent) {
                    _this.resendLastFrames();
                    _this.shouldResendLastFramesSent = false;
                }
            }
            _this.workerCtx.postMessage(response);
        };
        this.workerCtx = ctx;
    }
    WebsocketClient.prototype.init = function (apiUrl, authToken, targetSampleRate, debug) {
        this.debug = debug;
        if (this.debug) {
            console.log('[SpeechlyClient]', 'initialize worker');
        }
        this.apiUrl = apiUrl;
        this.authToken = authToken;
        this.targetSampleRate = targetSampleRate;
        this.initialized = true;
        this.isContextStarted = false;
        this.connect(0);
    };
    WebsocketClient.prototype.setSourceSampleRate = function (sourceSampleRate) {
        this.sourceSampleRate = sourceSampleRate;
        this.resampleRatio = this.sourceSampleRate / this.targetSampleRate;
        if (this.debug) {
            console.log('[SpeechlyClient]', 'resampleRatio', this.resampleRatio);
        }
        if (this.resampleRatio > 1) {
            this.filter = generateFilter(this.sourceSampleRate, this.targetSampleRate, 127);
        }
        this.workerCtx.postMessage({ type: 'SOURSE_SAMPLE_RATE_SET_SUCCESS' });
        if (isNaN(this.resampleRatio)) {
            throw Error("resampleRatio is NaN source rate is ".concat(this.sourceSampleRate, " and target rate is ").concat(this.targetSampleRate));
        }
    };
    WebsocketClient.prototype.setSharedArrayBuffers = function (controlSAB, dataSAB) {
        this.controlSAB = new Int32Array(controlSAB);
        this.dataSAB = new Float32Array(dataSAB);
        var audioHandleInterval = this.dataSAB.length / 32; // ms
        if (this.debug) {
            console.log('[SpeechlyClient]', 'Audio handle interval', audioHandleInterval, 'ms');
        }
        setInterval(this.sendAudioFromSAB.bind(this), audioHandleInterval);
    };
    WebsocketClient.prototype.connect = function (timeout) {
        if (timeout === void 0) { timeout = 1000; }
        if (this.debug) {
            console.log('[SpeechlyClient]', 'connect in ', timeout / 1000, 'sec');
        }
        setTimeout(this.initializeWebsocket.bind(this), timeout);
    };
    WebsocketClient.prototype.initializeWebsocket = function () {
        if (this.debug) {
            console.log('[SpeechlyClient]', 'connecting to ', this.apiUrl);
        }
        this.websocket = new WebSocket(this.apiUrl, this.authToken);
        this.websocket.addEventListener('open', this.onWebsocketOpen);
        this.websocket.addEventListener('message', this.onWebsocketMessage);
        this.websocket.addEventListener('error', this.onWebsocketError);
        this.websocket.addEventListener('close', this.onWebsocketClose);
    };
    WebsocketClient.prototype.isOpen = function () {
        return this.websocket !== undefined && this.websocket.readyState === this.websocket.OPEN;
    };
    WebsocketClient.prototype.resendLastFrames = function () {
        if (this.lastFramesSent.length > 0) {
            this.send(this.lastFramesSent);
            this.lastFramesSent = new Int16Array(0);
        }
    };
    WebsocketClient.prototype.sendAudio = function (audioChunk) {
        if (!this.isContextStarted) {
            return;
        }
        if (audioChunk.length > 0) {
            if (this.resampleRatio > 1) {
                // Downsampling
                this.send(this.downsample(audioChunk));
            }
            else {
                this.send(float32ToInt16(audioChunk));
            }
        }
    };
    WebsocketClient.prototype.sendAudioFromSAB = function () {
        if (!this.isContextStarted) {
            this.controlSAB[CONTROL.FRAMES_AVAILABLE] = 0;
            this.controlSAB[CONTROL.WRITE_INDEX] = 0;
            return;
        }
        if (this.controlSAB == undefined) {
            return;
        }
        var framesAvailable = this.controlSAB[CONTROL.FRAMES_AVAILABLE];
        var lock = this.controlSAB[CONTROL.LOCK];
        if (lock == 0 && framesAvailable > 0) {
            var data = this.dataSAB.subarray(0, framesAvailable);
            this.controlSAB[CONTROL.FRAMES_AVAILABLE] = 0;
            this.controlSAB[CONTROL.WRITE_INDEX] = 0;
            if (data.length > 0) {
                var frames_1;
                if (this.resampleRatio > 1) {
                    frames_1 = this.downsample(data);
                }
                else {
                    frames_1 = float32ToInt16(data);
                }
                this.send(frames_1);
                // 16000 per second, 1000 in 100 ms
                // save last 250 ms
                if (this.lastFramesSent.length > 1024 * 4) {
                    this.lastFramesSent = frames_1;
                }
                else {
                    var concat = new Int16Array(this.lastFramesSent.length + frames_1.length);
                    concat.set(this.lastFramesSent);
                    concat.set(frames_1, this.lastFramesSent.length);
                    this.lastFramesSent = concat;
                }
            }
        }
    };
    WebsocketClient.prototype.startContext = function (appId) {
        if (this.isContextStarted) {
            console.log('Cant start context: it has been already started');
            return;
        }
        this.isContextStarted = true;
        this.isStartContextConfirmed = false;
        if (appId !== undefined) {
            this.outbox = JSON.stringify({ event: 'start', appId: appId });
        }
        else {
            this.outbox = JSON.stringify({ event: 'start' });
        }
        this.send(this.outbox);
    };
    WebsocketClient.prototype.stopContext = function () {
        if (!this.websocket) {
            throw Error('Cant start context: websocket is undefined');
        }
        if (!this.isContextStarted) {
            console.log('Cant stop context: it is not started');
            return;
        }
        this.isContextStarted = false;
        this.isStartContextConfirmed = false;
        var StopEventJSON = JSON.stringify({ event: 'stop' });
        this.send(StopEventJSON);
    };
    WebsocketClient.prototype.switchContext = function (newAppId) {
        if (!this.websocket) {
            throw Error('Cant switch context: websocket is undefined');
        }
        if (!this.isContextStarted) {
            console.log('Cant switch context: it is not started');
            return;
        }
        if (newAppId == undefined) {
            console.log('Cant switch context: new app id is undefined');
            return;
        }
        this.isStartContextConfirmed = false;
        var StopEventJSON = JSON.stringify({ event: 'stop' });
        this.send(StopEventJSON);
        this.shouldResendLastFramesSent = true;
        this.send(JSON.stringify({ event: 'start', appId: newAppId }));
    };
    WebsocketClient.prototype.closeWebsocket = function (websocketCode, reason) {
        if (websocketCode === void 0) { websocketCode = 1005; }
        if (reason === void 0) { reason = "No Status Received"; }
        if (this.debug) {
            console.log('[SpeechlyClient]', 'Websocket closing');
        }
        if (!this.websocket) {
            throw Error('Websocket is not open');
        }
        this.websocket.close(websocketCode, reason);
    };
    WebsocketClient.prototype.downsample = function (input) {
        var inputBuffer = new Float32Array(this.buffer.length + input.length);
        inputBuffer.set(this.buffer, 0);
        inputBuffer.set(input, this.buffer.length);
        var outputLength = Math.ceil((inputBuffer.length - this.filter.length) / this.resampleRatio);
        var outputBuffer = new Int16Array(outputLength);
        for (var i = 0; i < outputLength; i++) {
            var offset = Math.round(this.resampleRatio * i);
            var val = 0.0;
            for (var j = 0; j < this.filter.length; j++) {
                val += inputBuffer[offset + j] * this.filter[j];
            }
            outputBuffer[i] = val * (val < 0 ? 0x8000 : 0x7fff);
        }
        var remainingOffset = Math.round(this.resampleRatio * outputLength);
        if (remainingOffset < inputBuffer.length) {
            this.buffer = inputBuffer.subarray(remainingOffset);
        }
        else {
            this.buffer = new Float32Array(0);
        }
        return outputBuffer;
    };
    WebsocketClient.prototype.send = function (data) {
        if (this.isOpen()) {
            try {
                this.websocket.send(data);
            }
            catch (error) {
                console.log('[SpeechlyClient]', 'Server connection error', error);
            }
        }
    };
    return WebsocketClient;
}());
var ctx = self;
var websocketClient = new WebsocketClient(ctx);
ctx.onmessage = function (e) {
    switch (e.data.type) {
        case 'INIT':
            websocketClient.init(e.data.apiUrl, e.data.authToken, e.data.targetSampleRate, e.data.debug);
            break;
        case 'SET_SOURSE_SAMPLE_RATE':
            websocketClient.setSourceSampleRate(e.data.sourceSampleRate);
            break;
        case 'SET_SHARED_ARRAY_BUFFERS':
            websocketClient.setSharedArrayBuffers(e.data.controlSAB, e.data.dataSAB);
            break;
        case 'CLOSE':
            websocketClient.closeWebsocket(1000, "Close requested by client");
            break;
        case 'START_CONTEXT':
            websocketClient.startContext(e.data.appId);
            break;
        case 'SWITCH_CONTEXT':
            websocketClient.switchContext(e.data.appId);
            break;
        case 'STOP_CONTEXT':
            websocketClient.stopContext();
            break;
        case 'AUDIO':
            websocketClient.sendAudio(e.data.payload);
            break;
        default:
            console.log('WORKER', e);
    }
};
function float32ToInt16(buffer) {
    var buf = new Int16Array(buffer.length);
    for (var l = 0; l < buffer.length; l++) {
        buf[l] = buffer[l] * (buffer[l] < 0 ? 0x8000 : 0x7fff);
    }
    return buf;
}
function generateFilter(sourceSampleRate, targetSampleRate, length) {
    if (length % 2 === 0) {
        throw Error('Filter length must be odd');
    }
    var cutoff = targetSampleRate / 2;
    var filter = new Float32Array(length);
    var sum = 0;
    for (var i = 0; i < length; i++) {
        var x = sinc(((2 * cutoff) / sourceSampleRate) * (i - (length - 1) / 2));
        sum += x;
        filter[i] = x;
    }
    for (var i = 0; i < length; i++) {
        filter[i] = filter[i] / sum;
    }
    return filter;
}
function sinc(x) {
    if (x === 0.0) {
        return 1.0;
    }
    var piX = Math.PI * x;
    return Math.sin(piX) / piX;
}
`
