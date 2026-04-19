import { jwtUtils } from "./jwt";
import { envVars } from "../config/env";
import { cookieUtil } from "./cookie";
const getAccessToken = (payload) => {
    const accessToken = jwtUtils.createToken(payload, envVars.ACCESS_TOKEN_SECRET, { expiresIn: envVars.ACCESS_TOKEN_EXPIRES_IN });
    return accessToken;
};
const getRefreshToken = (payload) => {
    const refreshToken = jwtUtils.createToken(payload, envVars.BETTER_AUTH_SECRET, { expiresIn: envVars.REFRESH_TOKEN_EXPIRES_IN });
    return refreshToken;
};
const setAccessTokenCookie = (res, token) => {
    cookieUtil.setCookie(res, "accessToken", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 60 * 60 * 24 * 1000,
    });
};
const setRefreshTokenCookie = (res, token) => {
    cookieUtil.setCookie(res, "refreshToken", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 60 * 60 * 24 * 1000,
    });
};
const setBetterAuthSessionCookie = (res, token) => {
    cookieUtil.setCookie(res, "better-auth.session_token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 60 * 60 * 24 * 1000,
    });
};
export const tokenUtil = {
    getAccessToken,
    getRefreshToken,
    setAccessTokenCookie,
    setRefreshTokenCookie,
    setBetterAuthSessionCookie,
};
