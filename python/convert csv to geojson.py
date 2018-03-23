import csv
# Read in raw data from csv
ifile = open('mcdonaldsgeojson.csv', 'r')

rawData = csv.reader(ifile)


# the template. where data from the csv will be formatted to geojson
template = \
    ''' \
    { "type" : "Feature",
        "geometry" : {
            "type" : "Point",
            "coordinates" : [%s, %s]},
        "properties" : { "storeNumber" : %s, "address" : "%s", "city" : "%s", "state": "%s"}
        },
    '''
# the head of the geojson file
output = \
    ''' \
{ "type" : "FeatureCollection",
    "features" : [
    '''
# loop through the csv by row skipping the first
iter = 0
for row in rawData:
    iter += 1
    lat = row[0]
    lon = row[1]
    storeNumber = row[4]
    address = row[6]
    city = row[7]
    state = row[8]
    output += template % (lon, lat, storeNumber,address, city, state)
    
# the tail of the geojson file
output += \
    ''' \
    ]
}
    '''

# opens an geoJSON file to write the output to
outFileHandle = open("mcDs.geojson", "w")
outFileHandle.write(output)
outFileHandle.close()