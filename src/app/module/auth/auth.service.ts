import status from "http-status";
import AppError from "../../errorHelper.ts/AppError";
import { auth } from "../../lib/auth";
import { IRegisterPatientPayload } from "./auth.interface";

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

  return data.user;
};
