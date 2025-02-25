'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var types = require('@web3-react/types');
var providers = require('@ethersproject/providers');
var common = require('@web3-onboard/common');

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }
  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}
function _asyncToGenerator(fn) {
  return function () {
    var self = this,
      args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);
      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }
      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }
      _next(undefined);
    });
  };
}
function _extends() {
  _extends = Object.assign ? Object.assign.bind() : function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
  return _extends.apply(this, arguments);
}

function styleInject(css, ref) {
  if ( ref === void 0 ) ref = {};
  var insertAt = ref.insertAt;

  if (!css || typeof document === 'undefined') { return; }

  var head = document.head || document.getElementsByTagName('head')[0];
  var style = document.createElement('style');
  style.type = 'text/css';

  if (insertAt === 'top') {
    if (head.firstChild) {
      head.insertBefore(style, head.firstChild);
    } else {
      head.appendChild(style);
    }
  } else {
    head.appendChild(style);
  }

  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
}

var css_248z = ".ambireSDKiframe {\n  position: absolute;\n  background-color: rgba(255, 255, 255, 0.25);\n  top: 50%;\n  left: 50%;\n  transform: translate(-50%, -50%) translateZ(0);\n  z-index: 999;\n  border-radius: 12px;\n  border: 0;\n  pointer-events: auto;\n  width: 480px;\n  height: 600px;\n}\n\n.ambireSDKmodal {\n  position: fixed;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n  z-index: 9999;\n  background-color: rgba(166, 174, 185, 0.7);\n  visibility: hidden;\n  opacity: 0;\n  pointer-events: auto;\n}\n\n.ambireSDKmodalVisible {\n  visibility: visible;\n  pointer-events: none;\n  opacity: 1;\n}\n";
styleInject(css_248z);

