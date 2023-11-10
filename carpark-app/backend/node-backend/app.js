const express = require("express");
const LoginVerification = require("./classes/LoginVerification");
const CreateAccount = require("./classes/CreateAccount");
const PasswordManager = require("./classes/PasswordManager");
const FavouriteManager = require("./classes/FavouriteManager");
const config = require("./classes/UserDatabaseConfiguration"); // Correct path to the configuration file
const ownerCredential = require("./classes/OwnerCredential");
const cors = require("cors");
const ReportManager = require("./classes/ReportManager");
const app = express();
const corsOptions = {
  origin: "http://localhost:5173", // Replace with your frontend's URL
};

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors(corsOptions)); // Pass corsOptions to cors middleware
// app.options('*', cors()); // This line is not needed


// Routing for Login
app.post("/Login", async (req, res) => {
  try {
    const { userName, password } = req.body;
    console.log(req.body);
    const LoginMan = new LoginVerification(config);
    LoginMan.setUserName(userName);
    LoginMan.setPassword(password);
    if (await LoginMan.verifyLogin(userName, password))
    {
      if (LoginMan.isAdmin(userName))
      {
        return res.json({status: "admin login"});
      }
      else{
        return res.json({status: "user login"})
      }
    }
    else{
      return res.json({status: "error", error: "Invalid username or password"})
    };


  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({message: "Internal server error" });
    
  }
});

// Routing for CreateAccount
app.post("/CreateAccount", async (req, res) => {
  try {
    const { email, userName, password, confirmPassword } = req.body;
    console.log(req.body);
    if (
      req.body.email === '' ||
      req.body.userName === '' ||
      req.body.password === '' ||
      req.body.confirmPassword === ''
    ) {
      return res.json({ status: "some fields are empty" });
    }
    const CreateMan = new CreateAccount(config);
    CreateMan.setUserName(userName);
    console.log("I am at the top");
    console.log(CreateMan.getUserName());
    CreateMan.setPassword(password);
    CreateMan.setEmail(email);
    CreateMan.setConfirmPassword(confirmPassword)

    

    // Check email
    if (!(await CreateMan.checkUserInfo('email','email',CreateMan.getEmail()))) {
      console.log("im here dammit");
      return res.json({ status: "email has been used" });
    }
    ///// old implementation /////
    // if (!(await CreateMan.checkEmail())) {
    //   console.log("back to app");
    //   return res.json({ status: "email has been used" });
    // }

    
    // Check username
    if (!(await CreateMan.checkUserInfo('username','username',CreateMan.getUserName()))) {
      console.log("im here dammit");
      return res.json({ status: "invalid username" });
    }

    ///// old implementation /////
    // if (!(await CreateMan.checkUsername())) {
    //   console.log("im here dammit");
    //   return res.json({ status: "invalid username" });
    // }

    // Verify password
    if (!CreateMan.verifyPassword(password)) {
      return res.json({ status: "weak password" });
    }

    // Confirm password
    if (!CreateMan.checkConfirmPassword()) {
      return res.json({ status: "passwords do not match" });
    }

    // Add user to the database
    await CreateMan.addToUserDatabase();

    return res.json({ status: "account has been created" });

  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({message: "Internal server error" });
    
  }
});

// Routing for ForgetPasswordLogin
app.post("/ForgetPasswordLogin", async (req, res) => {
  try {
    if (req.body.email === '') {
      return res.json({ status: "some fields are empty" });
    }
    const{email} = req.body;
    
    console.log(req.body);
    const PasswordMan = new PasswordManager(config, ownerCredential);
    let status = await PasswordMan.sendEmail(email);
    console.log(status);
    if (status){
      console.log("success");
      return res.json({status:"email sent"});
    }
    else{
      console.log("failure");
      return res.json({status: "account don't exist"});
    }
      // console.log("email sent");

  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({message: "Internal server error" });
    
  }
});

