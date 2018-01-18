var CCOUNT = 10 * 60;//10 minutes
var singlebeep = new Audio('beepdouble.mp3');
var upboing = new Audio('upboing.mp3');
var chordbeep = new Audio('chordbeep.mp3');
var goingdownzip = new Audio('goingdownzip.mp3');
var maleUKVoice = 'UK English Male';
var maleUSVoice = 'US English Male';
var femaleUKVoice = 'UK English Female';
var femaleUSVoice = 'US English Female';
var t, count, lastText, orb1Val, orb2Val, orb3Val, voiceSelectionOrbs, voiceSelectionOther;
var orb1 = orb2 = orb3 = orbwarning = orbup = sswarning = ssup = both = voice = chime = nosound = false;

$(document).ready(function () {
    $('#startButton').show();
    $('#stopButton').hide();
    $('#resetButton').hide();
});

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
    { time: 600, type: "", text: "" },
    { time: 580, type: "orbwarning,orb1", text: "{1} to Arrow" },
    { time: 570, type: "orbup,orb1", text: "{1} going up" },
    { time: 550, type: "orbwarning,orb2", text: "{2} to Circle" },
    { time: 540, type: "orbup,orb2", text: "{2} going up, bombs starting" },
    { time: 520, type: "orbwarning,orb3", text: "{3} to Heart" },
    { time: 510, type: "orbup,orb3", text: "{3} going up" },
    { time: 490, type: "orbwarning,orb1", text: "{1} to Square" },
    { time: 480, type: "orbup,orb1", text: "{1} going up, Boss is activated" },
    { time: 460, type: "orbwarning,orb2", text: "{2} to Star" },
    { time: 450, type: "orbup,orb2", text: "{2} going up" },
    { time: 430, type: "orbwarning,orb3", text: "{3} to Spiral" },
    { time: 420, type: "orbup,orb3", text: "{3} going up" },
    { time: 400, type: "orbwarning,orb1", text: "{1} to Triangle" },
    { time: 395, type: "sswarning", text: "prepare for soul slam" },
    { time: 390, type: "orbup,orb1", text: "{1} going up" },
    { time: 385, type: "ssup", text: "soul slam! now" },
    { time: 370, type: "orbwarning,orb2", text: "{2} to Arrow" },
    { time: 360, type: "orbup,orb2", text: "{2} going up" },
    { time: 340, type: "orbwarning,orb3", text: "{3} to Circle" },
    { time: 330, type: "orbup,orb3", text: "{3} going up" },
    { time: 315, type: "sswarning,orbwarning,orb1", text: "prepare for soul slam, {1} to Heart AFTER soul slam" },
    { time: 305, type: "ssup", text: "soul slam! now" },
    { time: 300, type: "orbup,orb1", text: "{1} going up" },
    { time: 280, type: "orbwarning,orb2", text: "{2} to Square" },
    { time: 270, type: "orbup,orb2", text: "{2} going up" },
    { time: 250, type: "orbwarning,orb3", text: "{3} to Star" },
    { time: 240, type: "orbup,orb3", text: "{3} going up" },
    { time: 235, type: "sswarning", text: "prepare for soul slam" },
    { time: 225, type: "ssup", text: "soul slam! now" },
    { time: 220, type: "orbwarning,orb1", text: "{1} to Spiral" },
    { time: 210, type: "orbup,orb1", text: "{1} going up" },
    { time: 190, type: "orbwarning,orb2", text: "{2} to Triangle" },
    { time: 180, type: "orbup,orb2", text: "{2} going up" },
    { time: 160, type: "orbwarning,orb3", text: "{3} to Arrow" },
    { time: 155, type: "sswarning", text: "prepare for soul slam" },
    { time: 150, type: "orbup,orb3", text: "{3} going up" },
    { time: 145, type: "ssup", text: "soul slam! now" },
    { time: 130, type: "orbwarning,orb1", text: "{1} to Circle" },
    { time: 120, type: "orbup,orb1", text: "{1} going up" },
    { time: 100, type: "orbwarning,orb2", text: "{2} to Heart" },
    { time: 90, type: "orbup,orb2", text: "{2} going up" },
    { time: 75, type: "sswarning,orbwarning,orb3", text: "prepare for soul slam, {3} to Square AFTER soul slam" },
    { time: 65, type: "ssup", text: "soul slam! now" },
    { time: 60, type: "orbup,orb3", text: "{3} going up, 1 minute until enrage" },
    { time: 40, type: "orbwarning,orb1", text: "{1} to Star" },
    { time: 30, type: "orbup,orb1", text: "{1} going up, 30 seconds until enrage" },
    { time: 10, type: "orbwarning,orb2", text: "{2} to Spiral" },
    { time: 0, type: "orbup,orb2", text: "{2} going up, you are in enrage" }
];

function cddisplay(reset) {
    if (reset) {
        document.getElementById('timerTime').innerHTML = '';
        document.getElementById('timerInfo').innerHTML = '';
    } else {
        document.getElementById('timerTime').innerHTML = secondsTimeSpanToMS(count);
        document.getElementById('timerInfo').innerHTML = getDisplayText(count);
    }
};

