"use strict";
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
var react_1 = require("react");
var react_router_dom_1 = require("react-router-dom");
var core_1 = require("@material-ui/core");
var ListItem_1 = require("../ListItem");
var useModal_1 = require("../../../hooks/useModal");
var ConfirmationPrompt_1 = require("../../common/ConfirmationPrompt");
var useGetRedirectLink_1 = require("../../../hooks/useGetRedirectLink");
var useGetMatchingConnectorFeed_1 = require("../../../hooks/api/useGetMatchingConnectorFeed");
var useEntityApi_1 = require("../../../hooks/useEntityApi");
var useLoader_1 = require("../../../hooks/useLoader");
var LineConnector_1 = require("../../common/LineConnector");
var IntegrationCard_1 = require("../IntegrationCard/IntegrationCard");
var constants_1 = require("../constants");
var warning_red_svg_1 = require("../../../assets/warning-red.svg");
var utils_1 = require("../../../utils/utils");
var ConnectorItem = function (_a) {
    var className = _a.className, connector = _a.connector, integrationData = _a.integrationData;
    var _b = useModal_1.useModal(), deleteConnectorModalOpen = _b[0], setDeleteConnectorModal = _b[1], toggleDeleteConnectorModal = _b[2];
    var _c = useGetMatchingConnectorFeed_1.useGetMatchingConnectorFeed({ connector: connector }), connectorFeed = _c.data, isLoading = _c.isLoading;
    var getRedirectLink = useGetRedirectLink_1.useGetRedirectLink().getRedirectLink;
    var history = react_router_dom_1.useHistory();
    var handleClick = function () { return history.push(getRedirectLink("/connector/" + connector.id + "/configure")); };
    var removeConnectorFromIntegration = useEntityApi_1.useEntityApi().removeConnectorFromIntegration;
    var _d = useLoader_1.useLoader(), createLoader = _d.createLoader, removeLoader = _d.removeLoader;
    var matchesCardOverlapping = core_1.useMediaQuery(constants_1.CARD_OVERLAPPING_MEDIA_QUERY);
    console.log('connectorFeed', connectorFeed);
    var handleDelete = function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, , 2, 3]);
                    createLoader();
                    return [4 /*yield*/, removeConnectorFromIntegration(connector, integrationData)];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    removeLoader();
                    return [7 /*endfinally*/];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    return (react_1["default"].createElement(react_1["default"].Fragment, null,
        react_1["default"].createElement(ConfirmationPrompt_1["default"], { open: deleteConnectorModalOpen, setOpen: setDeleteConnectorModal, handleConfirmation: handleDelete, title: "Are you sure want to remove this Connector from the Integration?", description: "This will break the integration for your application and it will not work until you re-link this connector back", confirmationButtonText: "Remove" }),
        react_1["default"].createElement(ListItem_1["default"], { id: connector.id, onClick: handleClick, className: className, icon: isLoading ? (react_1["default"].createElement(core_1.CircularProgress, { size: 20 })) : (react_1["default"].createElement("img", { src: connector.missing ? warning_red_svg_1["default"] : utils_1.urlOrSvgToImage(connectorFeed === null || connectorFeed === void 0 ? void 0 : connectorFeed.smallIcon), alt: "connector", height: 20, width: 20 })), name: connector.missing ? connector.id + " is not found" : connector.id, onDelete: toggleDeleteConnectorModal }),
        !matchesCardOverlapping && (react_1["default"].createElement(LineConnector_1["default"], { start: IntegrationCard_1.INTEGRATION_CARD_ID, startAnchor: "right", end: connector.id, endAnchor: "left" }))));
};
exports["default"] = ConnectorItem;
