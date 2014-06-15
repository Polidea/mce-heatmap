import csv
import json

output = []

def get_list_element(index):
    if len(output) <= index:
        output.append({})
    return output[index]

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

read_file()

print "dataSource = " + json.dumps(output, indent=2)