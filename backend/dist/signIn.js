"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.signIn = void 0;
const auth_js_1 = require("./auth.js");
const signIn = async (_, { username, password }, { dataSources }) => {
    try {
        const user = await dataSources.db.user.findUnique({
            where: { username },
            select: {
                id: true,
                username: true,
                password: true,
            },
        });
        if (!user) {
            return {
                code: 401,
                message: "Utilisateur non trouvé",
                success: false,
                token: null,
            };
        }
        const isValidPassword = await (0, auth_js_1.comparePasswords)(password, user.password);
        if (!isValidPassword) {
            return {
                code: 401,
                message: "Mot de passe invalide",
                success: false,
                token: null,
            };
        }
        const token = (0, auth_js_1.createJWT)(user);
        return {
            code: 200,
            message: "Utilisateur connecté avec succès",
            success: true,
            token,
        };
    }
    catch (error) {
        console.error("Erreur lors de la connexion:", error);
        return {
            code: 401,
            message: "Nom d'utilisateur ou mot de passe incorrect",
            success: false,
            token: null,
        };
    }
};
exports.signIn = signIn;
