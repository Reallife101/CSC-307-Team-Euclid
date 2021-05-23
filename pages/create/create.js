import {Card, CardSet} from "./card.js"

// All html elements that are accessed (excluding card buttons this script creates)
var testCardSet = Object.create(CardSet);
var cardButtonList = document.getElementById("cardButtonList");
var frontTextBox = document.getElementById("frontText");
var backTextBox = document.getElementById("backText");
cardButtonList.onclick = cardButtonClicked;
document.getElementById("deleteCard").onclick = deleteCard;
document.getElementById("nextCard").onclick = nextCard;
document.getElementById("previousCard").onclick = previousCard;

// These variables define the current state of the editor
var currentCardSet = testCardSet;
var currentCard = createNewCard();
var currentIndex = 0;
var currentButton = createNewCardButton();

// Creates a new, blank card and adds it to the current card set
function createNewCard(){
    var newCard = Object.create(Card);
    currentCardSet.addCard(newCard);
    return newCard;
}

// Calls the print cards method of the current card set
function printCards(){
    currentCardSet.printCards();
}

/* Moves current state to the next card if the current card does not have a blank value
 * If the current card is the last card of the set, a new card is made
 */
function nextCard(){
    if (currentIndex < currentCardSet.cards.length - 1){
        saveCard();
        currentIndex += 1;
        loadCardToInput();
    }
    else if (frontTextBox.value != "" && backTextBox.value != ""){
        saveCard();
        currentIndex += 1;
        currentCard = createNewCard();
        currentButton = createNewCardButton();
    }
}

// Moves current state back to previous card if not on the first card
function previousCard(){
    if (currentIndex > 0){
        saveCard();
        currentIndex -= 1;
        loadCardToInput();
    }
}

// Saves the user data in input fields to current card
function saveCard(){
    currentCard.setFront(frontTextBox.value);
    currentCard.setBack(backTextBox.value);
    currentButton.innerText = currentCard.front;
}

// Loads the values of the current card to the user input fields for editing
function loadCardToInput(){
    currentCard = currentCardSet.cards[currentIndex];
    currentButton = cardButtonList.childNodes[currentIndex + 1];
    frontTextBox.value = currentCard.front;
    backTextBox.value = currentCard.back;
}

// Creates a new button to match a new card
function createNewCardButton(){
    var newButton = document.createElement("button");
    cardButtonList.append(newButton);
    newButton.id = String(currentIndex);
    frontTextBox.value = "";
    backTextBox.value = "";
    return newButton;
}

/* Called when a card button is clicked
 * Sets the current state to the values of the card that was clicked
 */
function cardButtonClicked(input){
    saveCard();
    currentIndex = parseInt(input.target.id);
    loadCardToInput();
}

// Deletes the current card from the current card set
function deleteCard(){
    currentCardSet.removeCard(currentIndex);
    currentButton.remove();
    for (var i = 0; i < cardButtonList.childNodes.length; i++){
        cardButtonList.childNodes[i].id = String(i - 1);
    }
    loadCardToInput();
}