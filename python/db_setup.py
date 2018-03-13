#Import modules
import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func, Column, Integer, Float, String, ForeignKey
from sqlalchemy_utils import database_exists, create_database
import pandas as pd

df_obese_diabetes = pd.read_csv("../clean-data/obese_diab2013.csv", encoding = "ISO-8859-1")
df_population = pd.read_csv("../clean-data/county_pop2010_2016.csv", encoding = "ISO-8859-1")
#df_food_desert = pd.read_csv('../clean-data/')

# Sets an object to utilize the default declarative base in SQL Alchemy
Base = declarative_base()

#--->Will need to update these tables once final clean data created.
#Population table
class Population(Base):
	__tablename__ = 'population'
	sumlev = Column(Float)
	region = Column(Float)
	division = Column(Float)
	state = Column(String(255))
	county = Column(String(255))
	stName = Column(String(255))
	ctyName = Column(String(255))
	census2010Pop = Column(Float)
	estimatesBase2010 = Column(Float)
	popEstimate2010 = Column(Float)
	popEstimate2011 = Column(Float)
	popEstimate2012 = Column(Float)
	popEstimate2013 = Column(Float)
	popEstimate2013 = Column(Float)
	popEstimate2014 = Column(Float)
	popEstimate2015 = Column(Float)
	popEstimate2016 = Column(Float)
	Abbrev = Column(String(255))
	fips = Column(String(255), primary_key=True)

#Obesity/Diabetes Table
class Obesity(Base):
	__tablename__ = 'obeseDiabetes'
	state = Column(String(255))
	fips = Column(String(255), primary_key=True)
	county = Column(String(255))
	obesity_n = Column(Float)
	obesity_per = Column(Float)
	diab_n = Column(Float)
	diab_per = Column(Float)
	abbrev = Column(String(255))


#Food Desert Table
class FoodDesert(Base):
	__tablename__ = 'foodDesert'
	state = Column(String(255))
	county = Column(String(255))
	fips = Column(String(255),primary_key=True)
	censusTract = Column(Float)
	pop2010 = Column(Float)
	ohu2010 = Column(Float)
	medianFamilyIncome = Column(Float)
	lapop20 = Column(Float)
	lalowi20 = Column(Float)
	lasnap20=Column(Float)
	tractLoWi = Column(Float)
	tractSNAP = Column(Float)
	lapop20_share = Column(Float)
	lalowi20_share = Column(Float)
	lasnap20_share = Column(Float)


#build engine
engine = create_engine('sqlite:///mcdonalds.sqlite')
if not database_exists(engine.url):
    create_database(engine.url)
	
#Connection
conn = engine.connect()

#Create metadata
Base.metadata.create_all(engine)

#Create Session
session = Session(bind=engine)

#Append dfs to newly minted tables
df_obese_diabetes.to_sql('obeseDiabetes',engine,if_exists='append', index=False)
df_population.to_sql('population',engine,if_exists='append',index=False)
#df_food_desert.to_sql('foodDesert',engine,if_exists='append',index=False)

"""
sql = "select p.fips, p.stName, p.ctyName, p.abbrev,  p.popestimate2016, o.obesity_n, o.obesity_per, "
		+ "o.diab_n, o.diab_per INTO All_Data from population p	inner join	obeseDiabetes o	on p.fips =o.fips "
		+ "order by p.fips"
#engine.execute(sql)
"""
















