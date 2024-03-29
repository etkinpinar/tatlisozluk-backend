/**
 * @description holds auth routes
 */

import Router from 'express-promise-router';
import { Request, Response } from 'express';
import { AuthController } from '../controller/auth.controller';
import { ResponseCode, User, Context } from '@open-template-hub/common';

const subRoutes = {
  root: '/',
  signup: '/signup',
  login: '/login',
  logout: '/logout',
  token: '/token',
  verify: '/verify',
  forgetPassword: '/forget-password',
  resetPassword: '/reset-password',
  getResetPasswordToken: '/reset-password-token',
};

export const publicRoutes = [
  subRoutes.signup,
  subRoutes.login,
  subRoutes.logout,
  subRoutes.token,
  subRoutes.verify,
  subRoutes.forgetPassword,
  subRoutes.resetPassword,
];

export const adminRoutes = [subRoutes.getResetPasswordToken];

export const router = Router();

router.post(subRoutes.signup, async (req: Request, res: Response) => {
  // sign up
  const authController = new AuthController();
  const context = res.locals.ctx as Context;
  const response = await authController.signup(context.mongodb_provider, {
    username: req.body.username,
    password: req.body.password,
    email: req.body.email,
  } as User);
  res.status(ResponseCode.CREATED).json(response);
});

router.post(subRoutes.login, async (req: Request, res: Response) => {
  // login
  const authController = new AuthController();
  const context = res.locals.ctx as Context;
  const response = await authController.login(context.mongodb_provider, {
    username: req.body.username,
    password: req.body.password,
    email: req.body.email,
  } as User);
  res.status(ResponseCode.OK).json({
    accessToken: response.accessToken,
    refreshToken: response.refreshToken,
  });
});

router.post(subRoutes.logout, async (req: Request, res: Response) => {
  //  logout
  const authController = new AuthController();
  const context = res.locals.ctx as Context;
  await authController.logout(context.mongodb_provider, req.body.token);
  res.status(ResponseCode.NO_CONTENT).json({});
});

router.post(subRoutes.token, async (req: Request, res: Response) => {
  // get token
  const authController = new AuthController();
  const context = res.locals.ctx as Context;
  const accessToken = await authController.token(
    context.mongodb_provider,
    req.body.token
  );
  res
    .status(ResponseCode.OK)
    .json({ accessToken: accessToken, refreshToken: req.body.token });
});

router.get(subRoutes.verify, async (req: Request, res: Response) => {
  // verify token
  const authController = new AuthController();
  const context = res.locals.ctx as Context;
  await authController.verify(
    context.mongodb_provider,
    req.query.token as string
  );
  res.status(ResponseCode.OK).json({});
});

router.post(subRoutes.forgetPassword, async (req: Request, res: Response) => {
  // forget password
  const authController = new AuthController();
  const context = res.locals.ctx as Context;
  await authController.forgetPassword(
    context.mongodb_provider,
    req.body.username
  );
  res.status(ResponseCode.OK).json({});
});

router.get(
  subRoutes.getResetPasswordToken,
  async (req: Request, res: Response) => {
    // gets reset password token
    const authController = new AuthController();
    const context = res.locals.ctx as Context;
    const resetPasswordToken = await authController.forgetPassword(
      context.mongodb_provider,
      req.query.username as string
    );
    res.status(ResponseCode.OK).json({ resetPasswordToken });
  }
);

router.post(subRoutes.resetPassword, async (req: Request, res: Response) => {
  // reset password
  const authController = new AuthController();
  const context = res.locals.ctx as Context;
  await authController.resetPassword(
    context.mongodb_provider,
    {
      username: req.body.username,
      password: req.body.password,
    } as User,
    req.body.token
  );
  res.status(ResponseCode.OK).json({});
});
