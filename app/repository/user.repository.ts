/**
 * @description holds user repository
 */

import { UserDataModel } from '../data/user.data';
import { HttpError } from '../interface/http-error.interface';
import {
  ResponseCode,
  User,
  UserRole,
} from '@open-template-hub/common';

export class UserRepository {
  private dataModel: any = null;

  /**
   * initializes repository
   * @param connection db connection
   */
  initialize = async (connection: any) => {
    this.dataModel = await new UserDataModel().getDataModel(connection);
    return this;
  };


  /**
   * creates user
   * @param user user
   * @returns user
   */
  createUser = async (user: User) => {
    try {
      return await this.dataModel.create({
        username: user.username,
        email: user.email,
        password: user.password,
        userrole: UserRole.DEFAULT,
      });
    } catch (error) {
      console.error('> createUser error: ', error);
      throw error;
    }
  };

  /**
   * gets user by username or email
   * @param username username
   * @returns user
   */
  findUserByUsernameOrEmail = async (username: string) => {
    let res;
    try {
      res = await this.dataModel.findOne({ $or: [{ username: username }, { email: username }]},
          { username: 1, password: 1, verified: 1, userrole: 1 }
      );
      this.shouldHaveSingleRow(res);
    } catch (error) {
      console.error('> getUserByUsername error: ', error);
      throw error;
    }
    return res;
  };


  /**
   * gets email by username
   * @param username username
   */
  findEmailByUsername = async (username: string) => {
    let res;
    try {
      res = await this.dataModel.findOne({ username }, {username: 1, email: 1});
      this.shouldHaveSingleRow(res);
    } catch (error) {
      console.error(error);
      throw error;
    }
    return res;
  };

  /**
   * gets email and password by username
   * @param username username
   */
  findEmailAndPasswordByUsername = async (username: string) => {
    let res;
    try {
      res = await this.dataModel.findOne({ username }, { username: 1, password: 1, email: 1 });
      this.shouldHaveSingleRow(res);
    } catch (error) {
      console.error(error);
      throw error;
    }

    return res;
  };

  /**
   * checks user is verified or not
   * @param username username
   */
  verifyUser = async (username: string) => {
    try {
      await this.dataModel.update({ username }, {
        $set: { verified: true }
      });
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  /**
   * updates user password by username
   * @param user user
   */
  updateByUsername = async (user: User) => {
    try {
      await this.dataModel.update({ username: user.username }, {
        $set: { password: user.password}
      });
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  /**
   * checks response has single row
   * @param res res
   */
  // TODO Check if there is one user with the given response
  shouldHaveSingleRow = (res: any) => {
    if (res === null || res === undefined) {
      let e = new Error('user not found') as HttpError;
      e.responseCode = ResponseCode.BAD_REQUEST;
      throw e;
    }
    /*
      else if (res.rows.length > 1) {
      console.error('ambiguous token');
      let e = new Error('internal server error') as HttpError;
      e.responseCode = ResponseCode.INTERNAL_SERVER_ERROR;
      throw e;
    }
    */
  };
}
