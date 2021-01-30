/**
 * @description holds user data model
 */

import mongoose from 'mongoose';
const { isEmail } = require('validator');
export class UserDataModel {

  private readonly collectionName: string = 'users';
  private dataSchema: mongoose.Schema;

  constructor() {
    /**
     * Provider schema
     */
    const schema: mongoose.SchemaDefinition = {
      username: {
        type: String,
        required: [true, 'Please enter username'],
        unique: true,
        lowercase: true
      },
      email: {
        type: String,
        required: [true, 'Please enter an email'],
        unique: true,
        lowercase: true,
        validate: [isEmail , 'Please enter a valid email']
      },
      password: {
        type: String,
        required: [true, 'Please enter an password'],
        minlength: [6, 'Minimum password length is 6 characters']
      },
      verified: { type: Boolean },
      userrole: { type: String },
      payload: { type: Object },
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
