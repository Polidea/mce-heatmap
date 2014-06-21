from configuration import rooms, IMAGE_WIDTH, IMAGE_HEIGHT, FILL_COLOUR, room_names, MARGIN_WIDTH, MARGIN_HEIGHT, \
    MARGIN_COLOUR
import os


def draw_room(draw, room_name):
    room = rooms[room_name]
    draw.rectangle([(room['x'], room['y']),
                    (room['x']+room['width']+1, room['y']+room['height']+1)],
                   fill=FILL_COLOUR, outline='black')
    draw.rectangle([(room['x'] + MARGIN_WIDTH, room['y'] + MARGIN_HEIGHT),
                    (room['x']+room['width']+1 - MARGIN_WIDTH, room['y']+room['height']+1 - MARGIN_HEIGHT)],
                   fill=None, outline=MARGIN_COLOUR)

def generate_image():
    from PIL import Image, ImageDraw
    size = (IMAGE_WIDTH, IMAGE_HEIGHT)
    im = Image.new('RGB', size, "white")
    draw = ImageDraw.Draw(im)
    for room_name in room_names[::-1]: # revert array to show better exits
        draw_room(draw, room_name)
    my_dir = os.path.dirname(os.path.realpath(__file__))
    im.save(my_dir + '/../img/generated.jpg')

generate_image()