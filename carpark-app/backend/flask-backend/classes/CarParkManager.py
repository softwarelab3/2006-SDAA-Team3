import requests
from .RetrieveCarParkLots import RetrieveCarParkLots

class CarParkManager:
    def __init__(self, googleMapConfig):
        self.carparkList = ""
        self.apiKey = googleMapConfig.api_key

    def isDestination(self, searchBoxInput):
        # Function to check whether anything is inserted in the search box of the car park web app
        return bool(searchBoxInput)

    def fiveCarpark(self):
        # Function to check whether there is any car park from the filtered subset
        return len(self.carparkList) > 0

    def isLocal(self, userLat, userLong):
        # Function to check the current position of the user to determine whether the user is local
        singaporeBound = {
            'minLat': 1.15,
            'maxLat': 1.47,
            'minLong': 103.60,
            'maxLong': 104.00
        }

        # Check within boundaries
        return singaporeBound['minLat'] <= userLat <= singaporeBound['maxLat'] and \
               singaporeBound['minLong'] <= userLong <= singaporeBound['maxLong']

    
    def calculateDistance(self, sourceLat, sourceLong, destinationCoordinates, mode="driving"):
        # Function query Google Maps API for distance
        try:
            api_key = self.apiKey  # Replace with your actual API key
            max_destinations_per_request = 25
            destinations = [destinationCoordinates[i:i+max_destinations_per_request] for i in range(0, len(destinationCoordinates), max_destinations_per_request)]

            all_distances = {}  # Use a dictionary to map coordinates to distances

            for destination_batch in destinations:
                print("getting distances...")
                destinations_str = '|'.join([f"{coord[5]},{coord[6]}" for coord in destination_batch])
                response = requests.get(
                    f"https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins={sourceLat},{sourceLong}&destinations={destinations_str}&mode={mode}&key={api_key}"
                )

                if response.status_code == 200:
                    data = response.json()
                    if data['status'] == "OK":
                        results = data['rows'][0]['elements']

                        for i, result in enumerate(results):
                            # Extract the distance and duration for this destination
                            distance = result['distance']['text']
                            duration = result['duration']['text']

                            # Get the corresponding destination coordinate
                            destination_coord = destination_batch[i][1]

                            # Map the coordinate to its distance in the dictionary
                            all_distances[destination_coord] = {
                                'distance': distance,
                                'duration': duration
                            }
            # print(all_distances)
            return all_distances

        except Exception as error:
            # Handle the error here, you can print or log it.
            return None


    def getCoordinatesFromLocation(self, destination):
    # Replace 'YOUR_API_KEY' with your actual Google Maps Geocoding API key
        api_key = self.apiKey
        
        # Prepare the API request URL
        base_url = 'https://maps.googleapis.com/maps/api/geocode/json'
        params = {
            'address': destination,
            'key': api_key
        }

        # Send the request to the Google Geocoding API
        response = requests.get(base_url, params=params)
        data = response.json()

        # Check if the request was successful
        if response.status_code == 200 and data['status'] == 'OK':
            # Extract the latitude and longitude
            location = data['results'][0]['geometry']['location']
            latitude = location['lat']
            longitude = location['lng']
            return (latitude, longitude)
        else:
            # Handle errors, e.g., invalid API key, no results found, etc.
            print('Error: Unable to retrieve coordinates')
            return None
    def extractWithinDistance(self,distances, max_distance, max_results=5):
        result = {}
        sorted_distances = sorted(distances.items(), key=lambda x: float(x[1]['distance'].replace(' km', '')))

        for location, info in sorted_distances:
            # Extract the numeric value of distance in kilometers
            distance_value = float(info['distance'].replace(' km', ''))

            if distance_value <= max_distance and len(result) < max_results:
                result[location] = info

        return result
    def getResult(self, filteredSubset, result):
        # Create a new dictionary to store the combined information
        combined_info = {}
        df = RetrieveCarParkLots().retrieveData()

        # Iterate through the result dictionary
        for address, info in result.items():
            # Find the corresponding data in your data list based on the address
            matching_data = next((d for d in filteredSubset if d[1] == address), None)

            if matching_data:
                # Extract information
                carpark_code = matching_data[0]
                distance = info['distance']
                duration = info['duration']
                latitude = matching_data[5]
                longitude = matching_data[6]
                

                # Create a dictionary for the address with the desired format
                address_info = {
                    'carpark_code': carpark_code,
                    'distance': distance,
                    'duration': duration,
                    'latitude': latitude,
                    'longitude': longitude,
                }

                if carpark_code in df:
                    carpark_data = df[carpark_code]
                    address_info['total_lots'] = carpark_data['total_lots']
                    address_info['lots_available'] = carpark_data['lots_available']
            
                # If 'carpark_code' is not found in df, remove the whole key-value pair from address_info
                else:
                    continue

                # Add the address and its information to the combined dictionary
                combined_info[address] = address_info
                
        return combined_info


