import pandas as pd
import json

class ActiveSensorsTable():
	__activeNodes = None

	def __init__(self):
		self.__activeNodes = self.create_edu_table()

	def create_edu_table(self):
		'''
		Method responsible for creating the active nodes table, initially empty, but with all the necessary fields.
        '''
		node_sensors = {"mac":[], "type":[], "id":[], "zone":[], "latitude":[], "longitude":[], "active_sensors":[], "emergencies":[]}
		return pd.DataFrame(node_sensors)

	def getTable(self):
		if(self.__activeNodes.empty):
			print("[Table Active Nodes] Table is Empty")
			return None
		else:
			return self.__activeNodes

	def addNewNode(self, edu_data):
		self.__activeNodes = pd.concat([self.__activeNodes, pd.DataFrame(edu_data)], ignore_index=True)
	
	def updateTable(self, device_mac, edu_data):
		self.deleteNode(device_mac)
		self.addNewNode(device_mac, edu_data)

	def deleteNode(self, device_mac):
   		idx = self.__activeNodes[ self.__activeNodes["mac"] == device_mac ].index
   		self.__activeNodes.drop(idx, inplace = True) # Delete the edu register
	
	def getNodesByZone(self, zone_id):
   		pass

	def getNodesBySensor(self, sensorType):
		pass

	def getNodeByType(self, eduType):
		pass
	
	def getNodeByMac(self, device_mac):
		idx = self.__activeNodes[ self.__activeNodes["mac"] == device_mac ].index.item()
		infoEDU = {
			"type": self.__activeNodes._get_value(idx, "type"),
			"id":   self.__activeNodes._get_value(idx, "id"),
			"zone": self.__activeNodes._get_value(idx, "zone"),
			"latitude": self.__activeNodes._get_value(idx, "latitude"),
			"longitude": self.__activeNodes._get_value(idx, "longitude"),
			"active_sensors": self.__activeNodes._get_value(idx, "active_sensors"),
			"emergencies": self.__activeNodes._get_value(idx, "emergencies")
		}
		return infoEDU
	
	def isActiveNode(self, device_mac):
		df = self.__activeNodes[ self.__activeNodes["mac"] == device_mac ]
		if(df.empty):
			return False
		return True