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
exports.__esModule = true;
var react_1 = require("react");
var material_renderers_1 = require("@jsonforms/material-renderers");
var react_2 = require("@jsonforms/react");
var core_1 = require("@material-ui/core");
var lodash_debounce_1 = require("lodash.debounce");
var SC = require("./styles");
var feed_1 = require("../../../static/feed");
var search_svg_1 = require("../../../assets/search.svg");
var cross_svg_1 = require("../../../assets/cross.svg");
var useQuery_1 = require("../../../hooks/useQuery");
var useReplaceMustache_1 = require("../../../hooks/useReplaceMustache");
var analytics_1 = require("../../../utils/analytics");
var Loader_1 = require("../Loader");
var useTrackPage_1 = require("../../../hooks/useTrackPage");
var utils_1 = require("../../../utils/utils");
var Filters;
(function (Filters) {
    Filters["ALL"] = "All";
    Filters["MESSAGGING"] = "Messaging";
    Filters["PRODUCTIVITY"] = "Productivity";
    Filters["CRM"] = "CRM";
    Filters["CALENDAR"] = "Calendar";
})(Filters || (Filters = {}));
var FeedPicker = react_1["default"].forwardRef(function (_a, ref) {
    var open = _a.open, onClose = _a.onClose, onSubmit = _a.onSubmit, isIntegration = _a.isIntegration;
    var _b = react_1["default"].useState({}), data = _b[0], setData = _b[1];
    var _c = react_1["default"].useState([]), errors = _c[0], setErrors = _c[1];
    var _d = react_1["default"].useState('ValidateAndHide'), validationMode = _d[0], setValidationMode = _d[1];
    var _e = react_1["default"].useState(Filters.ALL), activeFilter = _e[0], setActiveFilter = _e[1];
    var _f = react_1.useState([]), feed = _f[0], setFeed = _f[1];
    var _g = react_1["default"].useState(), activeTemplate = _g[0], setActiveTemplate = _g[1];
    var _h = react_1["default"].useState(), rawActiveTemplate = _h[0], setRawActiveTemplate = _h[1];
    var _j = react_1["default"].useState(''), searchFilter = _j[0], setSearchFilter = _j[1];
    var _k = react_1["default"].useState(true), loading = _k[0], setLoading = _k[1];
    var query = useQuery_1.useQuery();
    var replaceMustache = useReplaceMustache_1.useReplaceMustache().replaceMustache;
    var debouncedSetSearchFilter = lodash_debounce_1["default"](function (keyword) {
        if (isIntegration) {
            analytics_1.trackEvent('New Integration Search Submitted', 'Integrations');
        }
        else {
            analytics_1.trackEvent('New Connector Search Submitted', 'Connectors');
        }
        setSearchFilter(keyword);
    }, 500);
    var handleSubmit = function () {
        if (errors.length > 0) {
            setValidationMode('ValidateAndShow');
        }
        else {
            // normalize data
            var keys = Object.keys(data);
            for (var i = 0; keys.length > i; i++) {
                var id = data[keys[i]].id;
                if (typeof id === 'string') {
                    data[keys[i]].id = id.replace(/\s/g, '');
                }
            }
            // send data with customized form
            onSubmit(rawActiveTemplate, __assign({}, data));
        }
    };
    var handlePlanUpsell = function () {
        if (rawActiveTemplate) {
            if (isIntegration) {
                analytics_1.trackEvent('Interest in Integration', 'Integrations', { tag: rawActiveTemplate.id });
            }
            else {
                analytics_1.trackEvent('Interest in Connector', 'Connectors', { tag: rawActiveTemplate.id });
            }
            window.Intercom('showNewMessage', "I'm interested in enabling " + rawActiveTemplate.name);
        }
        onClose();
    };
    var handleFilterChange = function (filter) {
        if (isIntegration) {
            analytics_1.trackEvent('New Integration Catalog Clicked', 'Integrations', { tag: filter });
        }
        else {
            analytics_1.trackEvent('New Connector Catalog Clicked', 'Connectors', { tag: filter });
        }
        setActiveFilter(filter);
    };
    var handleJsonFormsChange = function (_a) {
        var _b;
        var _errors = _a.errors, _data = _a.data;
        if (((_b = data === null || data === void 0 ? void 0 : data.ui) === null || _b === void 0 ? void 0 : _b.toggle) && activeTemplate) {
            analytics_1.trackEvent('New Integration Customize Clicked', 'Integrations', {
                integration: activeTemplate.name
            });
        }
        if (_errors) {
            setErrors(_errors);
        }
        setData(_data);
    };
    var feedTypeName = isIntegration ? 'Integration' : 'Connector';
    useTrackPage_1.useTrackPage(feedTypeName + " New Modal", feedTypeName + "s");
    react_1.useEffect(function () {
        var key = query.get('key');
        (isIntegration ? feed_1.integrationsFeed() : feed_1.connectorsFeed()).then(function (_feed) {
            setFeed(_feed);
            setLoading(false);
            for (var i = 0; i < _feed.length; i++) {
                if (_feed[i].id === key) {
                    replaceMustache(data, _feed[i]).then(function (template) { return setActiveTemplate(template); });
                    return;
                }
            }
            setRawActiveTemplate(_feed[0]);
            replaceMustache(data, _feed[0]).then(function (template) {
                setActiveTemplate(template);
                setImmediate(function () {
                    var _a;
                    analytics_1.trackEvent("New " + feedTypeName + " Selected", feedTypeName + "s", (_a = {},
                        _a[feedTypeName.toLowerCase()] = template.name,
                        _a[feedTypeName.toLowerCase() + "Default"] = true,
                        _a));
                });
            });
        });
        return function () { };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isIntegration]);
    var handleTemplateChange = function (template) {
        var _a;
        setRawActiveTemplate(template);
        analytics_1.trackEvent("New " + feedTypeName + " Selected", feedTypeName + "s", (_a = {},
            _a[feedTypeName.toLowerCase()] = template.name,
            _a[feedTypeName.toLowerCase() + "Default"] = false,
            _a));
        replaceMustache(data, template).then(function (_template) {
            setActiveTemplate(_template);
        });
    };
    var handleKeyDown = function (e) {
        if (e.key === 'Enter') {
            handleSubmit();
        }
    };
    return (react_1["default"].createElement(SC.Card, { onKeyDown: function (e) { return handleKeyDown(e); }, open: open, ref: ref, tabIndex: -1 },
        react_1["default"].createElement(SC.Close, { onClick: function () { return onClose(); }, src: cross_svg_1["default"], alt: "close", height: "12", width: "12" }),
        react_1["default"].createElement(SC.Title, null, "New " + feedTypeName),
        react_1["default"].createElement(SC.Flex, null,
            react_1["default"].createElement(SC.Column, null,
                react_1["default"].createElement(SC.ColumnItem, { onClick: function () { return handleFilterChange(Filters.ALL); }, active: activeFilter === Filters.ALL }, Filters.ALL),
                react_1["default"].createElement(SC.ColumnItem, { onClick: function () { return handleFilterChange(Filters.MESSAGGING); }, active: activeFilter === Filters.MESSAGGING }, Filters.MESSAGGING),
                react_1["default"].createElement(SC.ColumnItem, { onClick: function () { return handleFilterChange(Filters.PRODUCTIVITY); }, active: activeFilter === Filters.PRODUCTIVITY }, Filters.PRODUCTIVITY),
                react_1["default"].createElement(SC.ColumnItem, { onClick: function () { return handleFilterChange(Filters.CRM); }, active: activeFilter === Filters.CRM }, Filters.CRM),
                react_1["default"].createElement(SC.ColumnItem, { onClick: function () { return handleFilterChange(Filters.CALENDAR); }, active: activeFilter === Filters.CALENDAR }, Filters.CALENDAR)),
            react_1["default"].createElement(SC.ColumnBr, null),
            react_1["default"].createElement(SC.Column, { border: true },
                react_1["default"].createElement(SC.ColumnSearchWrapper, null,
                    react_1["default"].createElement(core_1.TextField, { style: { width: '100%' }, onChange: function (e) { return debouncedSetSearchFilter(e.target.value); }, label: "Search" }),
                    react_1["default"].createElement(SC.ColumnSearchIcon, { src: search_svg_1["default"], alt: "Search " + feedTypeName, height: "24", width: "24" })),
                loading || !activeTemplate ? (react_1["default"].createElement(Loader_1["default"], null)) : (feed.map(function (feedEntry) {
                    var tags = feedEntry.tags.catalog.split(',');
                    var tagIsActive = false;
                    tags.forEach(function (tag) {
                        if (activeFilter.toUpperCase().match(tag.toUpperCase()) || activeFilter === Filters.ALL) {
                            tagIsActive = true;
                        }
                    });
                    if (tagIsActive && feedEntry.name.toUpperCase().includes(searchFilter.toUpperCase())) {
                        return (react_1["default"].createElement(SC.ColumnItem, { key: feedEntry.id, onClick: function () { return handleTemplateChange(feedEntry); }, active: feedEntry.id === activeTemplate.id },
                            react_1["default"].createElement(SC.ColumnItemImage, { src: utils_1.urlOrSvgToImage(feedEntry.smallIcon), alt: feedEntry.name, height: "18", width: "18" }),
                            feedEntry.name));
                    }
                    return null;
                }))),
            react_1["default"].createElement(SC.ColumnBr, null),
            react_1["default"].createElement(SC.ConnectorInfo, null, loading || !activeTemplate ? (react_1["default"].createElement(Loader_1["default"], null)) : (react_1["default"].createElement(react_1["default"].Fragment, null,
                react_1["default"].createElement(SC.ConnectorTitleWrapper, null,
                    react_1["default"].createElement(SC.ConnectorImage, { src: utils_1.urlOrSvgToImage(activeTemplate.smallIcon), alt: activeTemplate.name || 'slack', height: "28", width: "28" }),
                    react_1["default"].createElement(SC.ConnectorTitle, null, activeTemplate.name),
                    react_1["default"].createElement(SC.ConnectorVersion, null, activeTemplate.version)),
                react_1["default"].createElement(SC.GeneralInfoWrapper, null,
                    react_1["default"].createElement(SC.ConnectorDescription, null, activeTemplate.description || ''),
                    activeTemplate.outOfPlan || (react_1["default"].createElement(SC.FormWrapper, null,
                        react_1["default"].createElement(react_2.JsonForms, { schema: activeTemplate.configuration.schema, uischema: activeTemplate.configuration.uischema, data: data, renderers: material_renderers_1.materialRenderers, cells: material_renderers_1.materialCells, onChange: handleJsonFormsChange, validationMode: validationMode })))),
                react_1["default"].createElement(SC.MobileHidden, null,
                    react_1["default"].createElement(core_1.Button, { onClick: activeTemplate.outOfPlan ? handlePlanUpsell : handleSubmit, style: { width: '200px', marginTop: 'auto', marginLeft: 'auto' }, fullWidth: false, size: "large", color: "primary", variant: "contained" }, activeTemplate.outOfPlan ? 'Enable' : 'Create')),
                react_1["default"].createElement(SC.MobileVisible, null,
                    react_1["default"].createElement(core_1.Button, { onClick: activeTemplate.outOfPlan ? handlePlanUpsell : handleSubmit, style: { width: '200px', margin: 'auto' }, fullWidth: false, size: "large", color: "primary", variant: "contained" }, activeTemplate.outOfPlan ? 'Enable' : 'Create'))))))));
});
exports["default"] = FeedPicker;