class AmbireLoginSDK {
  constructor(opt) {
    var _opt$walletUrl, _opt$dappName, _opt$dappIconPath, _opt$wrapperElementId;
    this.walletUrl = (_opt$walletUrl = opt.walletUrl) != null ? _opt$walletUrl : 'Unknown Dapp';
    this.dappName = (_opt$dappName = opt.dappName) != null ? _opt$dappName : 'Unknown Dapp';
    this.dappIconPath = (_opt$dappIconPath = opt.dappIconPath) != null ? _opt$dappIconPath : '';
    this.wrapperElementId = (_opt$wrapperElementId = opt.wrapperElementId) != null ? _opt$wrapperElementId : 'ambire-sdk-wrapper';
    this.wrapperElement = null;
    this.iframe = null;
    // hardcoded handlers
    window.addEventListener('keyup', e => {
      if (e.key === 'Escape') {
        this.hideIframe();
      }
    });
    window.addEventListener('message', e => {
      if (e.origin !== this.getOrigin() || e.data.type !== 'actionClose') return;
      this.hideIframe();
    });
  }
  initSdkWrapperDiv(id) {
    if (id === void 0) {
      id = 'ambire-sdk-wrapper';
    }
    if (this.wrapperElement) return;
    this.wrapperElement = document.getElementById(id);
    if (this.wrapperElement) return;
    this.wrapperElement = document.createElement('div');
    this.wrapperElement.id = id;
    this.wrapperElement.classList.add('ambireSDKmodal');
    document.body.appendChild(this.wrapperElement);
  }
  hideIframe() {
    var _this$wrapperElement;
    document.body.style.pointerEvents = 'auto';
    this.wrapperElement.classList.remove('ambireSDKmodalVisible');
    var wrapperChildren = (_this$wrapperElement = this.wrapperElement) == null ? void 0 : _this$wrapperElement.childNodes;
    if ((wrapperChildren == null ? void 0 : wrapperChildren.length) > 0) {
      wrapperChildren.forEach(child => {
        child.remove();
      });
    }
  }
  showIframe(url) {
    this.initSdkWrapperDiv(this.wrapperElementId);
    document.body.style.pointerEvents = 'none';
    this.wrapperElement.classList.add('ambireSDKmodalVisible');
    if (!this.wrapperElement.childNodes || this.wrapperElement.childNodes.length == 0) {
      this.iframe = document.createElement('iframe');
      this.iframe.src = url;
      this.iframe.width = '480px';
      this.iframe.height = '600px';
      this.iframe.id = 'ambire-sdk-iframe';
      this.iframe.classList.add('ambireSDKiframe');
      this.wrapperElement.appendChild(this.iframe);
    }
  }
  openLogin(chainInfo) {
    var query = "?dappOrigin=" + window.location.origin + "&dappName=" + this.dappName + "&dappIcon=" + this.dappIconPath;
    query = chainInfo ? query + "&chainId=" + chainInfo.chainId : query;
    this.showIframe(this.walletUrl + '/#/sdk/email-login' + query);
  }
  openLogout() {
    var query = "?dappOrigin=" + window.location.origin;
    this.showIframe(this.walletUrl + '/#/sdk/logout' + query);
  }
  openSignMessage(type, messageToSign) {
    if (!messageToSign) return alert('Invalid input for message');
    if (type === 'eth_sign') {
      if (typeof messageToSign !== 'string') {
        return alert('Invalid input for message');
      }
    } else if (type === 'personal_sign') {
      if (typeof messageToSign !== 'string') {
        return alert('Invalid input for message');
      }
      // convert string to hex
      messageToSign = messageToSign.match(/^0x[0-9A-Fa-f]+$/g) ? messageToSign : '0x' + messageToSign.split('').map(c => c.charCodeAt(0).toString(16).padStart(2, '0')).join('');
    } else if (['eth_signTypedData', 'eth_signTypedData_v4'].includes(type)) {
      messageToSign = typeof messageToSign === 'string' ? messageToSign : JSON.stringify(messageToSign);
      messageToSign = encodeURIComponent(messageToSign);
    } else {
      return alert('Invalid sign type');
    }
    this.showIframe(this.walletUrl + "/#/sdk/sign-message/" + type + "/" + messageToSign + "?dappOrigin=" + window.location.origin);
  }
  openSendTransaction(to, value, data) {
    if (!to || !value || !data || typeof to !== 'string' || typeof value !== 'string' || typeof data !== 'string') {
      return alert('Invalid txn input data');
    }
    this.showIframe(this.walletUrl + "/#/sdk/send-transaction/" + to + "/" + value + "/" + data);
  }
  // emit event
  emit(eventName, data) {
    if (data === void 0) {
      data = {};
    }
    var event = new CustomEvent(eventName, {
      detail: _extends({}, data)
    });
    window.dispatchEvent(event);
    console.log(eventName + " was dispatched");
  }
  // generic event listener
  on(eventName, callback) {
    // console.log(`${eventName} was received`)
    window.addEventListener(eventName, function (event) {
      callback(event);
    });
  }
  onMessage(messageType, sdkCallback, clientCallback) {
    window.addEventListener('message', e => {
      if (e.origin !== this.getOrigin() || e.data.type !== messageType) return;
      sdkCallback();
      if (clientCallback) clientCallback(e.data);
    });
  }
  onAlreadyLoggedIn(callback) {
    this.onMessage('alreadyLoggedIn', () => this.hideIframe(), callback);
  }
  // ambire-login-success listener
  onLoginSuccess(callback) {
    this.onMessage('loginSuccess', () => this.hideIframe(), callback);
  }
  // ambire-registration-success listener
  onRegistrationSuccess(callback) {
    this.onMessage('registrationSuccess', () => {
      this.iframe.src = this.walletUrl + '/#/sdk/on-ramp';
    }, callback);
    this.onMessage('finishRamp', () => this.hideIframe());
  }
  onLogoutSuccess(callback) {
    this.onMessage('logoutSuccess', () => this.hideIframe(), callback);
  }
  onMsgRejected(callback) {
    this.onMessage('msgRejected', () => this.hideIframe(), callback);
  }
  onMsgSigned(callback) {
    this.onMessage('msgSigned', () => this.hideIframe(), callback);
  }
  onTxnRejected(callback) {
    this.onMessage('txnRejected', () => this.hideIframe(), callback);
  }
  onTxnSent(callback) {
    this.onMessage('txnSent', () => this.hideIframe(), callback);
  }
  onActionRejected(callback) {
    this.onMessage('actionRejected', () => this.hideIframe(), callback);
  }
  // the origin of this.walletUrl should be protocol://website.name without any additinal "/"
  // symbols at the end. Otherwise, messages do not pass. This code ensures the correct
  // origin is passed
  getOrigin() {
    return this.walletUrl.split('/').slice(0, 3).join('/');
  }
}

