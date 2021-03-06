import {Card, CardSet} from "../card.js";

$(document).ready(function() {
    var flipped = 0;
    var cur = 0;
    var progress = 0;
    var score = 0;
    var currentCardSet = Object.create(CardSet);
    var studyList = [];
    var frontColor = "#f5a742";
    var backColor = "#428af5";
    document.getElementById("nextButton").onclick = nextButton;
    document.getElementById("prevButton").onclick = prevButton;
    document.getElementById("randomize").onclick = loadRandom;
    document.getElementById("studyIncorrect").onclick = loadIncorrect;
    document.getElementById("notCorrect").onclick = notCorrect;
    document.getElementById("isCorrect").onclick = isCorrect;
    document.getElementById("reset").onclick = loadInitial;
    document.getElementById("cardArea").onclick = flipCard;

    loadInitial();

    function loadInitial() {

        var curCardJSON = JSON.parse(localStorage.getItem("currentCardSet"));
        currentCardSet.parse(curCardJSON);
        
        cur = 0;
        if (curCardJSON == null){
            $("#buttonArea").empty();
            $("#cardArea").empty();
            $("#cardArea").append('<div id="finalMessage">No Card Set Selected</div>');
            document.getElementById('setName').textContent = "Select a card set";
        }
        else{
            //alert(localStorage.getItem("currentCardSet").length);
            document.getElementById('setName').textContent = currentCardSet.id == null ? "Unnamed Set" : currentCardSet.id;
            studyList = currentCardSet.cards;
            resetScore();
            loadCurrentCard();
        }
    }


    
    function loadRandom() {
        studyList = studyList.sort(() => Math.random() - 0.5)
        cur = 0;
        resetScore();
        loadCurrentCard();
    }

    function loadIncorrect() {
        var incorrectStudyList = [];
        for (var i = 0; i < studyList.length; i++){
            if (studyList[i].getCorrect() == false){
                incorrectStudyList.push(studyList[i]);
            }
        }
        studyList = incorrectStudyList;
        cur = 0;
        resetScore();
        loadCurrentCard();
    }

    function loadCurrentCard() {
        flipped = 0;
        $("#cardArea").empty();
        $("#cardArea").append('<div id="card1" class="card">' + studyList[cur].front + '</div>');
        $("#cardArea").append('<div id="card2" class="card">' + studyList[cur].back + '</div>');
        $("#card1").css("background-color", frontColor);
        $("#card2").css("background-color", backColor);
        $("#card2").css("top", $("#card2").height());
    }

    function flipCard(){
        if (!flipped){
            $("#card1").animate({top: -$("#card1").height()}, 150);
            $("#card2").animate({top: "0px"}, 150);
        }
        else{
            $("#card1").animate({top: "0px"}, 150);
            $("#card2").animate({top: $("#card2").height()}, 150); 
        }
        flipped = !flipped;
    }

    function nextButton(){
        //alert("next");
        if (cur < studyList.length - 1) {
            cur++;
            progress = Math.max(cur, progress);
            document.getElementById('counter').textContent = 'Cards Complete: ' + progress + ' of ' + studyList.length;
            loadCurrentCard();
        } else {
            $("#cardArea").empty();
            $("#cardArea").append('<div id="finalMessage">You have finished the activity! Check your score in the top-right!</div>');
            document.getElementById('counter').textContent = 'Cards Complete: ' + studyList.length + ' of ' + studyList.length;
        }
    }
    
    function prevButton(){
        if (cur > 0) {
            cur--;
            loadCurrentCard();
        }
    }

    function getScore(){
        var tempScore = 0;
        for (var i = 0; i < studyList.length; i++){
            if (studyList[i].getCorrect()){
                tempScore++;
            }
        }
        score = tempScore;
        document.getElementById('score').textContent = ' Score: ' + score + "/" + studyList.length;
    }

    function resetScore(){
        score = 0;
        for (var i = 0; i < studyList.length; i++){
            studyList[i].setCorrect(false);
        }
        document.getElementById('score').textContent = ' Score: ' + score + "/" + studyList.length;
    }
    function isCorrect(){
        studyList[cur].setCorrect(true);
        getScore();
        nextButton();

    }

    function notCorrect(){
        studyList[cur].setCorrect(false);
        getScore();
        nextButton();
    }
});


