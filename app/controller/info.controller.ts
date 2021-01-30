/**
 * @description holds info controller
 */

import { UserRepository } from '../repository/user.repository';
import { MongoDbProvider, TokenUtil, User } from '@open-template-hub/common';
import { Environment } from '../../environment';

export class InfoController {
  /**
   * gets user details by token
   * @param db database
   * @param token token
   */
  me = async (db: MongoDbProvider, token: string) => {
    const environment = new Environment();
    const tokenUtil = new TokenUtil(environment.args());
    const user = tokenUtil.verifyAccessToken(token) as User;

    const userRepository = await new UserRepository().initialize(
        db.getConnection()
    );
    return await userRepository.findEmailByUsername(user.username);
  };
}
