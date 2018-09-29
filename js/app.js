function MemoryGame() {
  this.cards = [];
  this.moves;
  this.matchCount;
  this.starLimit = 0;
  this.lastSelectedCard;
  this.timeoutCounter;
  this.container = document.querySelector(".deck");
  this.movesElement = document.querySelector(".moves");
  this.starsContainer = document.querySelector(".stars");
  this.starElement = document.querySelector('.stars > li');
  this.preventClick = false;
  this.modal = document.querySelector("#cong-modal");
  this.modalbackDrop = document.querySelector("#backdrop");
  this.totalSeconds;
  this.intervalHandler;
  this.timerElement = document.querySelector("#timer");
  this.modalBody = document.querySelector(".modal-body");
  this.timeLimit = 30;

  this.cardClickHandler = event => {
    if (event.target.tagName === "LI") {
      this.flipCard(event.target);
    }
  };

  this.addStar = () => {
    let li = document.createElement('li');
    let i = document.createElement("i");
    i.className = "fa fa-star";
    li.appendChild(i);
    this.starsContainer.appendChild(li);
  }

  //When any of the restart button is clicked, we're initializing all values to default.
  this.restartButtonHandler = event => {
    this.totalSeconds = this.timeLimit;
    this.timerElement.textContent = this.totalSeconds + " second(s) remaining";
    
    //Making sure existing timer is cleared before setting a new one.
    clearInterval(this.intervalHandler);
    this.intervalHandler = setInterval(() => {
      this.totalSeconds--;
      this.timerElement.textContent =
        this.totalSeconds + " second(s) remaining";
      if (this.totalSeconds === 0) {
        if (this.matchCount < 8) {
          this.finished(`Oops!! Time Up !!`, false);
        }
      }
    }, 1000);

    //As the cards will be removed, we're clearning any existing event handlers registered.
    this.container.removeEventListener("click", this.cardClickHandler);

    this.modal.style.display = "none";
    this.modalbackDrop.style.display = "none";
    this.starsContainer.innerHTML = '';
    this.addStar();
    this.starLimit = this.threeStarLimit;
    const moves = 0;
    this.moves = moves;
    this.updateMoves(moves);
    this.matchCount = 0;
    this.lastSelectedCard = { data: {} };

    //After shuffling the data, we're returning object so we can add extra properties to it
    //Instead of using the type of card and relying on the DOM
    this.cards = shuffle([
      "diamond",
      "paper-plane-o",
      "anchor",
      "cube",
      "leaf",
      "bicycle",
      "bomb",
      "bolt",
      "diamond",
      "paper-plane-o",
      "anchor",
      "cube",
      "leaf",
      "bicycle",
      "bomb",
      "bolt"
    ]).map(value => {
      return {
        open: false,
        icon: value
      };
    });

    this.render();
  };

  this.updateMoves = count => {
    this.movesElement.textContent = count;
  };

   //Hides Modal fade and modal pop-up during initialization and aatach event lsiteners.
  this.init = () => {
    this.restartButtonHandler();
    document.getElementById("modal-close").addEventListener("click", event => {
      this.modal.style.display = "none";
      this.modalbackDrop.style.display = "none";
    });
    const restartButtons = document.querySelectorAll(".restart");
    restartButtons[0].addEventListener("click", this.restartButtonHandler);
    restartButtons[1].addEventListener("click", this.restartButtonHandler);
  };

  //Create list of cards and put it inside the cards container and add event listener to it
  this.render = () => {
    this.container.innerHTML = "";
    let docFrag = document.createDocumentFragment();
    let count = 1;

    for (let card of this.cards) {
      let li = document.createElement("li");
      li.setAttribute("class", "card");
      li.data = {};
      li.data.index = count;
      li.data.type = card.icon;
      li.data.open = false;
      li.data.match = false;
      let itag = document.createElement("i");
      itag.setAttribute("class", `fa fa-${card.icon}`);
      li.appendChild(itag);
      docFrag.appendChild(li);
      count++;
    }

    this.container.appendChild(docFrag);
    this.container.addEventListener("click", this.cardClickHandler);
  };

  /**
  * @description 
  * Hide both cards that are currently being shown and release the click lock
  * only after the visible cards are flipped.              
  * @param {object} element1 - Current Selected Card
  * @param {object} element2 - Last Selected Card 
  */
  this.hide = (element1, element2) => {
    this.preventClick = true;
    clearTimeout(this.timeoutCounter);
    this.timeoutCounter = setTimeout(() => {
      element1.setAttribute("class", "card");
      element2.setAttribute("class", "card");
      this.preventClick = false;
    }, 500);
  };

  this.finished = (text, madeit) => {
    let color = madeit ? "green" : "red";
    let tempHtml = `<h1 style="color:${color}">${text}</h1>
                    <hr>
                    <h3>Time taken: ${this.timeLimit - this.totalSeconds} second(s)
                    <h3>Total Moves: ${this.moves}</h3>
                    <h3>Successful Match: ${this.matchCount}
                    <h3>Your Rating</h3>
                    <ul class="popup-stars">
                    ${this.starsContainer.innerHTML}
                  </ul>`;
    
    this.modalBody.innerHTML = tempHtml;
    this.modal.style.display = "block";
    this.modalbackDrop.style.display = "block";
    this.container.removeEventListener("click", this.cardClickHandler);
    clearInterval(this.intervalHandler);
  };

  this.flipCard = element => {
    if (element.className !== "card" || this.preventClick) {
      return;
    }

    //Check if user has selected the same card twice
    //Also check if user selected a card that was already matched
    if (
      this.lastSelectedCard.data.index !== element.data.index ||
      (this.lastSelectedCard.data.match != true && element.data.match !== true)
    ) {

      //If not flip the current card open.
      element.setAttribute("class", "card open show");
      element.data.open = true;

      //If there's a card opened already than the current one
      if (this.lastSelectedCard.data.type) {

        //Check if both of them matches or not
        if (element.data.type === this.lastSelectedCard.data.type) {
          element.setAttribute("class", "card match");
          this.lastSelectedCard.setAttribute("class", "card match");
          element.data.match = true;
          this.lastSelectedCard.match = true;
          this.matchCount++;
          if (this.matchCount === 4 || this.matchCount === 8) {
            this.addStar();
          }
          //Check if all the cards has been matched or not.
          if (this.matchCount === 8) {
            this.finished(`You made it !!!!`, true);
          }
        } else {
          //Updated values as false but flip the card only after a certain time
          this.hide(element, this.lastSelectedCard);
          element.data.open = false;
          this.lastSelectedCard.data.open = false;
        }
        this.moves++;
        this.updateMoves(this.moves);
        this.lastSelectedCard = { data: {} };
      } else {
        this.lastSelectedCard = element;
      }
    }
  };

  this.init();
}

new MemoryGame();

/*
 * Create a list that holds all of your cards
 */

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
  var currentIndex = array.length,
    temporaryValue,
    randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}
