var roomNames = ['hall', 'room-1', 'room-2', 'room-3'];
var heatmaps = [];
var currentHeatmap = 0;

var images = [];

var animationRunning = false;
var animation;
var lastAnimationTime;

var TOTAL_ANIMATION_LENGTH = 60;
var NUMBER_OF_ENTRIES = 163 * 5;

var IMAGE_WIDTH = 209;
var IMAGE_HEIGHT = 118;
var SPRITES_PER_ROW = 10;

var single_step_time = TOTAL_ANIMATION_LENGTH * 2000.0 / NUMBER_OF_ENTRIES;
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
        var room = $('#' + roomName);
        var movieHref = $('#' + roomName + "-movie-href");
        imageJquery.css("background", "black");
        room.find(".author").html("");
        room.find(".title").html("");
        movieHref.removeAttr("href");
        movieHref.removeProp("href");
        var identifier = findInSchedule(roomName, time);
        if (identifier != "") {
            room.find("room-number").show();
            var title = movies[identifier].title;
            var author = movies[identifier].name;

            var currentIndex = timeSnapshotIndex[time];
            var startIndex = movieSnapshotIndex[identifier];
            var offset = currentIndex - startIndex;
            if (debug) {
                title = "[" + offset + "]<br>" + title;
            }

            setSprite(imageJquery, identifier, offset);
            if (author != "") room.find(".author").html(author.toUpperCase() + "<br/>");
            if (title != "") room.find(".title").html(title);
            if (movies[identifier].recording != "") {
                var href = "https://www.youtube.com/watch?v=" + movies[identifier].recording + "&t=" +
                    offset + "m3s&list=PL79il-55EZPvAXReeaFE5Hfo4p_3TfpvX";
                movieHref.prop("href", href);
                movieHref.attr("href", href);
            }
        } else {
            room.find("room-number").hide();
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
    var container = $('#' + elementId).get(0);
    var config = {
        container: container,
        radius: 30,
        minOpacity: 0,
        maxOpacity: 0.7,
        blur: 0.95
    };
    return h337.create(config);
}

function drawHeatmapOfPeople(index, heatmap) {
    heatmap.setData(snapshots[index]['data_source']);
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
    var dateParts = snapshots[index].time.split(":");
    var hour = parseInt(dateParts[0]);
    var minute = parseInt(dateParts[1]);
    var dateObj = new Date(2014, 1, 11, hour, minute);
    var am_pm = hour < 12 ? "AM" : "PM";
    hour = hour <= 12 ? hour : hour - 12;
    minute = minute < 10 ? "0" + minute : minute;
    var dateToShow = hour + ":" + minute + " " + am_pm;
    $('#timeDiv').html(dateToShow);
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
        var oldHeatmap = heatmaps[currentHeatmap]._renderer._canvas;
        var newHeatmap = heatmaps[alternateHeatmapIndex]._renderer._canvas;
        currentHeatmap = alternateHeatmapIndex;
        $(oldHeatmap).hide();
        $(newHeatmap).show();
        lastValue = value;
    }
}

function animationStart() {
    if (!animationRunning) {
        if (curVal + 1 >= NUMBER_OF_ENTRIES) {
            curVal = 0;
        }
        animationRunning = true;
        animation = myRequestAnimationFrame(animate);
        lastAnimationTime = Date.now();
    }
    $(".play-pause").removeClass("icon-play").addClass('icon-pause');
}

function animationStop() {
    if (animationRunning) {
        animationRunning = false;
        myCancelAnimationFrame(animation);
    }
    $(".play-pause").removeClass("icon-pause").addClass('icon-play');
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
