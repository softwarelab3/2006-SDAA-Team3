const CreateAccount = require("./CreateAccount.js");
const nodemailer = require("nodemailer");
const sql = require("mssql");

class PasswordManager extends CreateAccount{

    constructor(config, ownerCredential){
      super(config);
      this.ownerCredential = ownerCredential;
      this.passwordRecoveryToken = "";
    }
    // overide checkUserInfo() // return the email
    async checkUserInfo(columnFields, target, targetValue){
      try {
        console.log("debug1")
        // connect to sql database
        const pool = new sql.ConnectionPool(this.userDatabaseConfig);
        await pool.connect();
        
        // get email from sql database using this.username
        const query = `SELECT ${columnFields} FROM users WHERE ${target} = '${targetValue}'`;
        console.log(query);
        const result = await pool.request().query(query);
        console.log(result);
        
        // no email in registry, no account had been registered
        if (result.recordset.length === 0) {
          return false;
        }
  
        else{
          // get email and passwordRecoveryToken from database
          console.log("debug2");
          console.log(result.recordset[0].email);
          console.log(result.recordset[0].passwordRecoveryToken);
          this.setEmail(result.recordset[0].email);
          this.setPasswordRecoveryToken(result.recordset[0].passwordRecoveryToken);
          return true;
        }
      }
      catch (error) {
        console.error("Error in checkUsername:", error);
        throw error; // Rethrow the error to be handled by the calling function
      }
  
    }
    getOwnerCredential(){
      return this.ownerCredential;
    }

    getDate(){
      let date_ob = new Date();
      let date = ("0" + date_ob.getDate()).slice(-2);
      // current month
      let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
      // current year
      let year = date_ob.getFullYear();
      // current hours
      let hours = date_ob.getHours();
      // current minutes
      let minutes = date_ob.getMinutes();
      // current seconds
      let seconds = date_ob.getSeconds();
      return String(year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds);
    }
    setPasswordRecoveryToken(prt){
      this.passwordRecoveryToken = prt;
    }
    getPasswordRecoveryToken(){
      return this.passwordRecoveryToken;
    }

    async sendEmail(value) {
      try {
        console.log('debug entry');
        const userInfoAvailable = await this.checkUserInfo("email, passwordRecoveryToken", 'email', value);
        if (!userInfoAvailable) {
          console.log("User info not available");
          return false;
        }
        console.log("debug3");
        const sender = this.getOwnerCredential();
        const transporter = nodemailer.createTransport(sender);
        const forgetPaswordLink = `http://localhost:5173/ResetPassword?token=${this.getPasswordRecoveryToken()}`
        // Use HTML content for the email body
        const msg = `<p>Dear user,</p>
                    <p>You have requested for a password change at ${this.getDate()}.</p>
                    <p>Please click <a href="${forgetPaswordLink}">here</a> to change your password.</p>
                    <p>Warm regards,<br>SwiftPark</p>`;
        
        const recepient = this.getEmail();
        console.log("debug4");
        console.log(recepient);
        const mailOptions = {
          from: sender.auth.user,
          to: recepient,
          subject: "Swift Park Account Password Change",
          // Set HTML content for the email body
          html: msg
        };
        console.log("debug 5");
        console.log(recepient);
        console.log("debug6");
        console.log(mailOptions.from);
        console.log(mailOptions.to);
        console.log(mailOptions.html);


        return new Promise((resolve, reject) => {
            transporter.sendMail(mailOptions, (error, info) => {
            console.log("email_entry");
            if (error) {
              console.log(error);
              reject(error);
            } else {
              console.log("Email sent: " + info.response);
              resolve(true);
            }
            })
          });
    
    }catch(error){
      console.log(error);
      return false;
    }
  }
  async changePassword(){
    try {
      console.log("debugChangePassword")
      // connect to sql database
      const pool = new sql.ConnectionPool(this.userDatabaseConfig);
      await pool.connect();
      
      // get email from sql database using this.username
      const query = `UPDATE users SET password = @newPassword WHERE passwordRecoveryToken = @recoveryToken`;
      console.log(query);
      
      const request = pool.request();
      request.input('newPassword', sql.VarChar, this.password);
      request.input('recoveryToken', sql.VarChar, this.passwordRecoveryToken);
      
      const result = await request.query(query);
      if (result.rowsAffected[0] > 0) {
        // Update was successful
        return true;
      } else {
        // No rows were updated
        return false;
      }
      console.log(result);
    } catch (error){
      console.log(error);
    }
  }

}

module.exports = PasswordManager;



