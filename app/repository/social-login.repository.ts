/**
 * @description holds social login repository
 */

import { PostgreSqlProvider } from '@open-template-hub/common';

export class SocialLoginRepository {
  constructor(private readonly provider: PostgreSqlProvider) {}

  /**
   * gets social login configuration by key
   * @param key key
   */
  findSocialLoginByKey = async (key: string) => {
    let res;
    try {
      let v1Join =
        ' INNER JOIN oauth_v1_config_params CP ON CP.social_login_key = SL.social_login_key';
      let v2Join =
        ' INNER JOIN oauth_v2_config_params CP ON CP.social_login_key = SL.social_login_key';

      let selectClause = 'SELECT SL.*, CP.* FROM social_logins SL';
      let whereClause = ' WHERE SL.social_login_key = $1';

      let v1 = await this.provider.query(selectClause + v1Join + whereClause, [
        key,
      ]);
      let v2 = await this.provider.query(selectClause + v2Join + whereClause, [
        key,
      ]);

      res = {
        v1Config: v1.rowCount > 0 ? v1.rows[0] : null,
        v2Config: v2.rowCount > 0 ? v2.rows[0] : null,
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
    return res;
  };

  /**
   * gets mapping data by external user id
   * @param key key
   * @param userId user id
   */
  findMappingDataByExternalUserId = async (key: string, userId: string) => {
    let res;
    try {
      res = await this.provider.query(
        'SELECT users.username, users.role FROM social_login_mappings LEFT JOIN users ON users.username = social_login_mappings.username WHERE social_login_key LIKE $1 and external_user_id LIKE $2',
        [key, userId]
      );
    } catch (error) {
      console.error(error);
      throw error;
    }

    return res.rows[0];
  };

  /**
   * creates social login mapping
   * @param social_login_key social login key
   * @param external_user_id external user id
   * @param external_username external username
   * @param external_user_email external user email
   * @param autoGeneratedUserName auto generated username
   */
  insertSocialLoginMapping = async (
    social_login_key: string,
    external_user_id: string,
    external_username: string,
    external_user_email: string,
    autoGeneratedUserName: string
  ) => {
    try {
      await this.provider.query(
        'INSERT INTO social_login_mappings(social_login_key, external_user_id, external_username, external_user_email, username) VALUES($1, $2, $3, $4, $5)',
        [
          social_login_key,
          external_user_id,
          external_username,
          external_user_email,
          autoGeneratedUserName,
        ]
      );
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
}
