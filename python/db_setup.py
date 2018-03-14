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
df_food_desert = pd.read_csv('../clean-data/cleaned_food_desert_data1_lh.csv', encoding = "ISO-8859-1")
df_county_mcds_cnt = pd.read_csv('../clean-data/county_count.csv', encoding = "ISO-8859-1")
df_county_mcds_lvl_cnt = pd.read_csv('../clean-data/county_count_mcds_lvl.csv', encoding = "ISO-8859-1")

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
	fips = Column(Float, primary_key=True)

#Obesity/Diabetes Table
class Obesity(Base):
	__tablename__ = 'obeseDiabetes'
	state = Column(String(255))
	fips = Column(Float, primary_key=True)
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
	fips = Column(Float,primary_key=True)
	censusTract = Column(Float)
	pop2010 = Column(Float)
	ohu2010 = Column(Float)
	medianFamilyIncome = Column(Float)
	lapop20 = Column(Float)
	lalowi20 = Column(Float)
	lasnap20=Column(Float)
	tractLOWI = Column(Float)
	tractSNAP = Column(Float)
	lapop20_share = Column(Float)
	lalowi20_share = Column(Float)
	lasnap20_share = Column(Float)

#Country level Mcds data
class CountyMcdsCount(Base):
	__tablename__ = 'countyMcdsCount'
	county_name = Column(String(255))
	county_fips = Column(Float,primary_key=True)
	mccount = Column(Float)

#Mcds level county data
class McdsLvlCountyData(Base):
	__tablename__ = 'mcdsLvlCountyData'
	county_fips = Column(Float,ForeignKey('population.fips'))
	county_name = Column(String(255))
	mccount = Column(Float)
	state_fips = Column(String(255))
	state_code = Column(String(255))
	state_name = Column(String(255))
	lat = Column(Float)
	lon = Column(Float)
	id = Column(Float, primary_key=True)


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
df_food_desert.to_sql('foodDesert',engine,if_exists='append',index=False)
df_county_mcds_cnt.to_sql('countyMcdsCount',engine,if_exists='append',index=False)
df_county_mcds_lvl_cnt.to_sql('mcdsLvlCountyData',engine,if_exists='append',index=False)


sql = "create table DATA_MCDS as select p.fips, p.stname,p.ctyname, p.abbrev,p.popestimate2016, o.obesity_n,o.obesity_per,o.diab_n, o.diab_per, f.pop2010, f.ohu2010, f.medianfamilyincome, f.lapop20,f.lalowi20, f.lasnap20, f.tractlowi, f.tractsnap, f.lapop20_share, f.lalowi20_share, f.lasnap20_share, m.mccount from population p left join obeseDiabetes o on p.fips = o.fips left join foodDesert f on p.fips = f.fips left join countyMcdsCount m on p.fips = m.county_fips;"
		
engine.execute(sql)
"""
create table DATA_MCDS as 
select p.fips, p.stname,p.ctyname, p.abbrev,p.popestimate2016, o.obesity_n, o.obesity_per,
	o.diab_n, o.diab_per, f.pop2010, f.ohu2010, f.medianfamilyincome, f.lapop20, f.lalowi20, f.lasnap20, 
	f.tractlowi, f.tractsnap, f.lapop20_share, f.lalowi20_share, f.lasnap20_share, m.mccount
	from population p 
		left join obeseDiabetes o on p.fips = o.fips
		left join foodDesert f on p.fips = f.fips
		left join countyMcdsCount m on p.fips = m.county_fips;

"""
















