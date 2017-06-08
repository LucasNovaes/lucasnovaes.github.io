var timeoutId = 0;
var timeoutClearId = 0;
var oneMin = 60000; // 60000 ms = 60 s = 1 min
var bpm = 100;
var bpb = 4;
var beatCount = 1;
var left = 1;
var isPlaying = false;

var bpmMinus = document.getElementById('bpmMinus');
var bpmPlus = document.getElementById('bpmPlus');
var bpmId = document.getElementById('bpm');
var bpbMinus = document.getElementById('bpbMinus');
var bpbPlus = document.getElementById('bpbPlus');
var bpbId = document.getElementById('bpb');
var beatIndicatorId = document.getElementById('beatIndicator');
var play = document.getElementById('play');

(function() {
    bpmPlus.addEventListener('click', function(){
        var currentValue = parseFloat(bpmId.value);
        bpmId.value = currentValue+1;
        bpm = parseFloat(bpmId.value);
    })
    bpmMinus.addEventListener('click', function(){
        var currentValue = parseFloat(bpmId.value);
        bpmId.value = currentValue-1;
        bpm = parseFloat(bpmId.value);
    })
    bpmId.addEventListener('change', function(){
        bpm = parseFloat(bpmId.value);
    })
    bpbPlus.addEventListener('click', function(){
        var currentValue = parseFloat(bpbId.value);
        bpbId.value = currentValue+1;
        bpb = parseFloat(bpbId.value);
    })
    bpbMinus.addEventListener('click', function(){
        var currentValue = parseFloat(bpbId.value);
        bpbId.value = currentValue-1;
        bpb = parseFloat(bpbId.value);
    })
    bpbId.addEventListener('change', function(){
        bpb = parseFloat(bpbId.value);
    })
    play.addEventListener('click', function() {
        if (!isPlaying) {
        	play.innerHTML = 'Stop'
	        beatCount = 1
	        beat();
	        isPlaying = true;
	    } else {
	    	play.innerHTML = 'Play'
	    	clearTimeout(timeoutId);
	        beatCount = 1
	        isPlaying = false;
	    }
    })
})();
function beat() {
    
	timeoutId = setTimeout("beat()", (oneMin / bpm));
    beatIndicatorId.style.display = "block";
    beatIndicatorId.innerHTML= ""; // Clear HTML
    beatIndicatorId.innerHTML = beatCount;

    if (beatCount == 1) {
        barBeep();
    }
    else {
        beep();
    }

    moveBeatNum();

    beatCount++;
    if (beatCount > bpb) {
        beatCount = 1;
    }
}

function beep() {
	document.getElementById('beepOne').play();
}
function barBeep() {
	document.getElementById('beepTwo').play();
}
function moveBeatNum()
{
    var bps = 1/(bpm/60);
    if (left) {
        left = 0;
    }
    else {
        left++;
    }
}