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

# Homepage
@app.route("/")
def home():
    return render_template("index.html")

##Create a route that renders a list of the sample names
#@app.route("/names")
#def names_list():
#    # Create inspector and connect it to the engine
#    inspector = inspect(engine)
#    # Collect the names of the tables within the db
#    # tables = inspector.get_table_names()
#    # using the inspector to print the column names of tables
#    columns = inspector.get_columns('samples')
#    names = []
#    for column in columns[1:]:
#        names.append(column['name'])
#    return jsonify(names)
#
## OTU
#@app.route("/otu")
#def description():
#    results = session.query(Otu.lowest_taxonomic_unit_found).all()
#    otu_results = []
#    for result in results:
#        otu_results.append(result[0])
#    return jsonify(otu_results)

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port = port, debug=True)