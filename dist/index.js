"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const videos_js_1 = __importDefault(require("./routes/videos.js"));
require("dotenv/config");
const cors_1 = __importDefault(require("cors"));
const { BACKEND_URL, PORT, CORS_ORIGIN } = process.env;
const app = (0, express_1.default)();
// middleware
app.use((0, cors_1.default)({ origin: CORS_ORIGIN })); //
app.use(express_1.default.json());
app.use(express_1.default.static("public")); // serve images/ as public static asset
app.use("/videos", videos_js_1.default);
app.listen(PORT, () => {
    console.log(`Listening on port ${BACKEND_URL}${PORT}...`);
});