function countdown() {
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
    $('#timerOptions').show();
    $('#startButton').show();
    $('#stopButton').hide();
    $('#resetButton').hide();
    cdpause();
    count = CCOUNT;
    cddisplay(true);
};

function cdstart() {
    //hide start, show stop/reset
    $('#timerOptions').hide();
    $('#startButton').hide();
    $('#stopButton').show();
    $('#resetButton').show();

    orb1Val = $('#orb1text').val().length > 0 ? $('#orb1text').val() : "";
    orb2Val = $('#orb2text').val().length > 0 ? $('#orb2text').val() : "";
    orb3Val = $('#orb3text').val().length > 0 ? $('#orb3text').val() : "";
    orb1 = $('#orb1').is(':checked');
    orb2 = $('#orb2').is(':checked');
    orb3 = $('#orb3').is(':checked');
    orbwarning = $('#orbwarning').is(':checked');
    orbup = $('#orbup').is(':checked');
    sswarning = $('#sswarning').is(':checked');
    ssup = $('#ssup').is(':checked');
    
    both = document.querySelector('input[name="soundOption"]:checked').value == 'both';
    voice = document.querySelector('input[name="soundOption"]:checked').value == 'voice';
    chime = document.querySelector('input[name="soundOption"]:checked').value == 'chime';
    nosound = document.querySelector('input[name="soundOption"]:checked').value == 'nosound';

    delay = document.querySelector('input[name="delayOption"]:checked').value == 'delay';

    voiceSelectionOrbs = document.querySelector('input[name="voiceOption"]:checked').value == 'male' ? maleUSVoice : femaleUKVoice;
    voiceSelectionOther = document.querySelector('input[name="voiceOption"]:checked').value == 'male' ? maleUKVoice : femaleUSVoice;

    clearTimeout(t);
    count = delay ? CCOUNT + 10 : CCOUNT;
    cddisplay();
    countdown();
}

var getDisplayText = function (seconds) {
    if (seconds >= 600 && delay) {

        if (seconds == 605) {
            responsiveVoice.speak("fight starting", voiceSelectionOther);
            return "fight starting";
        } else if (seconds == 603) {
            responsiveVoice.speak("3", voiceSelectionOther);
            return "3";
        } else if (seconds == 602) {
            responsiveVoice.speak("2", voiceSelectionOther);
            return "2";
        } else if (seconds == 601) {
            responsiveVoice.speak("1", voiceSelectionOther);
            return "1";
        } else if (seconds == 600) {
            responsiveVoice.speak("Go!", voiceSelectionOther);
            return "Go!";
        }
    } else {

        for (var i = 0; i < displayData.length; i++) {
            if (displayData[i + 1] && displayData[i + 1].time < count) {
                var orb1check = orb1 && displayData[i].type.indexOf('orb1') >= 0;
                var orb2check = orb2 && displayData[i].type.indexOf('orb2') >= 0;
                var orb3check = orb3 && displayData[i].type.indexOf('orb3') >= 0;
                //var orbWarningCheck = (orb1check || orb2check || orb3check) && orbwarning && displayData[i - 1].type.indexOf('orbwarning') >= 0;
                //var orbUpCheck = (orb1check || orb2check || orb3check) && orbup && displayData[i - 1].type.indexOf('orbup') >= 0;
                //var ssWarningCheck = sswarning && displayData[i-1].type.indexOf('sswarning') >= 0;
                //var ssUpCheck = ssup && displayData[i-1].type.indexOf('ssup') >= 0;
                var ssCheck = ssup && (displayData[i].type.indexOf('sswarning') >= 0 || displayData[i].type.indexOf('ssup') >= 0);

                if (orb1check || orb2check || orb3check /*|| orbWarningCheck || orbUpCheck || ssWarningCheck || ssUpCheck*/ || ssCheck) {
                    if (lastText != displayData[i].text && seconds <= displayData[1].time) {
                        lastText = displayData[i].text;

                        if (voice || both) {
                            if (orb1check || orb2check || orb3check) {
                                if (both) {
                                    singlebeep.play();
                                }
                                responsiveVoice.speak(lastText.replace('{1}', orb1Val).replace('{2}', orb2Val).replace('{3}', orb3Val), voiceSelectionOrbs);
                            } else {
                                if (both) {
                                    singlebeep.play();
                                }
                                responsiveVoice.speak(lastText, voiceSelectionOther);
                            }
                        } else if (chime) {
                            if (orb1check || orb2check || orb3check) {
                                singlebeep.play();
                            } else {
                                goingdownzip.play();
                            }

                        } else {
                            //nothing
                        }
                    }
                    return displayData[i].text.replace('{1}', orb1Val).replace('{2}', orb2Val).replace('{3}', orb3Val);
                } else {
                    return "";
                }
            }
        }
    }

    return "";
}
