# import necessary libraries
import numpy as np

import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func, Column, Integer, Float, String, ForeignKey
from sqlalchemy_utils import database_exists, create_database
import pandas as pd

from flask import (
    Flask,
    render_template,
    jsonify,
    request,
    redirect)

#################################################
# Flask Setup
#################################################
app = Flask(__name__)

#################################################
# Database Setup
#################################################
from flask_sqlalchemy import SQLAlchemy


app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///mcdonalds.sqlite'

db = SQLAlchemy(app)

class Population(db.Model):
	__tablename__ = 'population'
	sumlev = db.Column(db.Float)
	region = db.Column(db.Float)
	division = db.Column(db.Float)
	state = db.Column(db.String(255))
	county = db.Column(db.String(255))
	stName = db.Column(db.String(255))
	ctyName = db.Column(db.String(255))
	census2010Pop = db.Column(db.Float)
	estimatesBase2010 = db.Column(db.Float)
	popEstimate2010 = db.Column(db.Float)
	popEstimate2011 = db.Column(db.Float)
	popEstimate2012 = db.Column(db.Float)
	popEstimate2013 = db.Column(db.Float)
	popEstimate2013 = db.Column(db.Float)
	popEstimate2014 = db.Column(db.Float)
	popEstimate2015 = db.Column(db.Float)
	popEstimate2016 = db.Column(db.Float)
	Abbrev = db.Column(db.String(255))
	fips = db.Column(db.String(255), primary_key=True)

#Obesity/Diabetes Table
class Obesity(db.Model):
	__tablename__ = 'obeseDiabetes'
	state = db.Column(db.String(255))
	fips = db.Column(db.String(255), primary_key=True)
	county = db.Column(db.String(255))
	obesity_n = db.Column(db.Float)
	obesity_per = db.Column(db.Float)
	diab_n = db.Column(db.Float)
	diab_per = db.Column(db.Float)
	abbrev = db.Column(db.String(255))


#Food Desert Table
class FoodDesert(db.Model):
	__tablename__ = 'foodDesert'
	state = db.Column(db.String(255))
	county = db.Column(db.String(255))
	fips = db.Column(db.String(255),primary_key=True)
	censusTract = db.Column(db.Float)
	pop2010 = db.Column(db.Float)
	ohu2010 = db.Column(db.Float)
	medianFamilyIncome = db.Column(db.Float)
	lapop20 = db.Column(db.Float)
	lalowi20 = db.Column(db.Float)
	lasnap20= db.Column(db.Float)
	tractLoWi = db.Column(db.Float)
	tractSNAP = db.Column(db.Float)
	lapop20_share = db.Column(db.Float)
	lalowi20_share = db.Column(db.Float)
	lasnap20_share = db.Column(db.Float)

df_obese_diabetes = pd.read_csv("../clean-data/obese_diab2013.csv", encoding = "ISO-8859-1")
df_population = pd.read_csv("../clean-data/county_pop2010_2016.csv", encoding = "ISO-8859-1")
df_food_desert = pd.read_csv('../clean-data/cleaned_food_desert_data1.csv', encoding = "ISO-8859-1")

df_obese_diabetes.to_sql('obeseDiabetes',db.engine,if_exists='append', index=False)
df_population.to_sql('population',db.engine,if_exists='append',index=False)
df_food_desert.to_sql('foodDesert',db.engine,if_exists='append',index=False)
	
	
@app.before_first_request
def setup():
    # Recreate database each time for demo
    db.drop_all()
    db.create_all()


# create route that renders index.html template
@app.route("/")
def home():
    return render_template('../templates/index.html')

# Query the database and send the jsonified results
@app.route("/api/mcdonalds")
def mcdonalds():
	sql = "select p.fips, p.stName, p.ctyName, p.abbrev,  p.popestimate2016, o.obesity_n, o.obesity_per, " \
		+ "o.diab_n, o.diab_per from population p	inner join	obeseDiabetes o	on p.fips =o.fips " \
		+ "order by p.fips"
	results = db.session.execute(sql)

	fips = [result[0] for result in results]
	stName = [result[1] for result in results]
	ctyName = [result[2] for result in results]
	abbrev = [result[3] for result in results]
	population = [result[4] for result in results]
	obesity_n =[result[5] for result in results]
	obesity_per = [result[6] for result in results]
	diab_n = [result[7] for result in results]
	diab_per = [result[8] for result in results]

	mcds_dict = {
        "Fips": fips,
        "StateNm": stName,
        "CountyNm": ctyName,
		"StateAbbr": abbrev,
		"Population":population,
		"ObesityNum":obesity_n,
		"ObesityPercent":obesity_per,
		"DiabetesNum": diab_n,
		"DiabetesPercent": diab_per
	}

	return jsonify(mcds_dict)

if __name__ == "__main__":
    app.run()
