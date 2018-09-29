function MemoryGame() {
  this.cards = [];
  this.moves;
  this.matchCount;
  this.threeStarLimit = 8;
  this.twoStarLimit = 12;
  this.starLimit = 0;
  this.lastSelectedCard;
  this.timeoutCounter;
  this.container = document.querySelector(".deck");
  this.movesElement = document.querySelector(".moves");
  this.starsContainer = document.querySelector(".stars");
  this.starElement = this.starsContainer.children[0];
  this.starElements = `<li><i class="fa fa-star"></i></li>
        		<li><i class="fa fa-star"></i></li>
        		<li><i class="fa fa-star"></i></li>`;
  this.preventClick = false;
  this.modal = document.querySelector("#cong-modal");
  this.modalbackDrop = document.querySelector("#backdrop");
  this.totalSeconds;
  this.intervalHandler;
  this.timerElement = document.querySelector("#timer");
  this.modalBody = document.querySelector(".modal-body");

  this.cardClickHandler = event => {
    if (event.target.tagName === "LI") {
      this.flipCard(event.target);
    }
  };

  this.restartButtonHandler = event => {
    this.totalSeconds = 180;
      this.timerElement.textContent = this.totalSeconds + ' second(s) remaining';
    clearInterval(this.intervalHandler);

    this.intervalHandler = setInterval(() => {
      this.totalSeconds--;
      this.timerElement.textContent = this.totalSeconds + ' second(s) remaining';
      if (this.totalSeconds === 0) {
        if (this.matchCount < 8) {
          this.finished(`Oops!! Time Up !!`);
        }
      }
    }, 1000);

    this.container.removeEventListener("click", this.cardClickHandler);

    this.modal.style.display = "none";
    this.modalbackDrop.style.display = "none";
    this.starsContainer.innerHTML = this.starElements;
    this.starLimit = this.threeStarLimit;
    const moves = 0;
    this.moves = moves;
    this.updateMoves(moves);
    this.matchCount = 0;
    this.lastSelectedCard = { data: {} };
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
    if (count > this.starLimit && this.starsContainer.children.length > 1) {
      this.starsContainer.children[0].remove();
      this.starLimit = this.twoStarLimit;
    }
    this.movesElement.textContent = count;
  };

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

  this.hide = (element1, element2) => {
    this.preventClick = true;
    this.timeoutCounter = setTimeout(() => {
      element1.setAttribute("class", "card");
      element2.setAttribute("class", "card");
      this.preventClick = false;
    }, 500);
  };

  this.finished = text => {
    this.modalBody.innerHTML = `<h1>${text}</h1>`;
    this.modal.style.display = "block";
    this.modalbackDrop.style.display = "block";
    this.container.removeEventListener("click", this.cardClickHandler);
    clearInterval(this.intervalHandler);
  };

  this.flipCard = element => {
    if (element.className !== "card" || this.preventClick) {
      return;
    }

    if (
      this.lastSelectedCard.data.index !== element.data.index ||
      (this.lastSelectedCard.data.match != true && element.data.match !== true)
    ) {
      element.setAttribute("class", "card open show");
      element.data.open = true;

      if (this.lastSelectedCard.data.type) {
        if (element.data.type === this.lastSelectedCard.data.type) {
          element.setAttribute("class", "card match");
          this.lastSelectedCard.setAttribute("class", "card match");
          element.data.match = true;
          this.lastSelectedCard.match = true;
          this.matchCount++;
          if (this.matchCount === 8) {
            this.finished(`You made it !!!!`);
          }
        } else {
          clearTimeout(this.timeoutCounter);
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
