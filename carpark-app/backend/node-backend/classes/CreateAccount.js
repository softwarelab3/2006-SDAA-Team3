const AccountManager = require("./AccountManager.js");
const sql = require("mssql");

class CreateAccount extends AccountManager{
  constructor(config){
    super(config);
    this.email = "";
    this.confirmPassword = ""
  }

  ///// old implementation /////
  // async checkEmail(){
  //   try {
  //     // connect to sql database
  //     console.log("im here");
  //     const pool = new sql.ConnectionPool(this.userDatabaseConfig);
  //     console.log("im here 2")
  //     await pool.connect();
      
  //     // get email from sql database using this.username
  //     const query = `SELECT email FROM users WHERE email = '${this.getEmail()}'`;
  //     console.log(query);
  //     const result = await pool.request().query(query);
  //     console.log(result);
      
  //     // no email in registry, clear check one
  //     if (result.recordset.length === 0) {
  //       return true;
  //     }

  //     else{
  //       console.log("email exist");
  //       return false;
  //     }
  //   }
  //   catch (error) {
  //     console.error("Error in checkEmail:", error);
  //     throw error; // Rethrow the error to be handled by the calling function
  //   }

  // }
  ///// old implementation /////
  // async checkUsername(){
  //   try {
  //     console.log("username debug");
  //     console.log(this.getUserName());
  //     // connect to sql database
  //     const pool = new sql.ConnectionPool(this.userDatabaseConfig);
  //     await pool.connect();
      
  //     // get email from sql database using this.username
  //     const query = `SELECT username FROM users WHERE username = '${this.getUserName()}'`;
  //     console.log(query);
  //     const result = await pool.request().query(query);
  //     console.log(result);
      
  //     // no username in registry, clear check two, can add in registry
  //     if (result.recordset.length === 0) {
  //       return true;
  //     }

  //     else{
  //       return false;
  //     }
  //   }
  //   catch (error) {
  //     console.error("Error in checkUsername:", error);
  //     throw error; // Rethrow the error to be handled by the calling function
  //   }

  // }

  setEmail(email){
    this.email = email;
  }
  setConfirmPassword(confirmPassword){
    this.confirmPassword = confirmPassword;
  }
  getEmail(){
    return this.email;
  }
  getConfirmPassword(){
    return this.confirmPassword;
  }

  verifyPassword(password) {
    // Check if the password length is less than 8
    if (password.length < 8) {
      return false;
    }
  
    // Regular expressions to check for specific character types
    const uppercaseRegex = /[A-Z]/;
    const lowercaseRegex = /[a-z]/;
    const specialCharRegex = /[!@#$%^&*()_+{}\[\]:;<>,.?~\\-]/; // You can customize this regex for special characters
    const digitRegex = /[0-9]/;
  
    // Check if the password meets all the requirements
    if (
      uppercaseRegex.test(password) &&
      lowercaseRegex.test(password) &&
      specialCharRegex.test(password) &&
      digitRegex.test(password)
    ) {
      return true;
    }
  
    // If any of the requirements are not met, return false
    return false;
  }
  
  checkConfirmPassword(){
    // password match
    return (this.getPassword() === this.getConfirmPassword())
  }

  async addToUserDatabase(){
    try {
      const pool = new sql.ConnectionPool(this.userDatabaseConfig);
      await pool.connect();
      const passwordRecoveryToken = require("uuid").v4();
      const insertQuery = `INSERT INTO users (username, password, email, favouriteCarpark, passwordRecoveryToken) VALUES (@userName, @password, @email, NULL,@passwordRecoveryToken)`;
      await pool.request()
        .input('username', sql.NVarChar(255), this.getUserName())
        .input('password', sql.NVarChar(255), this.getPassword())
        .input('email', sql.NVarChar(255), this.getEmail())
        .input('passwordRecoveryToken',sql.NVarChar(255),passwordRecoveryToken)
        .query(insertQuery);
    }
    catch(error){
      console.error("Error in addToUserDatabase:", error);
      throw error; // Rethrow the error to be handled by the calling function
    }
  }
}

module.exports = CreateAccount;
