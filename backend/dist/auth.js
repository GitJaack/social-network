"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashPassword = exports.comparePasswords = exports.getUser = exports.createJWT = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const TOKEN_EXPIRATION = "1d";
const createJWT = (user) => {
    const token = jsonwebtoken_1.default.sign({
        id: user.id,
        username: user.username,
    }, process.env.JWT_SECRET, { expiresIn: TOKEN_EXPIRATION });
    return token;
};
exports.createJWT = createJWT;
const getUser = (token) => {
    try {
        const payload = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        return payload;
    }
    catch {
        return null;
    }
};
exports.getUser = getUser;
const comparePasswords = async (password, hash) => {
    return bcryptjs_1.default.compare(password, hash);
};
exports.comparePasswords = comparePasswords;
const hashPassword = async (password) => {
    return bcryptjs_1.default.hash(password, 10);
};
exports.hashPassword = hashPassword;
