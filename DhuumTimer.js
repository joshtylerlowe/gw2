var CCOUNT = 10 * 60;//10 minutes
var chime = new Audio('upboing.mp3');
var t, count, lastText;

/*
580 9:40 Orb 1 to Arrow
570 9:30 Orb 1 going up
550 9:10 Orb 2 to Circle
540 9:00 Orb 2 going up, bombs starting
520 8:40 Orb 3 to Heart
510 8:30 Orb 3 going up
490 8:10 Orb 1 to Square
480 8:00 Orb 1 going up, Dhuum is activated
460 7:40 Orb 2 to Star
450 7:30 Orb 2 going up
430 7:10 Orb 3 to Spiral
420 7:00 Orb 3 going up
400 6:40 Orb 1 to Triangle
395 6:35 prepare for soul slam
390 6:30 Orb 1 going up
385 6:25 SOUL SLAM NOW
370 6:10 Orb 2 to Arrow
360 6:00 Orb 2 going up
340 5:40 Orb 3 to Circle
330 5:30 Orb 3 going up
315 5:15 prepare for soul slam, Orb 1 to Heart AFTER soul slam
305 5:05 SOUL SLAM NOW
300 5:00 Orb 1 going up
280 4:40 Orb 2 to Square
270 4:30 Orb 2 going up
250 4:10 Orb 3 to Star
240 4:00 Orb 3 going up
235 3:55 prepare for soul slam
225 3:45 SOUL SLAM NOW
220 3:40 Orb 1 to Spiral
210 3:30 Orb 1 going up
190 3:10 Orb 2 to Triangle
180 3:00 Orb 2 going up
160 2:40 Orb 3 to Arrow
155 2:35 prepare for soul slam
150 2:30 Orb 3 going up
145 2:25 SOUL SLAM NOW
130 2:10 Orb 1 to Circle
120 2:00 Orb 1 going up
100 1:40 Orb 2 to Heart
90  1:30 Orb 2 going up
75  1:15 prepare for soul slam, Orb 3 to Square AFTER soul slam
65  1:05 SOUL SLAM NOW
60  1:00 Orb 3 going up, 1 minute until enrage
40  0:40 Orb 1 to Star
30  0:30 Orb 1 going up, 30 seconds until enrage
10  0:10 Orb 2 to Spiral
0   0:00 Orb 2 going up, ENRAGE
*/

var displayData = [
    { time: 600, text: "" },
    { time: 580, text: "Orb 1 to Arrow" },
    { time: 570, text: "Orb 1 going up" },
    { time: 550, text: "Orb 2 to Circle" },
    { time: 540, text: "Orb 2 going up, bombs starting" },
    { time: 520, text: "Orb 3 to Heart" },
    { time: 510, text: "Orb 3 going up" },
    { time: 490, text: "Orb 1 to Square" },
    { time: 480, text: "Orb 1 going up, Dhuum is activated" },
    { time: 460, text: "Orb 2 to Star" },
    { time: 450, text: "Orb 2 going up" },
    { time: 430, text: "Orb 3 to Spiral" },
    { time: 420, text: "Orb 3 going up" },
    { time: 400, text: "Orb 1 to Triangle" },
    { time: 395, text: "prepare for soul slam" },
    { time: 390, text: "Orb 1 going up" },
    { time: 385, text: "SOUL SLAM NOW" },
    { time: 370, text: "Orb 2 to Arrow" },
    { time: 360, text: "Orb 2 going up" },
    { time: 340, text: "Orb 3 to Circle" },
    { time: 330, text: "Orb 3 going up" },
    { time: 315, text: "prepare for soul slam, Orb 1 to Heart AFTER soul slam" },
    { time: 305, text: "SOUL SLAM NOW" },
    { time: 300, text: "Orb 1 going up" },
    { time: 280, text: "Orb 2 to Square" },
    { time: 270, text: "Orb 2 going up" },
    { time: 250, text: "Orb 3 to Star" },
    { time: 240, text: "Orb 3 going up" },
    { time: 235, text: "prepare for soul slam" },
    { time: 225, text: "SOUL SLAM NOW" },
    { time: 220, text: "Orb 1 to Spiral" },
    { time: 210, text: "Orb 1 going up" },
    { time: 190, text: "Orb 2 to Triangle" },
    { time: 180, text: "Orb 2 going up" },
    { time: 160, text: "Orb 3 to Arrow" },
    { time: 155, text: "prepare for soul slam" },
    { time: 150, text: "Orb 3 going up" },
    { time: 145, text: "SOUL SLAM NOW" },
    { time: 130, text: "Orb 1 to Circle" },
    { time: 120, text: "Orb 1 going up" },
    { time: 100, text: "Orb 2 to Heart" },
    { time: 90, text: "Orb 2 going up" },
    { time: 75, text: "prepare for soul slam, Orb 3 to Square AFTER soul slam" },
    { time: 65, text: "SOUL SLAM NOW" },
    { time: 60, text: "Orb 3 going up, 1 minute until enrage" },
    { time: 40, text: "Orb 1 to Star" },
    { time: 30, text: "Orb 1 going up, 30 seconds until enrage" },
    { time: 10, text: "Orb 2 to Spiral" },
    { time: 0, text: "Orb 2 going up, ENRAGE" }
];

function cddisplay() {
    document.getElementById('timerTime').innerHTML = secondsTimeSpanToMS(count);
    document.getElementById('timerInfo').innerHTML = getDisplayText(count);
};

function countdown() {
    //hide start, show stop/reset
    $('#startButton').hide();
    $('#stopButton').show();
    $('#resetButton').show();

    // starts countdown
    cddisplay();
    if (count == 0) {
        // time is up
        cdpause();
    } else {
        count--;
        t = setTimeout("countdown()", 1000);
    }
};

function cdpause() {
    // pauses countdown
    clearTimeout(t);
    $('#stopButton').hide();
};

function cdreset() {
    // resets countdown
    $('#startButton').show();
    $('#stopButton').hide();
    $('#resetButton').hide();
    cdpause();
    count = CCOUNT;
    cddisplay();
};

var getDisplayText = function(seconds) {
    for (var i = 1; i <= displayData.length; i++) {
        if (displayData[i].time < count) {
            if (lastText != displayData[i-1].text && seconds <= displayData[1].time) {
                lastText = displayData[i-1].text;
                chime.play();
            }
            return displayData[i-1].text;
        }
    }
}
