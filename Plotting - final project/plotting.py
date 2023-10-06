import plotly
import plotly.graph_objs as go
from pymongo import MongoClient

# Mongo api key
Mongo_uri = 'mongodb+srv://hhassanzada:Hassan00278@cluster0.yewruja.mongodb.net/?retryWrites=true&w=majority'
#importing from databse name
db_name = 'test'
#importing from database collections "lightings"
CollectionName= 'lightings'

# Connecting to MongoDB
clientDB = MongoClient(Mongo_uri)
db = clientDB[db_name]
DBcollection = db[CollectionName]

# Getting data from the collections
data = list(DBcollection.find({}, {'_id': 0}))

# Retrieving timestamps for x axis and state for y axis
TimeStamps = [entry['timestamp'] for entry in data]
OnOff = [entry['state'] for entry in data]

# We are creating whats called a trace for plotly
# We will make a scatter plot
trace = go.Scatter(x=TimeStamps, y=OnOff, mode='markers', name='Smart Lighting State')
#defining the layout of the scatter plot
layout = go.Layout(
    title='Lighting state over Time',
    xaxis=dict(title='Timestamp'),
    yaxis=dict(title='Light State (0 -> Off, 1 -> On)')
)

fig = go.Figure(data=[trace], layout=layout)

# here we ar eplotting the figure and then outputting to a html which is built into plotly
plotly.offline.plot(fig, filename='smart_lighting_plot.html')

# we then have to close the mongo db connection
clientDB.close()
