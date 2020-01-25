from flask import Flask
from flask_restful import Resource, Api, reqparse
from flask_cors import CORS
from bandwidths import BANDWIDTHS
import time
import math

app = Flask(__name__)
CORS(app)
api = Api(app)

parser = reqparse.RequestParser()
parser.add_argument('device_uuid', required=True, help="A device UUID must be provided.")
parser.add_argument('end_time', type=int)
parser.add_argument('window_time', type=int)
parser.add_argument('num_windows', type=int)

# group bandwidth data points into num_windows desired based on window_time span desired
# calculate window start and end times working backwards from last window ending on end_time
def createWindowGroups(num_windows, window_time, end_time):
    window_groups = []
    current_end_time = end_time
    for x in range(num_windows):
        start_time = current_end_time - window_time
        window_dict = {
            "start": start_time,
            "end": current_end_time,
            "bytes_fs": 0,
            "bytes_ts": 0
        }
        window_groups.append(window_dict)
        # offset 1 second for next window's end time
        current_end_time = start_time - 1
    return window_groups

def bandwidthBelongsToWindowGroup(timestamp, start_time, end_time):
    if timestamp >= start_time and timestamp <= end_time:
        return True
    else:
        return False

def aggregateWindows(device_id, window_groups, bandwidths):
    # windows = window_groups

    # loop through each bandwidth data point
    for bandwidth in bandwidths:
        # check if data point is from desired device
        # continue to next data point if not a match
        if device_id != bandwidth['device_id']:
            continue
        # does this data point belong within any of our windows (start time => end time)
        # enumerate allows us to have a counter and value to unpack
        for i, window in enumerate(window_groups):
            window_start_time = window['start']
            window_end_time = window['end']
            # if it belongs to this window modify current window dict
            if bandwidthBelongsToWindowGroup(bandwidth['timestamp'], window_start_time, window_end_time):
                window_groups[i]['bytes_fs'] = window_groups[i]['bytes_fs'] + bandwidth['bytes_fs']
                window_groups[i]['bytes_ts'] = window_groups[i]['bytes_ts'] + bandwidth['bytes_ts']
    return window_groups

class BandwidthAPI(Resource):
    def get(self):
        args = parser.parse_args()
        # device_id is a required argument and returns helpful api error message when not provided
        device_id = args['device_uuid']
        window_time = 60
        num_windows = 10
        # get current timestamp rounded up to nearest second
        end_time = int(math.ceil(time.time()))
        # replace defaults with url parameter values
        if args['window_time'] != None:
            window_time = args['window_time']
        if args['num_windows'] != None:
            num_windows = args['num_windows']
        if args['end_time'] != None:
            end_time = args['end_time']
            print('got end_time')
            print(args['end_time'])
        windows = createWindowGroups(num_windows, window_time, end_time)
        window_data = aggregateWindows(device_id, windows, BANDWIDTHS)
        return window_data

api.add_resource(BandwidthAPI, '/')

if __name__ == '__main__':
    app.run(debug=True)