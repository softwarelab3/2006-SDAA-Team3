const sql = require("mssql");
const config = require("./UserDatabaseConfiguration"); // Correct path to the configuration file
class FavouriteManager{
  constructor(userDatabaseConfiguration){
    this.userDatabaseConfiguration = userDatabaseConfiguration;
  }
  async addToFavourite(username, favouriteAddress,latitude, longitude){
      
      // Create a connection pool
    const pool = new sql.ConnectionPool(this.userDatabaseConfiguration);

    const user = username;
    const fav = favouriteAddress;
    const lat = latitude;
    const lng = longitude;

    try{
        await pool.connect();
        const request = new sql.Request(pool);

        request.input('user', sql.VarChar, user); //set input into VarChar data type
        request.input('fav', sql.VarChar, fav); //set input into VarChar data type
        request.input('lat',sql.Float,lat);
        request.input('lng',sql.Float,lng);

        // test if carpark is already in favourites
        const DupQuery = 'SELECT TOP 1 * FROM favouriteCarpark WHERE username = @user AND favourite = @fav';
        const isDuplicate = await request.query(DupQuery);

        if (isDuplicate.recordset.length == 0){

            await request.query('INSERT INTO favouriteCarpark (username, favourite, latitude, longitude) VALUES (@user, @fav, @lat, @lng)')
            console.log("Carpark Added To Favourite");
            return true;
        }
        else{
            console.log('Carpark is already in Favourites!');
            return false;
        }
    }
    catch(err){
        console.error('Error sending data:', err);
        throw err;
    }
    finally{
        await pool.close();
    }
  }

  async findFavourite(username){
    const pool = new sql.ConnectionPool(this.userDatabaseConfiguration);
    try{
      await pool.connect();
      const request = new sql.Request(pool);
      const query = `SELECT favourite FROM favouriteCarpark WHERE username = '${username}'`;
      const checkResult = await request.query(query);

      if (checkResult.recordset.length>0){
        const newArray = checkResult.recordset.map(item => item.favourite);
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

  async getCoordinates(username, address) {
    const pool = new sql.ConnectionPool(this.userDatabaseConfiguration);
    try {
        await pool.connect();
        const request = new sql.Request(pool);
        const query = "SELECT latitude, longitude FROM favouriteCarpark WHERE username = @username and favourite = @address";
        request.input('username', sql.VarChar, username);
        request.input('address', sql.VarChar, address);
        const checkResult = await request.query(query);

        if (checkResult.recordset.length > 0) {
            const coordinates = checkResult.recordset[0];
            console.log(coordinates);
            return coordinates;
        } else {
            console.log("No results found");
            return false;
        }
    } catch (err) {
        console.error('Error retrieving data:', err);
        throw err;
    } finally {
        pool.close();
    }
}



    async deleteFavourite(username, favouriteAddress){
  
      const pool = new sql.ConnectionPool(this.userDatabaseConfiguration);
  
      try{
          await pool.connect();
          const request = new sql.Request(pool);
  
          const user = username;
          const fav = favouriteAddress;
  
          request.input('user', sql.VarChar, user);
          request.input('fav', sql.VarChar, fav);

          const checkQuery = 'SELECT TOP 1 1 FROM favouriteCarpark WHERE username = @user AND favourite = @fav;';
          const checkResult = await request.query(checkQuery);

          if (checkResult.recordset.length>0){
              const deleteQuery = `DELETE TOP (1) FROM favouriteCarpark WHERE username = @user AND favourite = @fav;`;
  
              await request.query(deleteQuery);
              console.log('Deleted from Favourites!');
              return true 
          }
          else{
              console.log("Favourite does not exist, no deletion!")
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

module.exports = FavouriteManager;
