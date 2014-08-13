from configuration import rooms, IMAGE_WIDTH, IMAGE_HEIGHT, FILL_COLOUR, room_names, MARGIN_WIDTH, MARGIN_HEIGHT, \
    MARGIN_COLOUR, OUTLINE_COLOUR, BACKGROUND_COLOUR
import os


def draw_room(draw, room_name):
    room = rooms[room_name]
    left = room['x']
    top = room['y']
    right = room['x']+room['width']+1
    bottom = room['y']+room['height']+1
    draw.rectangle([(left, top), (right, bottom)], fill=FILL_COLOUR)
    draw.line([(left, top), (right, top), (right, bottom), (left, bottom), (left, top)], fill=OUTLINE_COLOUR, width=2)

    # draw.rectangle([(room['x'] + MARGIN_WIDTH, room['y'] + MARGIN_HEIGHT),
    #               (room['x']+room['width']+1 - MARGIN_WIDTH, room['y']+room['height']+1 - MARGIN_HEIGHT)],
    #               fill=None, outline=MARGIN_COLOUR)

def generate_image():
    from PIL import Image, ImageDraw
    size = (IMAGE_WIDTH, IMAGE_HEIGHT)
    im = Image.new('RGB', size, BACKGROUND_COLOUR)
    draw = ImageDraw.Draw(im)
    for room_name in room_names[::-1]: # revert array to show better exits
        draw_room(draw, room_name)
    my_dir = os.path.dirname(os.path.realpath(__file__))
    im.save(my_dir + '/../img/generated.jpg')

generate_image()