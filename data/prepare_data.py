import copy
import csv
import json
import os
import random

from configuration import rooms, room_names, MARGIN_HEIGHT, MARGIN_WIDTH, IMAGE_HEIGHT, IMAGE_WIDTH

def get_list_element(source, index):
    if len(source) <= index:
        source.append({})
    return source[index]


def process_times(source, row):
    for index, value in enumerate(row):
        if index > 0:
            element = get_list_element(source, index - 1)
            element['time'] = str(value)


def process_room(source, row, room):
    for index, value in enumerate(row):
        if index > 0:
            element = get_list_element(source, index - 1)
            if value == '':
                element[room] = 0
            else:
                element[room] = int(value)

def read_file(source):
    with open('MCE-wifi-activity.csv', 'rt') as csvfile:
        reader = csv.reader(csvfile, delimiter=',', quotechar='"')
        for row in reader:
            if row[0] == 'HOST':
                process_times(source, row)
            elif row[0] == 'H':
                process_room(source, row,"hall")
            elif row[0] == 'S1':
                process_room(source, row,"room-1")
            elif row[0] == 'S2':
                process_room(source, row,"room-2")
            elif row[0] == 'S3':
                process_room(source, row,"room-3")
            elif row[0] == 'Total':
                process_room(source, row,"total")

def add_with_interpolations(last_element, new_element, list):
    extended_room_names = room_names[:]
    extended_room_names.append('total')
    for i in range(1, 5):
        interpolated_element = last_element.copy()
        for room_name in extended_room_names:
            if room_name in new_element:
                full_difference = new_element[room_name] - last_element[room_name]
                interpolated_difference = full_difference * i / 5
                interpolated_element[room_name] += interpolated_difference
            last_time_digit = last_element['time'][4]
        interpolated_element['time'] = last_element['time'][:4] + \
                                       chr(ord(last_time_digit) + i) + \
                                       last_element['time'][5:]
        list.append(interpolated_element)
    list.append(new_element)

def perform_interpolation(source):
    last_element = source[0]
    new_source = [last_element]
    for i in range(1, len(source)):
        new_element = source[i]
        add_with_interpolations(last_element, new_element, new_source)
        last_element = new_element
    return new_source

data_source = []
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

def calculate_exits(room_from_name, room_to_name, exit_name, source_old, source_new):
    source_adjusted = source_new.copy()
    difference = source_old[room_from_name] - source_new[room_from_name]
    from_adjustment = difference / 2
    to_adjustment = difference - from_adjustment
    source_adjusted[room_from_name] = max(0,source_new[room_from_name] - abs(from_adjustment))
    source_adjusted[room_to_name] = max(0,source_new[room_to_name] - abs(to_adjustment))
    source_adjusted[exit_name] = abs(difference)
    return source_adjusted

def adjust_total_exit(source_old, source_new):
    source_adjusted = source_new.copy()
    difference = source_old['total'] - source_new['total']
    source_adjusted['exit'] = abs(difference)
    source_adjusted['hall'] = max(0, source_new['hall'] - abs(difference))
    return source_adjusted

def adjust_data_source_with_exits(source):
    source_old = None
    for i in range(len(source)):
        source_new = source[i]
        if source_old is not None:
            source_adjusted = calculate_exits('room-1', 'hall', 'room-1-exit', source_old, source_new)
            source_adjusted = calculate_exits('room-2', 'hall', 'room-2-exit', source_old, source_adjusted)
            source_adjusted = calculate_exits('room-3', 'hall', 'room-3-exit', source_old, source_adjusted)
            source_adjusted = adjust_total_exit(source_old, source_adjusted)
            source_old = source_new
            source[i] = source_adjusted
        else:
            source_old = source_new
            source_new['exit'] = 0
            source_new['room-1-exit'] = 0
            source_new['room-2-exit'] = 0
            source_new['room-3-exit'] = 0

def fill_data(source, measurement_index):
    global last_snapshot
    snapshot = {}
    one_measurement = source[measurement_index]
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

read_file(data_source)
data_source = perform_interpolation(data_source)

def write_json_file(name, data):
    with open(name, 'wt') as outfile:
        outfile.write(json.dumps(data, indent=None))

# Precompute random data
adjust_data_source_with_exits(data_source)

for i in range(len(data_source)):
    fill_data(data_source, i)

my_dir = os.path.dirname(os.path.realpath(__file__))

write_json_file(my_dir + "/data_source.json", data_source)
write_json_file(my_dir + "/snapshots.json", snapshots)
