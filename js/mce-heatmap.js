var roomNames = ['hall', 'room-1', 'room-2', 'room-3'];
var heatmaps = [];
var currentHeatmap = 0;

var images = [];

var animationRunning = false;
var animation;
var lastAnimationTime;

var TOTAL_ANIMATION_LENGTH = 60;
var NUMBER_OF_ENTRIES = 163 * 5;

var IMAGE_WIDTH = 240;
var IMAGE_HEIGHT = 135;
var SPRITES_PER_ROW = 10;

var single_step_time = TOTAL_ANIMATION_LENGTH * 1000.0 / NUMBER_OF_ENTRIES;
var MAX_VALUE = 2;

var lastValue = 0;

var timeSnapshotIndex = {};
var movieSnapshotIndex = {};
var debug = false;

var curVal = 0;

var myRequestAnimationFrame =
    window.requestAnimationFrame || window.mozRequestAnimationFrame ||
        window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
var myCancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame;

function findInSchedule(roomName, time) {
    var roomSchedule = schedule[roomName];
    for (var i = 0; i < roomSchedule.length; i++) {
        var timeBlock = roomSchedule[i];
        if (time >= timeBlock.start && time <= timeBlock.end) {
            return timeBlock.identifier;
        }
    }
    return '';
}

function setSprite(imageJquery, identifier, spriteNumber) {
    var movie = movies[identifier];
    if (movie.hasSprite) {
        var maxSpriteNumber = movie.spriteFrames;
        if (spriteNumber >= maxSpriteNumber) {
            imageJquery.css("background", "black");
        } else {
            var x = (spriteNumber % SPRITES_PER_ROW) * IMAGE_WIDTH;
            var y = Math.floor(spriteNumber / SPRITES_PER_ROW) * IMAGE_HEIGHT;
            var backgroundString = 'url(snapshots/sprites/' + identifier + ".jpg) -" + x + "px -" + y + "px";
            imageJquery.css("background", backgroundString);
        }
    } else {
        imageJquery.css("background", "black");
    }
}


function fillDescriptionsAndImages(time) {
    for (var i = 0; i < roomNames.length; i++) {
        var roomName = roomNames[i];
        var imageJquery = $("#" + roomName + "-movie");
        var roomDescription = $('#' + roomName);
        var movieHref = $('#' + roomName + "-movie-href");
        imageJquery.css("background", "black");
        roomDescription.html("");
        movieHref.removeAttr("href");
        movieHref.removeProp("href");
        var identifier = findInSchedule(roomName, time);
        if (identifier != "") {
            var description = movies[identifier].title;
            if (movies[identifier].name != "") {
                description = movies[identifier].name + "<br><br>" + description;
            }
            var currentIndex = timeSnapshotIndex[time];
            var startIndex = movieSnapshotIndex[identifier];
            var offset = currentIndex - startIndex;
            if (debug) {
                description = "[" + offset + "]<br>" + description;
            }

            setSprite(imageJquery, identifier, offset);
            roomDescription.html(description);
            if (movies[identifier].hasSprite) {
                var href = "https://www.youtube.com/watch?v=" + movies[identifier].recording + "&t=" +
                    offset + "m3s&list=PL79il-55EZPvAXReeaFE5Hfo4p_3TfpvX";
                movieHref.prop("href", href);
                movieHref.attr("href", href);
            }
        }
    }
}


function prefillMaxValue() {
    for (var i = 0; i < snapshots.length; i++) {
        snapshots[i].data_source.max = MAX_VALUE;
    }
}

function indexTimingsWithSnapshotId() {
    for (var i = 0; i < snapshots.length; i++) {
        timeSnapshotIndex[snapshots[i].time] = i;
    }
}

function indexMoviesWithSnapshotId() {
    for (var room in schedule) {
        if (schedule.hasOwnProperty(room)) {
            for (var i = 0; i < schedule[room].length; i++) {
                var identifier = schedule[room][i].identifier;
                var start = schedule[room][i].start;
                movieSnapshotIndex[identifier] = timeSnapshotIndex[start];
            }
        }
    }
}

function alternateHeatmap(heatmap) {
    if (heatmap == 0) {
        return 1;
    } else {
        return 0;
    }
}

function createHeatmap(elementId) {
    var config = {
        "radius": 20,
        "element": elementId,
        "visible": true,
        "opacity": 40,
        "width": 800,
        "height": 460,
        "gradient": {
            0.45: "rgb(0,0,255)",
            0.55: "rgb(0,255,255)",
            0.65: "rgb(0,255,0)",
            0.95: "yellow",
            1.0: "rgb(255,0,0)" }
    };
    return heatmapFactory.create(config);
}

