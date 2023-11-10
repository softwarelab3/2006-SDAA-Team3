import pyodbc
from .HDBCarParkDBConfig import HDBCarParkDBConfig
from .FilterFactory import CarParkFilter

class FilterManager:
	def __init__(self,factory):
		self.database_config = HDBCarParkDBConfig()  # Initialize with the provided database configuration
		self.data = ""
		self.factory = factory

	def getHDBCarParkDB(self):
# Establish a database connection using the configuration
		connection_string = (
		f"DRIVER={{{self.database_config.DB_DRIVER}}};"
		f"SERVER={self.database_config.DB_SERVER};"
		f"DATABASE={self.database_config.DB_DATABASE};"
		f"UID={self.database_config.DB_USER};"
		f"PWD={self.database_config.DB_PASSWORD};"
		f"PORT={self.database_config.DB_PORT};"
		)
		# print(connection_string)
		try:
			conn = pyodbc.connect(connection_string)
			cursor = conn.cursor()

			# Fetch the first 5 rows from the HDBCarParkData table (replace with your actual table name)
			cursor.execute("SELECT * FROM HDBCarParkData")
			self.data = cursor.fetchall()

			return self.data
		except Exception as e:
			print(f"Error connecting to the database: {e}")
			return None

	# test out this
	def applyFilter(self,choice,options):
		connection_string = (
		f"DRIVER={{{self.database_config.DB_DRIVER}}};"
		f"SERVER={self.database_config.DB_SERVER};"
		f"DATABASE={self.database_config.DB_DATABASE};"
		f"UID={self.database_config.DB_USER};"
		f"PWD={self.database_config.DB_PASSWORD};"
		f"PORT={self.database_config.DB_PORT};"
		)
		if choice == "default":
			# print(self.defaultFilter())
			return self.defaultFilter()

		elif (choice == "custom" and len(options) == 0):
			return []
		else:
			classifier_dict = {}
			for option in options:
				classifier_dict[option] = self.factory.createFilter(option).filter()
			# print(classifier_dict)

			type_1, type_2, type_3 = self.classify_elements(options,classifier_dict)
			condition1 = "("+self.format_and_concatenate_with_var_name("car_park_type",type_1)+")" if (self.format_and_concatenate_with_var_name("car_park_type",type_1)) else ""
			condition2 = " AND "+ "("+self.format_and_concatenate_with_var_name("type_of_parking_system",type_2)+")" if (self.format_and_concatenate_with_var_name("type_of_parking_system",type_2)) else ""
			condition3 = " AND "+ "("+self.format_and_concatenate_with_var_name("night_parking",type_3)+")" if (self.format_and_concatenate_with_var_name("night_parking",type_3)) else ""

			# condition = f"({condition1})" + " AND " + f"({condition2})" + " AND " + f"({condition3})"
			condition = condition1+ condition2 + condition3
			query = "SELECT * FROM HDBCarParkData WHERE "+ condition + ";"
			print(query)
			conn = pyodbc.connect(connection_string)
			cursor = conn.cursor()
			cursor.execute(query)
			filtered = cursor.fetchall()
			# print(filtered)
			return filtered

	def defaultFilter(self):
		return self.data # apply all options
	
	def classify_elements(self,input_list, classifier_dict):
		type_1 = []
		type_2 = []
		type_3 = []

		for item in input_list:
				if item in classifier_dict:
						classification = classifier_dict[item]
						if classification == "car_park_type":
								type_1.append(item)
						elif classification == "type_of_parking_system":
								type_2.append(item)
						elif classification == "night_parking":
								type_3.append(item)
		return type_1, type_2, type_3

	def format_and_concatenate_with_var_name(self,var_name, input_list):
		if len(input_list) == 0:
			return ""
		elif len(input_list) == 1:
			formatted_item = f"'{input_list[0].upper()}'"
			return f"{var_name} = {formatted_item}"
		else:
			formatted_items = [f"'{item.upper()}'" for item in input_list]
			return f"{var_name} = {formatted_items[0]} OR {var_name} = " + " OR ".join(formatted_items[1:])





