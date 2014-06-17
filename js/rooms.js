var heatmaps = [];
var currentHeatmapIndex = 0;

var lastValue = -1;
var animationRunning = false;

var ANIMATION_DELAY = 100;

var MAX_VALUE = 2;

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
    $(oldHeatmap).fadeOut(ANIMATION_DELAY, function () {});
    $(newHeatmap).fadeIn(ANIMATION_DELAY, function() {
        if (animationRunning) {
            animate()
        }
    });
}

function animationStart() {
    if (!animationRunning) {
        animationRunning = true;
        animate();
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
        animationStop()
    }
}


prefill_max_value();