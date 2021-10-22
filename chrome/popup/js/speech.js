var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition
var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent
var numbers = ['minutes','seconds','half'];
for (let index = 0; index < 60; index++) {
    numbers.push(index.toString());
}
var grammar = '#JSGF V1.0; grammar numbers; public <number> = ' + numbers.join(' | ') + ' ;'
var recognition = new SpeechRecognition();
var speechRecognitionList = new SpeechGrammarList();
speechRecognitionList.addFromString(grammar, 1);
recognition.grammars = speechRecognitionList;
recognition.continuous = false;
recognition.lang = 'en-US';
recognition.interimResults = false;
recognition.maxAlternatives = 1;

var microphone = document.querySelector('.microphone');
microphone.onclick = function() {
    recognition.start();
    console.log('Listening...');
}

function isNumeric(str) {
    if (typeof str != "string") return false;
    return !isNaN(str) && !isNaN(parseFloat(str));
}

recognition.onresult = function(event) {
    clearInterval(int);
    timerPause = true;
    buttonStopEle.style.display = 'none';
    buttonStartEle.style.display = 'inline-block';
    var number = event.results[0][0].transcript;
    console.log('Transcript: ' + number + '.');
    console.log('Confidence: ' + event.results[0][0].confidence);
    var stringNums = number.replaceAll('one', 1)
        .replaceAll('two', 2)
        .replaceAll('three', 3)
        .replaceAll('four', 4)
        .replaceAll('five', 5)
        .replaceAll('six', 6)
        .replaceAll('seven', 7)
        .replaceAll('eight', 8)
        .replaceAll('nine', 9)
        .replaceAll('ten', 10)
        .replaceAll('eleven', 11)
        .replaceAll('twelve', 12)
        .replaceAll('-and-a-', ' ')
        .replaceAll('1/2', 30)
        .replaceAll('half', 30);
    var numberMatches = stringNums.match(/\d+/g) || undefined;
    if (numberMatches !== undefined && numberMatches.length > 0){
        if (isNumeric(number)){
            if (numberMatches[0] > 99){
                // 1430
                var splitMatches = numberMatches[0].split('');
                console.log(splitMatches)
                if (splitMatches.length > 3){
                    var shiftMatches = splitMatches
                    setNewTime(splitMatches[0]+splitMatches[1], splitMatches[2] + splitMatches[3]);
                    console.log(splitMatches[0]+splitMatches[1], splitMatches[2] + splitMatches[3])
                } else {
                    var shiftMatches = splitMatches
                    shiftMatches = shiftMatches.shift();
                    setNewTime(shiftMatches, splitMatches[0]+splitMatches[1] || 0);
                }
            } else {
                setNewTime(numberMatches[0], numberMatches[1] || 0);
            }
        } else if (number.includes('half')){
            setNewTime(numberMatches[0], 30);
        } else if (numberMatches.length === 1){
            setNewTime(parseInt(numberMatches[0] || 1), 0);
        } else {
            setNewTime(parseInt(numberMatches[0] || 1), parseInt(numberMatches[1]) || 0);
        }
    }
    var currentPhase = timerPositive ? 'pos' : 'neg';
    var renderId = currentPhase+"-"+timeString(displayMinutes);
    setTimeout(() => {
        ioPaused = true;
        document.getElementById("marker-id-"+renderId).scrollIntoView({behavior: "smooth", block: "center", inline: "center"});
    }, 50);
    ioPaused = false;     
    // if (number.includes('start')){
    //     ioPaused = false;
    //     timerRunning = true;
    //     timerPause = false;
    //     buttonStartEle.style.display = 'none';
    //     buttonStopEle.style.display = 'inline-block';
    //     startTimer();
    // }
    if (number.includes('stop') || number.includes('pause')){
        clearInterval(int);
        ioPaused = false;
        timerPause = true;
        timerRunning = false;
        if (displayMinutes === 0 && displaySeconds === 0){ return } // already at 00:00
        buttonStopEle.style.display = 'none';
        buttonStartEle.style.display = 'inline-block';
    }
}

recognition.onspeechend = function() {
    recognition.stop();
}

recognition.onnomatch = function(event) {
    console.log("I didn't recognize a number.");
}

recognition.onerror = function(event) {
    console.log('Error occurred in recognition: ' + event.error);
}