IMAGE_WIDTH = 640
IMAGE_HEIGHT = 400

FILL_COLOUR = (214, 214, 214)

MARGIN_WIDTH = 10
MARGIN_HEIGHT = 10

room_names = ['hall', 'exit',
              'room-1', 'room-2', 'room-3',
              'room-1-exit', 'room-2-exit', 'room-3-exit',
              ]

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
    'room-1-exit': {
        "x": 90,
        "y": 268 - MARGIN_HEIGHT * 2,
        "width": 40,
        "height": 20 + MARGIN_HEIGHT * 4
    },
    'room-2': {
        "x": 242,
        "y": 22,
        "width": 152,
        "height": 246
    },
    'room-2-exit': {
        "x": 300,
        "y": 268 - MARGIN_HEIGHT * 2,
        "width": 40,
        "height": 20 + MARGIN_HEIGHT * 4
    },
    'room-3': {
        "x": 414,
        "y": 22,
        "width": 152,
        "height": 246
    },
    'room-3-exit': {
        "x": 514,
        "y": 268 - MARGIN_HEIGHT * 2,
        "width": 40,
        "height": 20 + MARGIN_HEIGHT * 4
    },
    'exit': {
        "x": 566 - MARGIN_WIDTH * 2,
        "y": 312,
        "width": 20 + MARGIN_WIDTH * 4,
        "height": 40
    }
}
