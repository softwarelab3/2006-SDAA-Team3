import os
from dotenv import load_dotenv

# Get the directory of the current script (GoogleMapConfig.py)
current_directory = os.path.dirname(os.path.abspath(__file__))

# Navigate one level up from the current directory to reach the .env file
dotenv_path = os.path.join(current_directory, '..','.env')

# Load environment variables from the .env file
load_dotenv(dotenv_path)

# Create the googleMapConfig dictionary
class HDBCarParkDBConfig:
    def __init__(self):
        self.DB_USER = os.getenv('DB_USER')
        self.DB_PASSWORD = os.getenv('DB_PASSWORD')
        self.DB_SERVER = os.getenv('DB_SERVER')
        self.DB_DATABASE = os.getenv('DB_DATABASE')
        self.DB_PORT = os.getenv('DB_PORT')
        self.DB_DRIVER = "SQL Server"


