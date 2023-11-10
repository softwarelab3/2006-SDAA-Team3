import requests
import json
import datetime
import pandas as pd

class RetrieveCarParkLots:
  def retrieveData(self):
    today = datetime.datetime.today()
    params = {"date": today.strftime("%Y-%m-%d")} # YYYY-MM-DD

    # api endpoints
    url = "https://api.data.gov.sg/v1/transport/carpark-availability"
    response = requests.get(url).json()
    
    # cleaning
    carpark_data = response['items'][0]['carpark_data']
    data_list = []
    for entry in carpark_data:
        info = entry['carpark_info'][0]
        data_list.append({
            "carpark_number": entry['carpark_number'],
            "total_lots": info['total_lots'],
            "lot_type": info['lot_type'],
            "lots_available": info['lots_available'],
            "update_datetime": entry['update_datetime']
        })
    df = pd.DataFrame(data_list)
    df = df[df['lot_type'] == 'C']
    return self.dataframe_to_dict(df)

  def dataframe_to_dict(self,df):
    return df.set_index('carpark_number').to_dict(orient='index')