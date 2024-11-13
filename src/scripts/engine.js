const state = {
    score: {
        playerScore: 0,
        computerScore: 0,
        scoreBox: document.getElementById('score_points'), // score box do html
    },

    cardSprites: {
        avatar: document.getElementById('card-image'),
        name: document.getElementById('card-name'),
        type: document.getElementById('card-type'),
    },

    fieldCards: {
        player: document.getElementById('player-field-card'),
        computer: document.getElementById('computer-field-card'),
    },

    playerSides: {
        player1: "player-cards",

        computer: "computer-cards",
        computerBOX: document.querySelectorAll("#computer-cards")[0],
        player1BOX: document.querySelectorAll("#player-cards")[0],
    },

    actions: {
        button: document.getElementById("next-duel"),
    },
};

const playerSides = {
    player1: "player-cards",
    computer: "computer-cards",
}


//enumerar as cartas 'enum'
const pathImagens = "./src/assets/icons/"; //caminho das imagens

const cardData = [
    {
        id: 0,
        name: "Pedra",
        type: "Pedra",
        img: `${pathImagens}pedra.png`,
        WinOf: [3, 2],
        
        LoseOf: [1, 4],
       
        
    },

    {
        id: 1,
        name: "Papel",
        type: "Papel",
        img: `${pathImagens}papel.png`,
        WinOf: [0, 4],
        
        LoseOf: [2, 3],
        
    },

    {
        id: 2,
        name: "Tesoura",
        type: "Snip-snip",
        img: `${pathImagens}tesoura.png`,
        WinOf: [1, 3],
        
        LoseOf: [4, 0],
        
    },

    {
        id: 3,
        name: "Lagarto",
        type: "Hiss",
        img: `${pathImagens}lagarto.png`,
        WinOf: [4, 1],
        
        LoseOf: [0, 2],
        
    },

    {
        id: 4,
        name: "Spock",
        type: "Vida longa",
        img: `${pathImagens}spock.png`,
        WinOf: [2, 0],
        
        LoseOf: [1, 3],
        
    }
];

//funçao para gerar um numero aleatorio
async function getRandomCardId() {
    const randomIndex = Math.floor(Math.random() * cardData.length);
    return cardData[randomIndex].id;
}

//funçao para criar a imagem da carta
async function createCardImage(IdCard, fieldSide) {
    const cardImage = document.createElement('img');
    cardImage.setAttribute("height", "100px");
    cardImage.setAttribute("src", `${pathImagens}card-back.jpg`);
    cardImage.setAttribute("data-id", IdCard);
    cardImage.classList.add("card");


    if (fieldSide === playerSides.player1) {
        cardImage.addEventListener("mouseover", () => {
            drawSelectedCard(IdCard);
        });

        cardImage.addEventListener("click", () => {
            setCardsField(cardImage.getAttribute("data-id"));
        });
    }
    return cardImage;
}

//funçao para colocar a carta no campo
async function setCardsField(cardId) {
    //remover todas as cartas do campo
    await removeAllCardsImagens();
    //colocar a carta no campo
    let computerCardId = await getRandomCardId();

    await ShowHiddenCardFieldsImagens(true);    

    await hiddenCardDetails();//code refactoring extract to method

    await drawCardsInFields(cardId, computerCardId);   

    //verificar o resultado
    let duelResults = await checkDuelResults(cardId, computerCardId);

    await updateScore();
    await drawButton(duelResults);
}

async function drawCardsInFields(cardId, computerCardId) {
    state.fieldCards.player.src = cardData[cardId].img;
    state.fieldCards.computer.src = cardData[computerCardId].img;
    
}

async function ShowHiddenCardFieldsImagens(value) {
    if (value === true) {
        state.fieldCards.player.style.display = "block";
        state.fieldCards.computer.style.display = "block";
        
    }
    if (value === false) {
        state.fieldCards.player.style.display = "none";
        state.fieldCards.computer.style.display = "none";
        
    }

}

//funçao para esconder os detalhes da carta
async function hiddenCardDetails() {
    state.cardSprites.avatar.src = "";
    state.cardSprites.name.innerText = "Selecione";
    state.cardSprites.type.innerText = "uma carta";
}



async function drawButton(text) {
    state.actions.button.innerText = text.toUpperCase();
    state.actions.button.style.display = "block";
}

async function updateScore() {
    state.score.scoreBox.innerText = `Win : ${state.score.playerScore}  |  Lose : ${state.score.computerScore}`;
}

//funçao para verificar o resultado do duelo
async function checkDuelResults(playerCardId, computerCardId) {
    let duelResults = "Draw";
    let playerCard = cardData[playerCardId];

    if (playerCard.WinOf.includes(computerCardId)) {
        duelResults = "win";

        state.score.playerScore++;
    }else if (playerCard.LoseOf.includes(computerCardId)) {
        duelResults = "lose";

        state.score.computerScore++;
    }else{
        duelResults = "draw";
    }

   

    await playAudio(duelResults);//funçao para tocar o audio

    return duelResults;

}

//funçao para remover as cartas do campo apos a escolha
async function removeAllCardsImagens() {
    let { computerBOX, player1BOX } = state.playerSides;


    let imgElements = computerBOX.querySelectorAll("img");
    imgElements.forEach((img) => img.remove());

    imgElements = player1BOX.querySelectorAll("img");
    imgElements.forEach((img) => img.remove());
}


async function drawSelectedCard(index) {
    state.cardSprites.avatar.src = cardData[index].img;
    state.cardSprites.name.innerText = cardData[index].name;
    state.cardSprites.type.innerText = "Attibute : " + cardData[index].type;
}

//funçao para pegar a imagem da carta
async function drawCards(cardNumbers, fieldSide) {
    for (let i = 0; i < cardNumbers; i++) {
        const randomIdCard = await getRandomCardId();
        const cardImage = await createCardImage(randomIdCard, fieldSide);



        document.getElementById(fieldSide).appendChild(cardImage);

    }
}

//funçao para resetar o duelo
async function resetDuel() {
    state.cardSprites.avatar.src = "";
    state.actions.button.style.display = "none";

    state.fieldCards.player.style.display = "none";
    state.fieldCards.computer.style.display = "none";

    

    init();
    
}

async function playAudio(status) {
    const audio = new Audio(`./src/assets/audios/${status}.mp3`);
    audio.volume = 0.2;

    try {
        audio.play();
    } catch { }

}

const bgm = document.getElementById('bgm');
const botaoPlay = document.getElementById('botaoPlay');

botaoPlay.addEventListener('click', () => {
    bgm.volume = 0.2;
    bgm.play();
  });



function init() {
    

    ShowHiddenCardFieldsImagens(false);    

    drawCards(5, playerSides.player1);
    drawCards(5, playerSides.computer);
    
}


init();

