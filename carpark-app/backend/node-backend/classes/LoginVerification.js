const AccountManager = require("./AccountManager.js");

class LoginVerification extends AccountManager {
  constructor(config) {
    super(config); // Call the constructor of the base class (AccountManager)
    this.admin = false;
  }
  getAdmin(){
    return this.admin;
  }

  setAdmin(comparison){
    return this.admin = comparison;
  }

  isAdmin(userName) {
   this.setAdmin(userName === "admin");
    return this.admin;
  }


  async verifyLogin(userName, password) {
    console.log("debug1");
    const result = await this.getUserInfo();
    console.log(result);
    
    if (result.length === 0) {
      console.log("no results");
      return false;
    }
    
    const userInfo = result[0];
    
    if (userInfo.u_pw === password) {
      return true;
    }
    
    return false;
  }
}

module.exports = LoginVerification;