// Reset Password
app.post("/ResetPassword", async(req, res) =>{
  try {
    const {token,password, confirmPassword} = req.body;
    console.log(token);
    console.log(password);
    console.log(confirmPassword);
    const PasswordMan = new PasswordManager(config,ownerCredential);
    PasswordMan.setPassword(password);
    PasswordMan.setConfirmPassword(confirmPassword);
    PasswordMan.setPasswordRecoveryToken(token);
    if (!PasswordMan.verifyPassword(password))
    { 
      return res.json({status: "weak password"});
    }
    if (!PasswordMan.checkConfirmPassword())
    {
      return res.json({status: "passwords do not match"});
    }
    let status = await PasswordMan.changePassword();
    if(status)
    {
      return res.json({status: "password have been changed"})
    } else{
      return res.json({status: "something is wrong"});
    }
    

  } catch(error){
    console.error("Error:", error);
    res.status(500).json({message: "Internal server error" });
  }

})

app.post("/AddToFavourite", async (req, res) => {
  try {
    console.log(req.body);
    const { userName, address, latitude, longitude } = req.body;
    const favMan = new FavouriteManager(config);

    // Wrap the asynchronous operation inside a Promise
    const result = new Promise((resolve, reject) => {
      favMan.addToFavourite(userName, address, latitude, longitude)
        .then((result) => {
          resolve(result);
        })
        .catch((error) => {
          reject(error);
        });
    });

    // Wait for the Promise to resolve or reject
    result
      .then((data) => {
        if (data) {
          res.json({ status: "added to favourite" });
        } else {
          res.json({ status: "already in favourite" });
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        res.status(500).json({ message: "Internal server error" });
      });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});


app.post("/LoadFavouriteCarPark", async (req, res) => {
  try {
    console.log(req.body);
    const userName = req.body.userName;
    const favMan = new FavouriteManager(config);
    const result = new Promise((resolve, reject) => {
      favMan.findFavourite(userName)
        .then((result) => {
          resolve(result);
        })
        .catch((error) => {
          reject(error);
        });
    });

    result
    .then((data) => {
      if (data) {
        res.json({FavouriteList: data});
      } else {
        res.json({ status: "No Favourite" });
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      res.status(500).json({ message: "Internal server error" });
    });



  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/FavouriteCarPark", async (req, res) => {
  try {
    console.log(req.body);
    const {userName, address, action} = req.body;
    const favMan = new FavouriteManager(config);
    if (action === "Delete"){
      favMan.deleteFavourite(userName,address)
      res.json({status:"item deleted"});
    }
    if (action === "Navigate"){
      
      const result = new Promise((resolve, reject) => {
        favMan.getCoordinates(userName,address)
          .then((result) => {
            resolve(result);
          })
          .catch((error) => {
            reject(error);
          });
      });
  
      result
      .then((data) => {
        if (data) {
          res.json({coordinates:data});
        } else {
          res.json({ status: "error" });
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        res.status(500).json({ message: "Internal server error" });
      });
    }
 
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});


app.post("/Report", async (req, res) => {
  console.log("Server route is being triggered");
  try {
    const { details, problem } = req.body;
    console.log(req.body);
    if (
      req.body.details === '' ||
      req.body.problem === '' 
    ) {
      return res.json({ status: "some fields are empty" });
    }
    const newReport = new ReportManager(config);
    newReport.setDetails(details);
    console.log(newReport.getDetails());
    newReport.setProblem(problem);

    // Add user to the database
    newReport.makeReport();

    return res.json({ status: "report has been created" });

  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({message: "Internal server error" });
    
  }
});


app.post("/LoadReport", async (req, res) => {
  try {
    const reportMan = new ReportManager(config);
    const result = new Promise((resolve, reject) => {
      reportMan.findReport()
        .then((result) => {
          resolve(result);
        })
        .catch((error) => {
          reject(error);
        });
    });

    result
    .then((data) => {
      if (data) {
        res.json({ReportList: data});
      } else {
        res.json({ status: "No Report" });
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      res.status(500).json({ message: "Internal server error" });
    });



  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});


app.post("/ResolveReport", async (req, res) => {
  try {
    console.log(req.body);
    const id = req.body.id;
    const reportMan = new ReportManager(config);
    console.log(id);
    reportMan.resolveReport(id);
    res.json({status:"item resolved"});


  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});


const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Listening to port ${port}`);
});
