import sqlalchemy
import os
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import inspect, create_engine, func, desc
from sqlalchemy.engine import reflection

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
engine = create_engine("sqlite:///python/mcdonalds.sqlite")

# Reflecting db into a new model
Base = automap_base()

# Reflect tables
Base.prepare(engine, reflect=True)

# See tables in db
#inspector = inspect(engine)
#for table in inspector.get_table_names():
#    print(table)

# Save to class
County = Base.classes.DATA_MCDS
State = Base.classes.stateLevelMc
session = Session(engine)


def __repr__(self):
    return '<McD %r>' % (self.name)

##################################################################
# Homepage
##################################################################
@app.route("/")
def home():
    return render_template("index.html")

##################################################################
# All county data
##################################################################
@app.route("/counties")
def counties():
    results = session.query(County.fips, \
                            County.ctyName, \
                            County.stName, \
                            County.Abbrev, \
                            County.obesity_per, \
                            County.diab_per, \
                            County.lapop20_share, \
                            County.lalowi20_share, \
                            County.lasnap20_share, \
                            County.mccount, \
                            County.mcd_per_cap)\
                     .order_by(County.stName)
    countydict = {"fips": [result[0] for result in results],
                "county_name": [result[1] for result in results],
                "state_name": [result[2] for result in results],
                "state_abbrev": [result[3] for result in results],
                "diabetes": [result[4] for result in results],
                "obesity": [result[5] for result in results],
                "food_des": [result[6] for result in results],  # lapop20_share
                "pov": [result[7] for result in results],  # lalowi20_share
                "snap": [result[8] for result in results],  # lasnap20_share
                "mcCount": [result[9] for result in results],
                "mcd_per_cap": [result[10] for result in results]}
    return jsonify(countydict)

##################################################################
# Data organized by county
##################################################################
@app.route("/county_info")
def county_info():
    results = session.query(County.fips, \
                            County.ctyName, \
                            County.stName, \
                            County.Abbrev, \
                            County.obesity_per, \
                            County.diab_per, \
                            County.lapop20_share, \
                            County.lalowi20_share, \
                            County.lasnap20_share, \
                            County.mccount, \
                            County.mcd_per_cap)\
                     .order_by(County.fips)\
                     .limit(10)

    num_results = results.count()

    county_info_dict = {}

    fips_list = [result[0] for result in results]
    name_list = [result[1] for result in results]
    state_list = [result[2] for result in results]
    abbrev_list = [result[3] for result in results]
    diab_list = [result[4] for result in results]


#    county_info = dict.fromkeys([str(fips) for fips in fips_list], {
#                                    "name": "test",
#                                    "state_name": "test"})

    county_info = dict.fromkeys([str(fips) for fips in fips_list], {
                                    "name": [],
                                    "state_name": []})

    # for i in range(0,num_results):


    return jsonify(county_info)
#    countydict = dict.fromkeys(, {
#                "county_name": ,
#                "state_name": ,
#                "state_abbrev": ,
#                "diabetes": ,
#                "obesity": [result[5] for result in results],
#                "food_des": [result[6] for result in results],  # lapop20_share
#                "pov": [result[7] for result in results],  # lalowi20_share
#                "snap": [result[8] for result in results],  # lasnap20_share
#                "mcCount": [result[9] for result in results],
#                "mcd_per_cap": [result[10] for result in results]})



##################################################################
# All county data
##################################################################
@app.route("/states")
def states():
    results = session.query(State.stName, \
                            State.Abbrev, \
                            State.obesity_per, \
                            State.diab_per, \
                            State.lapop20_share, \
                            State.lalowi20_share, \
                            State.lasnap20_share, \
                            State.mcCount, \
                            State.mcd_per_cap)\
                     .order_by(State.stName)
    statedict = {"state_name": [result[0] for result in results],
                "state_abbrev": [result[1] for result in results],
                "diabetes": [result[2] for result in results],
                "obesity": [result[3] for result in results],
                "food_des": [result[4] for result in results],  # lapop20_share
                "pov": [result[5] for result in results],  # lalowi20_share
                "snap": [result[6] for result in results],  # lasnap20_share
                "mcCount": [result[7] for result in results],
                "mcd_per_cap": [result[8] for result in results]}
    return jsonify(statedict)



if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port = port, debug=True)