class AmbireWallet extends types.Connector {
  constructor(actions, options, onError) {
    super(actions, onError);
    this._sdk = new AmbireLoginSDK(options);
  }
  activate(chainInfo) {
    this.actions.startActivation();
    this._sdk.openLogin(chainInfo);
    return new Promise((resolve, reject) => {
      this._sdk.onAlreadyLoggedIn(data => {
        var activeChainId = chainInfo ? parseInt(chainInfo.chainId) : parseInt(data.chainId);
        this.customProvider = this.getProvider(data.address, data.providerUrl);
        this.actions.update({
          chainId: activeChainId,
          accounts: [data.address]
        });
        resolve();
      });
      this._sdk.onLoginSuccess(data => {
        var activeChainId = chainInfo ? parseInt(chainInfo.chainId) : parseInt(data.chainId);
        this.customProvider = this.getProvider(data.address, data.providerUrl);
        this.actions.update({
          chainId: activeChainId,
          accounts: [data.address]
        });
        resolve();
      });
      this._sdk.onRegistrationSuccess(data => {
        var activeChainId = chainInfo ? chainInfo.chainId : data.chainId;
        this.customProvider = this.getProvider(data.address, data.providerUrl);
        this.actions.update({
          chainId: activeChainId,
          accounts: [data.address]
        });
        resolve();
      });
      this._sdk.onActionRejected(data => {
        var activeChainId = parseInt(data.chainId);
        this.customProvider = this.getProvider(data.address, data.providerUrl);
        this.actions.update({
          chainId: activeChainId,
          accounts: [data.address]
        });
        reject({
          code: 4001,
          message: 'User rejected the request.'
        });
      });
    });
  }
  deactivate() {
    this._sdk.openLogout();
    return new Promise(resolve => {
      this._sdk.onLogoutSuccess(() => {
        this.customProvider = null;
        this.actions.resetState();
        resolve();
      });
    });
  }
  getProvider(address, providerUrl) {
    return new AmbireProvider(this._sdk, address, providerUrl);
  }
}
class AmbireProvider extends providers.JsonRpcProvider {
  constructor(sdk, address, url, network) {
    super(url, network);
    this._address = address;
    this._sdk = sdk;
  }
  getSigner(addressOrIndex) {
    var signerAddress = addressOrIndex ? addressOrIndex : this._address;
    var signer = super.getSigner(signerAddress);
    var provider = this;
    var handler1 = {
      get(target, prop, receiver) {
        if (prop === 'sendTransaction') {
          var value = target[prop];
          if (value instanceof Function) {
            return function () {
              for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = arguments[_key];
              }
              var txn = args.data ? args : args[0];
              var txnValue = txn.value ? txn.value.toString() : '0';
              provider._sdk.openSendTransaction(txn.to, txnValue, txn.data);
              return new Promise((resolve, reject) => {
                provider._sdk.onTxnSent( /*#__PURE__*/function () {
                  var _ref = _asyncToGenerator(function* (data) {
                    var hash = data.hash;
                    // if the txn is submitted, try to fetch it until success
                    var fetchedTx = null;
                    var failed = 0;
                    while (fetchedTx === null && failed < 5) {
                      fetchedTx = yield provider.getTransaction(hash);
                      if (fetchedTx === null) {
                        yield new Promise(r => setTimeout(r, 1500));
                        failed++;
                      }
                    }
                    var response = provider._wrapTransaction(fetchedTx, hash);
                    response.data = txn.data;
                    return resolve(response);
                  });
                  return function (_x) {
                    return _ref.apply(this, arguments);
                  };
                }());
                provider._sdk.onTxnRejected(() => {
                  reject({
                    code: 4001
                  });
                });
              });
            };
          }
        }
        if (prop === 'connectUnchecked') {
          var _value = target[prop];
          if (_value instanceof Function) {
            return function () {
              return new Proxy(signer, handler1);
            };
          }
        }
        if (prop === 'signMessage' || prop === '_legacySignMessage' || prop === '_signTypedData') {
          var _value2 = target[prop];
          if (_value2 instanceof Function) {
            return function () {
              var type = prop === 'signMessage' ? 'personal_sign' : prop === '_legacySignMessage' ? 'eth_sign' : 'eth_signTypedData_v4';
              for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                args[_key2] = arguments[_key2];
              }
              return provider.handleMsgSign(type, args);
            };
          }
        }
        return Reflect.get(target, prop, receiver);
      }
    };
    return new Proxy(signer, handler1);
  }
  handleMsgSign(type, args) {
    var message = args.length === 1 ? args[0] : args;
    this._sdk.openSignMessage(type, message);
    return new Promise((resolve, reject) => {
      this._sdk.msgSigned(() => {
        return resolve(args[0]);
      });
      this._sdk.onMsgRejected(() => {
        reject({
          code: 4001
        });
      });
    });
  }
}

