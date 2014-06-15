
var roomNames = ['hall','room-1','room-2','room-3']

var heatmaps = [];
var currentHeatmapIndex = 0;

var lastValue = -1;
var animationRunning = false;

var MARGIN_WIDTH = 10;
var MARGIN_HEIGHT = 10;
var rooms = {
    'hall': {
        x:74,
        y:278,
        width: 492,
        height: 76
    },
    'room-1': {
        x: 74,
        y: 22,
        width: 152,
        height: 246
    },
    'room-2': {
        x: 242,
        y: 22,
        width: 152,
        height: 246
    },
    'room-3': {
        x: 415,
        y: 22,
        width: 152,
        height: 246

    }
}

var peopleSnapshot = {};

function alternateHeatmap(heatmap) {
    if (heatmap == 0) {
        return 1;
    } else {
        return 0;
    }
}

function fillRoomWithPeople(roomName, noOfPeople) {
    var peopleList = [];
    peopleSnapshot[roomName] = peopleList;
    var room = rooms[roomName];
    for (var i = 0; i<noOfPeople; i++) {
        var randomXOffset = Math.floor(Math.random() * (room.width - 2 * MARGIN_WIDTH));
        var randomYOffset = Math.floor(Math.random() * (room.height - 2 * MARGIN_HEIGHT));
        var person = {
            x : room.x + randomXOffset + MARGIN_WIDTH,
            y : room.y + randomYOffset + MARGIN_HEIGHT
        };
        peopleList.push(person);
    }
}

function fillData(measurementIndex) {
    var oneMeasurement = dataSource[measurementIndex];
    for (var i=0; i<roomNames.length; i++) {
        fillRoomWithPeople(roomNames[i], oneMeasurement[roomNames[i]]);
    }
    $('#timeDiv').html(oneMeasurement.time)
}

function drawDebugPeopleOnCanvas() {
    var canvas = document.getElementById('testCanvas');
    if (canvas.getContext) {
        var ctx = canvas.getContext('2d');
        ctx.fillStyle = 'red';
        ctx.strokeStyle = 'red';
        ctx.globalAlpha = 0.8;
        for (var i=0; i<roomNames.length; i++) {
            var people = peopleSnapshot[roomNames[i]]
            for (var j=0;j<people.length;j++) {
                ctx.fillRect(people[j].x-2, people[j].y-2, 4,4);
            }
        }
    }
}

function createHeatmap(elementId) {
    var config = {
        "radius": 15,
        "element": elementId,
        "visible": true,
        "opacity": 40,
        "width" : 640,
        "height" : 400,
        "gradient": { 0.45: "rgb(0,0,255)", 0.55: "rgb(0,255,255)", 0.65: "rgb(0,255,0)", 0.95: "yellow", 1.0: "rgb(255,0,0)" }
    };
    return heatmapFactory.create(config);
}

function drawHeatmapOfPeople(heatmap) {
    for (var i=0; i<roomNames.length; i++) {
        var people = peopleSnapshot[roomNames[i]]
        for (var j=0;j<people.length;j++) {
            heatmap.store.addDataPoint(people[j].x,people[j].y);
        }
    }
}

function setupRangeInput () {
    $('input[type="range"]').rangeslider({
        polyfill: false,
        // Default CSS classes
        rangeClass: 'rangeslider',
        fillClass: 'rangeslider__fill',
        handleClass: 'rangeslider__handle',
        onInit: function() {},
        onSlide: function(position, value) {
            if (lastValue != value) {
                fillData(value);
                swapHeatmaps();
                lastValue = value;
            }
        },
        onSlideEnd: function(position, value) {}
    });
    $('#rangeDiv').css('visibility','visible');
}

function updateHeatmap(heatmap) {
    heatmap.clear();
    drawHeatmapOfPeople(heatmap);
}

function setRangeValue(value) {
    $('#rangeId').val(value).change();
}

function createMainHeatmap() {
    // two heatmaps for animations
    heatmaps[0] = createHeatmap("mainDiv");
    heatmaps[1] = createHeatmap("mainDiv");
}


function swapHeatmaps() {
    var alternateHeatmapIndex = alternateHeatmap(currentHeatmapIndex);
    updateHeatmap(heatmaps[alternateHeatmapIndex]);
    var oldHeatmap = heatmaps[currentHeatmapIndex].get("canvas");
    var newHeatmap = heatmaps[alternateHeatmapIndex].get("canvas");
    currentHeatmapIndex = alternateHeatmapIndex;
    $(oldHeatmap).fadeOut(400, function () {});
    $(newHeatmap).fadeIn(400, function() {
        if (animationRunning) {
            animate()
        }
    });
}


function animationStart() {
    if (!animationRunning) {
        animationRunning = true;
        setTimeout(animate,200);
    }
}

function animationStop() {
    if (animationRunning) {
        animationRunning = false;
    }
}

function animate() {
    var val = parseInt($("#rangeId").val())
    val += 1;
    if (val < 163) {
        setRangeValue(val);
    } else {
        animationRunning = false
    }
}