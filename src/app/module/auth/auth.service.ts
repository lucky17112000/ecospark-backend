import status from "http-status";
import AppError from "../../errorHelper.ts/AppError";
import { auth } from "../../lib/auth";
import {
  IChangePasswordPayload,
  ILoginUserPayload,
  IRegisterPatientPayload,
} from "./auth.interface";
import { USER_STATUS } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { tokenUtil } from "../../utiles/token";

const registrationUser = async (payload: IRegisterPatientPayload) => {
  const { name, email, password } = payload;
  const data = await auth.api.signUpEmail({
    body: {
      name,
      email,
      password,
    },
  });
  if (!data.user) {
    throw new AppError(status.BAD_REQUEST, "Failed to register user");
  }

  const accessToken = tokenUtil.getAccessToken({
    userId: data.user.id,
    role: data.user.role,
    name: data.user.name,
    email: data.user.email,
    emailVerified: data.user.emailVerified,
    status: data.user.status,
    isDeleted: data.user.isDeleted,
  });
  const refreshToken = tokenUtil.getRefreshToken({
    userId: data.user.id,
    role: data.user.role,
    name: data.user.name,
    email: data.user.email,
    emailVerified: data.user.emailVerified,
    status: data.user.status,
    isDeleted: data.user.isDeleted,
  });

  return { ...data, accessToken, refreshToken };
};

const logInUser = async (payload: ILoginUserPayload) => {
  const { email, password } = payload;
  const data = await auth.api.signInEmail({
    body: {
      email,
      password,
    },
  });
  if (!data.user) {
    throw new AppError(status.BAD_REQUEST, "Invalid email or password");
  }
  if (data.user.status === USER_STATUS.BLOCKED) {
    throw new AppError(
      status.FORBIDDEN,
      "Your account has been blocked. Please contact support for assistance.",
    );
  }
  if (data.user.isDeleted) {
    throw new AppError(
      status.FORBIDDEN,
      "Your account has been deleted. Please contact support for assistance.",
    );
  }
  //!todo access token and refresh token handling

  const accessToken = tokenUtil.getAccessToken({
    userId: data.user.id,
    role: data.user.role,
    name: data.user.name,
    email: data.user.email,
    emailVerified: data.user.emailVerified,
    status: data.user.status,
    isDeleted: data.user.isDeleted,
  });
  const refreshToken = tokenUtil.getRefreshToken({
    userId: data.user.id,
    role: data.user.role,
    name: data.user.name,
    email: data.user.email,
    emailVerified: data.user.emailVerified,
    status: data.user.status,
    isDeleted: data.user.isDeleted,
  });
  return { ...data, accessToken, refreshToken };
};

const getMe = async () => {};

const changePassword = async (payload: IChangePasswordPayload) => {
  // const session  =
};

const verifyEmail = async (email: string, otp: string) => {
  const result = await auth.api.verifyEmailOTP({
    body: {
      email,
      otp,
    },
  });
  if (result.status && result.user.emailVerified) {
    await prisma.user.update({
      where: { email },
      data: { emailVerified: true },
    });
  }
};
export const authService = {
  registrationUser,
  logInUser,
  getMe,
  changePassword,
  verifyEmail,
};
