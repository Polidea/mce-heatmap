var heatmaps = [];
var currentHeatmapIndex = 0;

var lastValue = -1;
var animationRunning = false;
var animation;
var lastAnimationTime;

var TOTAL_ANIMATION_LENGTH = 20;
var NUMBER_OF_ENTRIES = 163 * 5;

var single_step_time = TOTAL_ANIMATION_LENGTH * 1000.0 / NUMBER_OF_ENTRIES
var MAX_VALUE = 2;

var myRequestAnimationFrame =
            window.requestAnimationFrame || window.mozRequestAnimationFrame ||
            window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
var myCancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame;

function findInSchedule(roomName, time) {
    var roomSchedule = schedule[roomName]
    for (var i=0; i<roomSchedule.length; i++) {
        var timeBlock = roomSchedule[i];
        if (time >= timeBlock.start && time < timeBlock.end) {
            return timeBlock.identifier
        }
    }
    return ''
}

function fillDescriptions(time) {
    for(var i=0; i<roomNames.length; i++) {
        var roomName = roomNames[i];
        var description = findInSchedule(roomName, time);
        $('#' + roomName).html(description)
    }
}

function prefill_max_value(){
    for (var i=0; i<dataSource.length;i++){
        snapshots[i].data_source.max = MAX_VALUE;
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

function drawHeatmapOfPeople(index, heatmap) {
    heatmap.clear();
    heatmap.store.setDataSet(snapshots[index]['data_source'])

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
                swapHeatmaps(value);
                lastValue = value;
            }
        },
        onSlideEnd: function(position, value) {}
    });
    $('#rangeDiv').css('visibility','visible');
}

function updateHeatmap(index, heatmap) {
    drawHeatmapOfPeople(index, heatmap);
    $('#timeDiv').html(snapshots[index].time)
    fillDescriptions(snapshots[index].time)
}

function setRangeValue(value) {
    $('#rangeId').val(value).change();
}

function createMainHeatmap() {
    // two heatmaps for animations
    heatmaps[0] = createHeatmap("mainDiv");
    heatmaps[1] = createHeatmap("mainDiv");
}


function swapHeatmaps(index) {
    var alternateHeatmapIndex = alternateHeatmap(currentHeatmapIndex);
    updateHeatmap(index,heatmaps[alternateHeatmapIndex]);
    var oldHeatmap = heatmaps[currentHeatmapIndex].get("canvas");
    var newHeatmap = heatmaps[alternateHeatmapIndex].get("canvas");
    currentHeatmapIndex = alternateHeatmapIndex;
    $(oldHeatmap).stop(true, true);
    $(newHeatmap).stop(true, true);
    $(oldHeatmap).hide();
    $(newHeatmap).show();
}

function animationStart() {
    if (!animationRunning) {
        animationRunning = true;
        animation = myRequestAnimationFrame(animate)
        lastAnimationTime = Date.now()
    }
}

function animationStop() {
    if (animationRunning) {
        animationRunning = false;
        myCancelAnimationFrame(animation)
    }
}

function animate() {
    newTime = Date.now();
    time_passed = newTime - lastAnimationTime;
    lastAnimationTime = newTime;
    steps = time_passed / single_step_time;
    var val = parseInt($("#rangeId").val());
    val += steps;
    if (val < NUMBER_OF_ENTRIES) {
        setRangeValue(val);
        if (animationRunning) {
            myRequestAnimationFrame(animate);
        }
    } else {
        setRangeValue(NUMBER_OF_ENTRIES)
        animationStop()
    }
}