function drawHeatmapOfPeople(index, heatmap) {
    heatmap.clear();
    heatmap.store.setDataSet(snapshots[index]['data_source']);

}

function getCurrentValue() {
    return curVal;
}

function setCurrentValue(value) {
    curVal = value;
}

function setupRangeInput() {
    $('input[type="range"]').rangeslider({
        polyfill: false,
        // Default CSS classes
        rangeClass: 'rangeslider',
        fillClass: 'rangeslider__fill',
        handleClass: 'rangeslider__handle',
        onInit: function () {
            setTimeout(function () {
                setRangeValue(49);
            }, 100);
        },
        onSlide: function (position, value) {
            generateAndSwapHeatmapsIfValueChanged(value);
            setCurrentValue(value);
        },
        triggerOnValueSet: false
    });
    $('#rangeDiv').css('visibility', 'visible');
    document.onkeydown = function (e) {
        if (e.keyCode == 37) {
            setRangeValue(getCurrentValue() - 1);
        } else if (e.keyCode == 39) {
            setRangeValue(getCurrentValue() + 1);
        }
    }
}

function updateHeatmap(index, heatmap) {
    drawHeatmapOfPeople(index, heatmap);
    $('#timeDiv').html(snapshots[index].time);
    fillDescriptionsAndImages(snapshots[index].time);
}

function setRangeValue(value) {
    if (value < 0) {
        value = 0;
    } else if (value > NUMBER_OF_ENTRIES) {
        value = NUMBER_OF_ENTRIES;
    }
    setCurrentValue(value);
    $('#rangeId').val(value).change();
    generateAndSwapHeatmapsIfValueChanged(value);
}

function createMainHeatmap() {
    // two heatmaps for animations
    heatmaps[0] = createHeatmap("mainDiv");
    heatmaps[1] = createHeatmap("mainDiv");
}

function enableAnimatedButtons() {
    $('#loadingDiv').css('visibility', 'hidden');
    $('#animateButtonDiv').css('visibility', 'visible');
}

function generateAndSwapHeatmapsIfValueChanged(value) {
    var newIndex = Math.round(value);
    if (Math.round(lastValue) != newIndex) {
        var alternateHeatmapIndex = alternateHeatmap(currentHeatmap);
        updateHeatmap(newIndex, heatmaps[alternateHeatmapIndex]);
        var oldHeatmap = heatmaps[currentHeatmap].get("canvas");
        var newHeatmap = heatmaps[alternateHeatmapIndex].get("canvas");
        currentHeatmap = alternateHeatmapIndex;
        $(oldHeatmap).hide();
        $(newHeatmap).show();
        lastValue = value;
    }
}

function animationStart() {
    if (!animationRunning) {
        animationRunning = true;
        animation = myRequestAnimationFrame(animate);
        lastAnimationTime = Date.now();
    }
    $('#controlDiv').css("background", "url(img/media_player_button.png) 0px 0px");
}

function animationStop() {
    if (animationRunning) {
        animationRunning = false;
        myCancelAnimationFrame(animation);
    }
    $('#controlDiv').css("background", "url(img/media_player_button.png) -122px 0px");
}

function toggleAnimation() {
    if (animationRunning) {
        animationStop();
    } else {
        animationStart();
    }
}

function animate() {
    var newTime = Date.now();
    var time_passed = newTime - lastAnimationTime;
    lastAnimationTime = newTime;
    var steps = time_passed / single_step_time;
    var newValue = getCurrentValue() + steps;
    if (getCurrentValue() < NUMBER_OF_ENTRIES - 1) {
        setRangeValue(newValue);
        if (animationRunning) {
            myRequestAnimationFrame(animate);
        }
    } else {
        setRangeValue(NUMBER_OF_ENTRIES - 1);
        animationStop();
    }

}


function preloadSpriteImages() {
    for (var key in movies) {
        if (movies.hasOwnProperty(key)) {
            if (movies[key].hasSprite) {
                var image = new Image();
                image.src = "snapshots/sprites/" + key + '.jpg';
                images.push(image);
            }
        }
    }
}

function prepareAllData() {
    preloadSpriteImages();
    prefillMaxValue();
    indexTimingsWithSnapshotId();
    indexMoviesWithSnapshotId();
    createMainHeatmap();
    setupRangeInput();
    animationStop();
}
