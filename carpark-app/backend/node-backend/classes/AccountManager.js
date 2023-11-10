const sql = require("mssql");

class AccountManager {

  constructor(userDatabaseConfiguration) {
    this.userName = "";
    this.password = "";
    this.userDatabaseConfig = userDatabaseConfiguration; // Corrected property name
  }

  setUserName(userName) {
    this.userName = userName;
  }

  setPassword(password) {
    this.password = password;
  }

  getUserName() {
    return this.userName;
  }

  getPassword() {
    return this.password;
  }

  async getUserInfo() {
    try {
      // connect to sql database
      const pool = new sql.ConnectionPool(this.userDatabaseConfig);
      await pool.connect();
      
      // get username and password from sql database using this.username
      const query = `SELECT username, password FROM users WHERE username = '${this.getUserName()}'`;
      console.log(query);
      const result = await pool.request().query(query);
      console.log(result);
  
      if (result.recordset.length === 0) {
        return [];
      }
  
      let userinfo = {
        u_pw: result.recordset[0].password,
        u_un: result.recordset[0].username,
        length: result.recordset.length
      }
  
      return [userinfo]; // Return the object containing username and password
    } catch (error) {
      console.error("Error in getUserInfo:", error);
      throw error; // Rethrow the error to be handled by the calling function
    }
  }

  async checkUserInfo(columnFields, target, targetValue){
    try {
      console.log(`debug ${target}`);
      // connect to sql database
      const pool = new sql.ConnectionPool(this.userDatabaseConfig);
      await pool.connect();
      
      // get email from sql database using this.username
      const query = `SELECT ${columnFields} FROM users WHERE ${target} = '${targetValue}'`;
      console.log(query);
      const result = await pool.request().query(query);
      console.log(result);
      
      // no username in registry, clear check two, can add in registry
      if (result.recordset.length === 0) {
        return true;
      }

      else{
        return false;
      }
    }
    catch (error) {
      console.error( error);
      throw error; // Rethrow the error to be handled by the calling function
    }

  }
}
module.exports = AccountManager;

