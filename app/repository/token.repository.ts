/**
 * @description holds token repository
 */

import { TokenDataModel } from '../data/token.data';
import { HttpError } from '../interface/http-error.interface';
import {
  ResponseCode,
  TokenUtil,
  PostgreSqlProvider,
  User,
} from '@open-template-hub/common';
import { AuthToken } from '../interface/auth-token.interface';
import { Environment } from '../../environment';

export class TokenRepository {
  private tokenModel: any = null;

  /**
   * initializes repository
   * @param connection db connection
   */
  initialize = async (connection: any) => {
    this.tokenModel = await new TokenDataModel().getDataModel(connection);
    return this;
  };

  /**
   * generates access and refresh tokens
   * @param user user
   */
  generateTokens = async (user: User): Promise<AuthToken> => {
    const environment = new Environment();
    const tokenUtil = new TokenUtil(environment.args());
    const accessToken = tokenUtil.generateAccessToken(user);
    const refreshToken = tokenUtil.generateRefreshToken(user);

    await this.createToken({
      token: refreshToken.token,
      expireAt: new Date(refreshToken.exp * 1000),
    });

    return {
      accessToken: accessToken,
      refreshToken: refreshToken.token,
    } as AuthToken;
  };

  /**
   * saves token
   * @param token token
   */

  createToken = async (token: any) => {
    try {
      return await this.tokenModel.create({
        text: token.token,
        expireDate: token.expireAt
      });
    } catch (error) {
      console.error('> createToken error: ', error);
      throw error;
    }
  };


  /**
   * deletes token
   * @param token token
   */
  deleteToken = async (token: any) => {
    try {
      return await this.tokenModel.findOneAndDelete({ token });
    } catch (error) {
      console.error('> deleteToken error: ', error);
      throw error;
    }
  };

  /**
   * gets token
   * @param token token
   */
  findToken = async (token: any) => {
    let res;
    try {
      res = await this.tokenModel.findOne({ token });
    } catch (error) {
      console.error(error);
      throw error;
    }

    /**
     * TODO Check if there is no token in db with the given token
     * TODO Also check if there is more than 1 token
     * */
    if (res.rows.length === 0) { //res === null || res === undefined
      let e = new Error('invalid token') as HttpError;
      e.responseCode = ResponseCode.UNAUTHORIZED;
      throw e;
    } else if (res.rows.length > 1) {
      console.error('ambiguous token');
      let e = new Error('internal server error') as HttpError;
      e.responseCode = ResponseCode.INTERNAL_SERVER_ERROR;
      throw e;
    }

    return res;
  };

  /**
   * deletes all expired tokens
   */
  deleteExpiredTokens = async () => {
    let res;
    try {
      return await this.tokenModel.remove({ expireDate : {"$lt" : new Date() } }
      );
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
}
