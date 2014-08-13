IMAGE_WIDTH = 800
IMAGE_HEIGHT = 460

FILL_COLOUR = (0, 0, 0)
MARGIN_COLOUR = (0, 0, 0)
OUTLINE_COLOUR = (214, 230, 35)
BACKGROUND_COLOUR = (0, 0, 0)

MARGIN_WIDTH = 20
MARGIN_HEIGHT = 20

room_names = ['hall', 'exit',
              'room-1', 'room-2', 'room-3',
              'room-1-exit', 'room-2-exit', 'room-3-exit',
              ]

ROOM_WIDTH = 220
ROOM_HEIGHT = 300
TOP_EDGE = 5
ROOM_SPACING = 10
ROOM_EXIT_WIDTH = 60
HALL_SPACING = 20
HALL_HEIGHT = 90
ROOM_EXIT_1_OFFSET = 16
ROOM_EXIT_3_OFFSET = 16
EXIT_OFFSET = 16
EXIT_WIDTH = 60
EXIT_HEIGHT = 20


HALL_WIDTH = ROOM_WIDTH * 3 + ROOM_SPACING * 2
LEFT_EDGE = (IMAGE_WIDTH - HALL_WIDTH) / 2

rooms = {
    'hall': {
        "x": LEFT_EDGE,
        "y": TOP_EDGE + ROOM_HEIGHT + HALL_SPACING,
        "width": HALL_WIDTH,
        "height": HALL_HEIGHT
    },
    'room-1': {
        "x": LEFT_EDGE,
        "y": TOP_EDGE,
        "width": ROOM_WIDTH,
        "height": ROOM_HEIGHT
    },
    'room-1-exit': {
        "x": LEFT_EDGE + ROOM_EXIT_1_OFFSET,
        "y": TOP_EDGE + ROOM_HEIGHT - MARGIN_HEIGHT * 2,
        "width": ROOM_EXIT_WIDTH,
        "height": HALL_SPACING + MARGIN_HEIGHT * 4
    },
    'room-2': {
        "x": LEFT_EDGE + ROOM_WIDTH + ROOM_SPACING,
        "y": TOP_EDGE,
        "width": ROOM_WIDTH,
        "height": ROOM_HEIGHT
    },
    'room-2-exit': {
        "x": LEFT_EDGE + ROOM_WIDTH + ROOM_SPACING + ROOM_WIDTH / 2 - ROOM_EXIT_WIDTH / 2,
        "y": TOP_EDGE + ROOM_HEIGHT - MARGIN_HEIGHT * 2,
        "width": ROOM_EXIT_WIDTH,
        "height": HALL_SPACING + MARGIN_HEIGHT * 4
    },
    'room-3': {
        "x": LEFT_EDGE + 2 * ROOM_WIDTH + 2 * ROOM_SPACING,
        "y": TOP_EDGE,
        "width": ROOM_WIDTH,
        "height": ROOM_HEIGHT
    },
    'room-3-exit': {
        "x": LEFT_EDGE + 3 * ROOM_WIDTH + 2 * ROOM_SPACING - ROOM_EXIT_3_OFFSET - ROOM_EXIT_WIDTH,
        "y": TOP_EDGE + ROOM_HEIGHT - MARGIN_HEIGHT * 2,
        "width": ROOM_EXIT_WIDTH,
        "height": HALL_SPACING + MARGIN_HEIGHT * 4
    },
    'exit': {
        "x": LEFT_EDGE + 3 * ROOM_WIDTH + 2 * ROOM_SPACING - EXIT_OFFSET - EXIT_WIDTH,
        "y": TOP_EDGE + ROOM_HEIGHT + HALL_SPACING + HALL_HEIGHT - MARGIN_HEIGHT,
        "width": EXIT_WIDTH,
        "height": EXIT_HEIGHT + MARGIN_HEIGHT * 2
    }
}
