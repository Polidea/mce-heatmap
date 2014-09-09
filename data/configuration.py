IMAGE_WIDTH = 800
IMAGE_HEIGHT = 434

EXCLUDED_COLOUR = (255, 0, 0)
EXIT_COLOUR = (0, 0, 255)
FILL_COLOUR = (0, 0, 0)
MARGIN_COLOUR = (0, 0, 0)
OUTLINE_COLOUR = (214, 230, 35)
BACKGROUND_COLOUR = (0, 0, 0)

MARGIN_WIDTH = 19
MARGIN_HEIGHT = 19

room_names = ['hall', 'exit',
              'room-1', 'room-2', 'room-3',
              'room-1-exit', 'room-2-exit', 'room-3-exit',
]

ROOM_WIDTH = 180
ROOM_HEIGHT = 240
TOP_EDGE = 0
ROOM_SPACING = 1
ROOM_EXIT_WIDTH = 40
HALL_SPACING = 5
HALL_HEIGHT = 186

ROOM_EXIT_1_OFFSET = 140
ROOM_EXIT_2_OFFSET = 0
ROOM_EXIT_3_OFFSET = 0

EXIT_LEFT = 456
EXIT_TOP = 394
EXIT_WIDTH = 70
EXIT_HEIGHT = 40

HALL_WIDTH = ROOM_WIDTH * 3 + ROOM_SPACING * 2
LEFT_EDGE = 108

EXCLUDED_HALL_AREAS = (
    # (left, top, width, height)
    (0, TOP_EDGE + ROOM_HEIGHT + HALL_SPACING, LEFT_EDGE, 78),
    (LEFT_EDGE + 3 * ROOM_WIDTH - MARGIN_WIDTH, 244, IMAGE_WIDTH - (LEFT_EDGE + 3 * ROOM_WIDTH - MARGIN_WIDTH), 75),
    (EXIT_LEFT, IMAGE_HEIGHT - 2 * EXIT_HEIGHT, IMAGE_WIDTH - EXIT_LEFT, 2 * EXIT_HEIGHT),
)

rooms = {
    'hall': {
        "x": 0,
        "y": TOP_EDGE + ROOM_HEIGHT + HALL_SPACING,
        "width": IMAGE_WIDTH,
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
        "x": LEFT_EDGE + ROOM_WIDTH + ROOM_SPACING + ROOM_EXIT_2_OFFSET,
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
        "x": EXIT_LEFT,
        "y": EXIT_TOP,
        "width": EXIT_WIDTH,
        "height": EXIT_HEIGHT,
    }
}
