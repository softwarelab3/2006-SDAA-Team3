from flask import Flask,request,jsonify
from flask_cors import CORS
from classes.CarParkManager import CarParkManager
from classes.GoogleMapConfig import GoogleMapConfig
from classes.HDBCarParkDBConfig import HDBCarParkDBConfig
from classes.FilterManager import FilterManager
from classes.FilterFactory import CarParkFilter

app = Flask(__name__)
CORS(app, resources={r"/SearchCarPark": {"origins": "*"}})

@app.route('/SearchCarPark', methods=['POST'])
def get_data():
    if request.method == 'POST':
        data = request.get_json()
        # print(data)
         # get user coordinates
        print("getting coordinates...")
        currentCoordinates = data['requestData']['userCurrentPosition']
        # currentCoordinates = {'latitude':4.2105,'longitude':101.9758} # test non local coordinates
        destinationLocation = data['requestData']['location']
        # print(currentCoordinates)
        # print(destinationLocation)

        # check if the user is in local
        print("checking position...")
        carparkMan = CarParkManager(GoogleMapConfig())
        if not (carparkMan.isLocal(currentCoordinates['latitude'],currentCoordinates['longitude'])):
             response= {"status":"Not in Local"}
             return jsonify(response)
        # check if destination location is inputed
        print("checking for destination input...")
        if (carparkMan.isDestination(destinationLocation)):
            targetCoordinates = carparkMan.getCoordinatesFromLocation(destinationLocation) # use input destination as target for distance querying
            if not (carparkMan.isLocal(targetCoordinates[0],targetCoordinates[1])):
                response = {"status":"Destination Not in Local"}
                return response
        else:
            targetCoordinates = (currentCoordinates['latitude'],currentCoordinates['longitude']) # use current position as distance querying
        print("filtering....")
        # perform filtering
        filterChoice = data['requestData']['filter']
        filterOptions = data['requestData']['selectedCheckboxes']
        # print(filterChoice)
        # print(filterOptions)
        filterManager = FilterManager(CarParkFilter())
        filterManager.getHDBCarParkDB()
        filteredSubset = filterManager.applyFilter(filterChoice,filterOptions)
        # print(filteredSubset)

        print("checking for subset....")
        # check if there is a filtered subset
        if (len(filteredSubset) == 0):
            response= {"status":"No results found"}
            return jsonify(response)
            

        # get distances
        print("calculating distances....")
        carparkDistances = carparkMan.calculateDistance(targetCoordinates[0], targetCoordinates[1], filteredSubset,"driving")
        temp = carparkMan.extractWithinDistance(carparkDistances,2)

        
        carparkMan.carparkList = carparkMan.getResult(filteredSubset,temp)
        print("Preparing Result.....")
        if (carparkMan.fiveCarpark()):
            if(carparkMan.isDestination(destinationLocation)):
                response = {'destinationLocation':targetCoordinates,
                            'results': carparkMan.carparkList}
            else:
                response = {'destinationLocation':'',
                            'results': carparkMan.carparkList}
        else:
            response = {"status":"No carparks nearby that matches condition"}

        

        print("sending result to frontend...")
        # response = ""
        return jsonify(response)

if __name__ == '__main__':
    app.run(debug=True)
