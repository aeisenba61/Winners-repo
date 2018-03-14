# Dependencies
import requests as req
import pandas as pd
import json

df = pd.read_csv("mcdonaldsgeojson.csv")

base_url = "https://geo.fcc.gov/api/census/area?"

newData = []
number = 0
for index, row in df.iterrows():
	queryurl = base_url + "lat=" + str(row.latitude) + "&lon=" + str(row.longitude) + "&format=json"
	newQuery = req.get(queryurl)
	newData.append(newQuery.json())
	number += 1
	print(number)

with open('countyNames.json', 'w') as f:
  json.dump(newData, f)

