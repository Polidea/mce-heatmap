from configuration import rooms, IMAGE_WIDTH, IMAGE_HEIGHT, FILL_COLOUR, room_names
import os


def draw_room(draw, room_name):
    room = rooms[room_name]
    draw.rectangle([(room['x'], room['y']),
                    (room['x']+room['width']+1, room['y']+room['height']+1)],
                   fill=FILL_COLOUR)

def generate_image():
    from PIL import Image, ImageDraw
    size = (IMAGE_WIDTH, IMAGE_HEIGHT)
    im = Image.new('RGB', size, "white")
    draw = ImageDraw.Draw(im)
    for room_name in room_names:
        draw_room(draw, room_name)
    my_dir = os.path.dirname(os.path.realpath(__file__))
    im.save(my_dir + '/../img/generated.jpg')

generate_image()