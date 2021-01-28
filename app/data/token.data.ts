/**
 * @description holds token data model
 */

import mongoose from 'mongoose';

export class TokenDataModel {
  private readonly collectionName: string = 'token';
  private dataSchema: mongoose.Schema;

  constructor() {
    /**
     * Provider schema
     */
    const schema: mongoose.SchemaDefinition = {
      token: {
        type: String,
        required: true,
        unique: true
      },
      expireDate: {
        type: Date
      },
    };
    this.dataSchema = new mongoose.Schema(schema);
  }

  /**
   * creates provider model
   * @returns provider model
   */
  getDataModel = async (conn: mongoose.Connection) => {
    return conn.model(
      this.collectionName,
      this.dataSchema,
      this.collectionName
    );
  };
}
