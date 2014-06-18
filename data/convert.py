import copy
import csv
import json
import random

data_source = []

# import data


def get_list_element(index):
    if len(data_source) <= index:
        data_source.append({})
    return data_source[index]


def process_times(row):
    for index, value in enumerate(row):
        if index > 0:
            element = get_list_element(index - 1)
            element['time'] = str(value)


def process_room(row, room):
    for index, value in enumerate(row):
        if index > 0:
            element = get_list_element(index - 1)
            if value == '':
                element[room] = 0
            else:
                element[room] = int(value)


def read_file():
    with open('MCE-wifi-activity.csv', 'rt') as csvfile:
        reader = csv.reader(csvfile, delimiter=',', quotechar='"')
        for row in reader:
            if row[0] == 'HOST':
                process_times(row)
            elif row[0] == 'H':
                process_room(row,"hall")
            elif row[0] == 'S1':
                process_room(row,"room-1")
            elif row[0] == 'S2':
                process_room(row,"room-2")
            elif row[0] == 'S3':
                process_room(row,"room-3")


MARGIN_WIDTH = 10
MARGIN_HEIGHT = 10

room_names = ['hall', 'room-1', 'room-2', 'room-3']

rooms = {
    'hall': {
        "x": 74,
        "y": 288,
        "width": 492,
        "height": 76
    },
    'room-1': {
        "x": 74,
        "y": 22,
        "width": 152,
        "height": 246
    },
    'room-2': {
        "x": 242,
        "y": 22,
        "width": 152,
        "height": 246
    },
    'room-3': {
        "x": 415,
        "y": 22,
        "width": 152,
        "height": 246
    }
}

snapshots = []


def fill_room_with_people(snapshot, room_name, no_of_people, previous_snapshot):
    if previous_snapshot is not None:
        people_list = copy.copy(previous_snapshot[room_name])
    else:
        people_list = []
    room = rooms[room_name]
    if len(people_list) < no_of_people:
        for i in range(len(people_list),no_of_people):
            random_x_offset = random.randint(0, room['width'] - 2 * MARGIN_WIDTH - 1)
            random_y_offset = random.randint(0, room['height'] - 2 * MARGIN_HEIGHT - 1)
            person = {
                "x": room['x'] + random_x_offset + MARGIN_WIDTH,
                "y": room['y'] + random_y_offset + MARGIN_HEIGHT,
                "count": 1
            }
            people_list.append(person)
    elif len(people_list) > no_of_people:
        people_list = people_list[:no_of_people]
    snapshot[room_name] = people_list

last_snapshot = None


def fill_data(measurement_index):
    global last_snapshot
    snapshot = {}
    one_measurement = data_source[measurement_index]
    for room_name in room_names:
        fill_room_with_people(snapshot, room_name, one_measurement[room_name], last_snapshot)
    all_rooms = []
    for room_name in room_names:
        all_rooms = all_rooms + snapshot[room_name]
    snapshot['data_source'] = {
        "data": all_rooms
    }
    snapshot['time'] = one_measurement['time']
    last_snapshot = snapshot
    snapshots.append(snapshot)


read_file()

# Precompute random data
for i in range(len(data_source)):
    fill_data(i)
print "var dataSource=" + json.dumps(data_source, indent=None, separators=(',', ':')) + ";"
print "var snapshots=" + json.dumps(snapshots, indent=None, separators=(',', ':')) + ";"