var img = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAPoAAAD6CAYAAACI7Fo9AAAACXBIWXMAAA7EAAAOxAGVKw4bAAADnmlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSfvu78nIGlkPSdXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQnPz4KPHg6eG1wbWV0YSB4bWxuczp4PSdhZG9iZTpuczptZXRhLyc+CjxyZGY6UkRGIHhtbG5zOnJkZj0naHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyc+CgogPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9JycKICB4bWxuczpBdHRyaWI9J2h0dHA6Ly9ucy5hdHRyaWJ1dGlvbi5jb20vYWRzLzEuMC8nPgogIDxBdHRyaWI6QWRzPgogICA8cmRmOlNlcT4KICAgIDxyZGY6bGkgcmRmOnBhcnNlVHlwZT0nUmVzb3VyY2UnPgogICAgIDxBdHRyaWI6Q3JlYXRlZD4yMDIyLTAxLTI3PC9BdHRyaWI6Q3JlYXRlZD4KICAgICA8QXR0cmliOkV4dElkPjQxY2Y0YTMyLTIxNjAtNGI2ZS1iZGJjLWY5YWU4YzhmMzliOTwvQXR0cmliOkV4dElkPgogICAgIDxBdHRyaWI6RmJJZD41MjUyNjU5MTQxNzk1ODA8L0F0dHJpYjpGYklkPgogICAgIDxBdHRyaWI6VG91Y2hUeXBlPjI8L0F0dHJpYjpUb3VjaFR5cGU+CiAgICA8L3JkZjpsaT4KICAgPC9yZGY6U2VxPgogIDwvQXR0cmliOkFkcz4KIDwvcmRmOkRlc2NyaXB0aW9uPgoKIDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PScnCiAgeG1sbnM6cGRmPSdodHRwOi8vbnMuYWRvYmUuY29tL3BkZi8xLjMvJz4KICA8cGRmOkF1dGhvcj5WYW5pbmEgSXZhbm92YTwvcGRmOkF1dGhvcj4KIDwvcmRmOkRlc2NyaXB0aW9uPgoKIDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PScnCiAgeG1sbnM6eG1wPSdodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvJz4KICA8eG1wOkNyZWF0b3JUb29s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";

