"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Scope = void 0;
var Scope;
(function (Scope) {
    Scope["READ"] = "TRACE_READ";
    // Asset
    Scope["ASSET_CREATE"] = "TRACE_ASSET_CREATE";
    Scope["ASSET_DELETE"] = "TRACE_ASSET_DELETE";
    Scope["ASSET_ASSIGN"] = "TRACE_ASSET_ASSIGN";
    Scope["ASSET_RETURN"] = "TRACE_ASSET_RETURN";
    Scope["ASSET_AUDIT"] = "TRACE_ASSET_AUDIT";
    Scope["ASSET_MOVE"] = "TRACE_ASSET_MOVE";
    // User
    Scope["USER_CREATE"] = "TRACE_USER_CREATE";
    Scope["USER_DELETE"] = "TRACE_USER_DELETE";
    Scope["USER_AUDIT"] = "TRACE_USER_AUDIT";
    // Location
    Scope["LOCATION_CREATE"] = "TRACE_LOCATION_CREATE";
    Scope["LOCATION_DELETE"] = "TRACE_LOCATION_DELETE";
    Scope["LOCATION_AUDIT"] = "TRACE_LOCATION_AUDIT";
    // Settings
    Scope["SETTINGS_ADMIN"] = "TRACE_SETTINGS_ADMIN";
})(Scope || (exports.Scope = Scope = {}));
