const sql = require('mssql');

class ReportManager {
  static counter = 1; // Initialize a static counter

  constructor(userDatabaseConfiguration) {
    this.reportid = ReportManager.counter++; // Assign the current value of the counter and then increment it
    this.details = "";
    this.problem = "";
    this.userDatabaseConfiguration = userDatabaseConfiguration;
  }

  setDetails(details) {
    this.details = details;
  }

  setProblem(problem) {
    this.problem = problem;
  }

  getReportID() {
    return this.reportid;
  }

  getDetails() {
    return this.details;
  }

  getProblem() {
    return this.problem;
  }

  async getLastReportID() {
    const pool = new sql.ConnectionPool(this.userDatabaseConfiguration);
    try {

      
      await pool.connect();
      const request = new sql.Request(pool);
      const query = "SELECT MAX(reportid) AS lastReportID FROM userreport";
      const result = await request.query(query);

      const lastReportID = result.recordset[0].lastReportID || 0;
      return lastReportID + 1;
    } catch (err) {
      throw err;
    } finally {
      sql.close();
    }
  }

  async makeReport() {

    const pool = new sql.ConnectionPool(this.userDatabaseConfiguration);
    try {
      await pool.connect();
      const request = new sql.Request(pool);

      const nextReportID = await this.getLastReportID();

      request.input('nextReportID', sql.Int, nextReportID);
      request.input('details', sql.NVarChar, this.getDetails());
      request.input('problem', sql.NVarChar, this.getProblem());

      const sqlQuery = "INSERT INTO userreport (reportid, details, problem) VALUES (@nextReportID, @details, @problem)";
      await request.query(sqlQuery);

      console.log("1 record inserted with reportid: " + nextReportID);
    } catch (err) {
      console.error(err);
    } finally {
      sql.close();
    }
  }

  async findReport(){
    const pool = new sql.ConnectionPool(this.userDatabaseConfiguration);
    try{
      await pool.connect();
      const request = new sql.Request(pool);
      const query = "SELECT reportid,details, problem FROM userreport";
      const checkResult = await request.query(query);

      if (checkResult.recordset.length>0){
        const newArray = checkResult.recordset;
        console.log(newArray);
        return newArray;
      }
      else{
        console.log("No results found");
        return false;
      }
    }catch(err){
      console.error('Error deleting data:', err);
      throw err;
    }
    finally{
      await pool.close();
    }
  }

  async resolveReport(reportID){ 
        
    const pool = new sql.ConnectionPool(this.userDatabaseConfiguration); //change argument to this.userDatabaseConfiguration
    
    try{
        await pool.connect();
        const request = new sql.Request(pool);

        const ResolveReportID = parseInt(reportID);
        request.input('ResolveReportID', sql.Int, ResolveReportID);

        const checkQuery = 'SELECT TOP 1 1 FROM userreport WHERE reportid = @ResolveReportID;';
        const checkResult = await request.query(checkQuery);

        if (checkResult.recordset.length>0){
            const resolveQuery = `DELETE TOP (1) FROM userreport WHERE reportid = @ResolveReportID;`;

            await request.query(resolveQuery);
            console.log('Resolved from Reports!');
            return true 
        }
        else{
            console.log("Report does not exist, no deletion!")
            return false
        }        

    }
    catch(err){
        console.error('Error deleting data:', err);
        throw err;
    }
    finally{
        await pool.close();
    }
}
}

module.exports = ReportManager;