function AmbireWalletModule(sdkParams) {
  var ambireSDK = new AmbireLoginSDK(sdkParams);
  var connectedAccounts = [];
  var connectedchain = '0x1';
  var handleLogin = /*#__PURE__*/function () {
    var _ref = _asyncToGenerator(function* () {
      ambireSDK.openLogin({
        chainId: parseInt(connectedchain)
      });
      return new Promise((resolve, reject) => {
        ambireSDK.onLoginSuccess(data => {
          connectedAccounts = [data.address];
          connectedchain = "0x" + parseInt(data.chainId).toString(16);
          resolve(connectedAccounts);
        });
        ambireSDK.onAlreadyLoggedIn(data => {
          connectedAccounts = [data.address];
          connectedchain = "0x" + parseInt(data.chainId).toString(16);
          resolve(connectedAccounts);
        });
        ambireSDK.onRegistrationSuccess(data => {
          connectedAccounts = [data.address];
          connectedchain = "0x" + parseInt(data.chainId).toString(16);
          resolve(connectedAccounts);
        });
        ambireSDK.onActionRejected(data => {
          connectedAccounts = [data.address];
          reject({
            code: 4001,
            message: 'User rejected the request.'
          });
        });
      });
    });
    return function handleLogin() {
      return _ref.apply(this, arguments);
    };
  }();
  var handleSignMessage = /*#__PURE__*/function () {
    var _ref2 = _asyncToGenerator(function* (signType, message) {
      ambireSDK.openSignMessage(signType, message);
      return new Promise((resolve, reject) => {
        ambireSDK.onMsgSigned(data => {
          return resolve(data.signature);
        });
        ambireSDK.onMsgRejected(() => {
          reject({
            code: 4001,
            message: 'User rejected the request.'
          });
        });
      });
    });
    return function handleSignMessage(_x, _x2) {
      return _ref2.apply(this, arguments);
    };
  }();
  return () => {
    return {
      label: 'Ambire Wallet',
      getIcon: function () {
        var _getIcon = _asyncToGenerator(function* () {
          return img;
        });
        function getIcon() {
          return _getIcon.apply(this, arguments);
        }
        return getIcon;
      }(),
      getInterface: function () {
        var _getInterface = _asyncToGenerator(function* (_ref3) {
          var {
            EventEmitter
          } = _ref3;
          var emitter = new EventEmitter();
          var requestPatch = {
            eth_requestAccounts: function () {
              var _eth_requestAccounts = _asyncToGenerator(function* () {
                if (connectedAccounts.length > 0) {
                  return Promise.resolve(connectedAccounts);
                }
                return handleLogin();
              });
              function eth_requestAccounts() {
                return _eth_requestAccounts.apply(this, arguments);
              }
              return eth_requestAccounts;
            }(),
            eth_selectAccounts: function () {
              var _eth_selectAccounts = _asyncToGenerator(function* () {
                if (connectedAccounts.length > 0) {
                  return Promise.resolve(connectedAccounts);
                }
                return handleLogin();
              });
              function eth_selectAccounts() {
                return _eth_selectAccounts.apply(this, arguments);
              }
              return eth_selectAccounts;
            }(),
            eth_accounts: function () {
              var _eth_accounts = _asyncToGenerator(function* () {
                return Promise.resolve(connectedAccounts);
              });
              function eth_accounts() {
                return _eth_accounts.apply(this, arguments);
              }
              return eth_accounts;
            }(),
            eth_chainId: function () {
              var _eth_chainId = _asyncToGenerator(function* () {
                return Promise.resolve(connectedchain);
              });
              function eth_chainId() {
                return _eth_chainId.apply(this, arguments);
              }
              return eth_chainId;
            }(),
            // @ts-ignore
            personal_sign: function () {
              var _personal_sign = _asyncToGenerator(function* (_ref4) {
                var {
                  params: [message, address]
                } = _ref4;
                return handleSignMessage('personal_sign', message);
              });
              function personal_sign(_x4) {
                return _personal_sign.apply(this, arguments);
              }
              return personal_sign;
            }(),
            // @ts-ignore
            eth_sign: function () {
              var _eth_sign = _asyncToGenerator(function* (_ref5) {
                var {
                  params: [address, message]
                } = _ref5;
                return handleSignMessage('eth_sign', message);
              });
              function eth_sign(_x5) {
                return _eth_sign.apply(this, arguments);
              }
              return eth_sign;
            }(),
            // @ts-ignore
            eth_signTypedData: function () {
              var _eth_signTypedData = _asyncToGenerator(function* (_ref6) {
                var {
                  params: [address, typedData]
                } = _ref6;
                return handleSignMessage('eth_signTypedData', typedData);
              });
              function eth_signTypedData(_x6) {
                return _eth_signTypedData.apply(this, arguments);
              }
              return eth_signTypedData;
            }(),
            // @ts-ignore
            eth_signTypedData_v4: function () {
              var _eth_signTypedData_v = _asyncToGenerator(function* (_ref7) {
                var {
                  params: [address, typedData]
                } = _ref7;
                return handleSignMessage('eth_signTypedData_v4', typedData);
              });
              function eth_signTypedData_v4(_x7) {
                return _eth_signTypedData_v.apply(this, arguments);
              }
              return eth_signTypedData_v4;
            }(),
            // @ts-ignore
            eth_sendTransaction: function () {
              var _eth_sendTransaction = _asyncToGenerator(function* (_ref8) {
                var {
                  params: [transactionObject]
                } = _ref8;
                var txTo = transactionObject.to.toString();
                var txValue = transactionObject.value.toString();
                var txData = transactionObject.data ? transactionObject.data.toString() : '0x';
                ambireSDK.openSendTransaction(txTo, txValue, txData);
                return new Promise((resolve, reject) => {
                  ambireSDK.onTxnSent(data => {
                    return resolve(data.hash);
                  });
                  ambireSDK.onTxnRejected(() => {
                    reject({
                      code: 4001,
                      message: 'User rejected the request.'
                    });
                  });
                });
              });
              function eth_sendTransaction(_x8) {
                return _eth_sendTransaction.apply(this, arguments);
              }
              return eth_sendTransaction;
            }()
          };
          var provider = common.createEIP1193Provider({
            on: emitter.on.bind(emitter)
          }, requestPatch);
          return {
            provider
          };
        });
        function getInterface(_x3) {
          return _getInterface.apply(this, arguments);
        }
        return getInterface;
      }(),
      platforms: ['all']
    };
  };
}

exports.AmbireWallet = AmbireWallet;
exports.Web3OnboardAmbireWalletModule = AmbireWalletModule;
//# sourceMappingURL=ambire-login-sdk.cjs.development.js.map
