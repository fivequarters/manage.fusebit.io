"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.urlOrSvgToImage = exports.createAxiosClient = exports.getPluralText = exports.linkPackageJson = exports.getAllDependenciesFromFeed = exports.getConnectorsFromInstall = exports.startCase = exports.findMatchingConnectorFeed = void 0;
var axios_1 = require("axios");
var lodash_startcase_1 = require("lodash.startcase");
var feed_1 = require("../static/feed");
var constants_1 = require("./constants");
exports.findMatchingConnectorFeed = function (connector) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, new Promise(function (accept, reject) {
                if (connector.tags) {
                    var feedtype = connector.tags['fusebit.feedType'];
                    var feedId_1 = connector.tags['fusebit.feedId'];
                    if (feedtype === 'integration') {
                        feed_1.integrationsFeed().then(function (feed) {
                            feed.forEach(function (item) {
                                if (item.id === feedId_1) {
                                    return accept(item);
                                }
                            });
                            return reject({});
                        });
                    }
                    else {
                        feed_1.connectorsFeed().then(function (feed) {
                            feed.forEach(function (item) {
                                if (item.id === feedId_1) {
                                    return accept(item);
                                }
                            });
                            return reject({});
                        });
                    }
                }
                else {
                    return reject({});
                }
            })];
    });
}); };
exports.startCase = function (str) {
    return lodash_startcase_1["default"](str.toLowerCase());
};
exports.getConnectorsFromInstall = function (install) {
    return Object.keys(install.data).map(function (key) { var _a; return (_a = install === null || install === void 0 ? void 0 : install.data[key]) === null || _a === void 0 ? void 0 : _a.parentEntityId; });
};
exports.getAllDependenciesFromFeed = function (feed) {
    var entities = ((feed === null || feed === void 0 ? void 0 : feed.configuration) || {}).entities;
    var dependencies = Object.keys(entities).reduce(function (acc, curr) {
        var currDependencies = JSON.parse(entities[curr].data.files['package.json']).dependencies;
        Object.keys(currDependencies).forEach(function (key) {
            acc[key] = currDependencies[key];
        });
        return acc;
    }, {});
    return dependencies;
};
var LINKED_DEPENDENCIES = {
    provider: 'connector'
};
exports.linkPackageJson = function (currPkgJson, dependencies, component) {
    var newPackageJson = __assign({}, currPkgJson);
    var _a = component.provider.split('/'), prefix = _a[0], suffix = _a[1];
    var _b = suffix.split('-'), name = _b[0], type = _b[1];
    var dependencyBaseName = prefix + "/" + name;
    var dependencyName = dependencyBaseName + "-" + (LINKED_DEPENDENCIES[type] || LINKED_DEPENDENCIES.provider);
    // @ts-ignore
    newPackageJson.dependencies[component.provider] = dependencies[dependencyName];
    return newPackageJson;
};
exports.getPluralText = function (list, noun) {
    var isPlural = list.length > 1;
    var pronoun = isPlural ? 'these' : 'this';
    return pronoun + " " + noun + (isPlural ? 's' : '');
};
exports.createAxiosClient = function (token, skipXUserAgent) {
    var instance = axios_1["default"].create({
        headers: {
            authorization: "Bearer " + token
        }
    });
    if (!skipXUserAgent) {
        instance.defaults.headers['X-User-Agent'] = constants_1.X_USER_AGENT;
    }
    return instance;
};
exports.urlOrSvgToImage = function (img) {
    if (img === void 0) { img = ''; }
    return img.match('^<svg') ? "data:image/svg+xml;utf8," + encodeURIComponent(img) : img;
};
