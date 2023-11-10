import os
from dotenv import load_dotenv

# Get the directory of the current script (GoogleMapConfig.py)
current_directory = os.path.dirname(os.path.abspath(__file__))

# Navigate one level up from the current directory to reach the .env file
dotenv_path = os.path.join(current_directory, '..','.env')

# Load environment variables from the .env file
load_dotenv(dotenv_path)

# Create the googleMapConfig dictionary
class GoogleMapConfig:
    def __init__(self):
        self.api_key = os.getenv('GOOGLE_MAP_API_KEY')


