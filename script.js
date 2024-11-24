const cards = [];
const questions = [
    {
        question: "O que é a biodiversidade?",
        alternatives: ["Variedade de espécies e ecossistemas presentes na Terra", "A quantidade de plantas e animais em uma região específica", "Apenas a diversidade de plantas em uma floresta tropical"],
        correct: 0,
    },
    {
        question: "Qual é o maior bioma do mundo em termos de biodiversidade?",
        alternatives: ["Floresta Amazônica", "Recifes de corais", "Oceanos"],
        correct: 0,
    },
    {
        question: "Qual destes animais é considerado uma espécie em extinção?",
        alternatives: ["Panda gigante", "Cervo", "Golfinho"],
        correct: 0,
    },
    {
        question: "Qual é o principal fator que ameaça a biodiversidade no mundo?",
        alternatives: ["Desmatamento", "Turismo sustentável", "Agricultura orgânica"],
        correct: 0,
    },
    {
        question: "Onde se encontra o maior número de espécies endêmicas no planeta?",
        alternatives: ["Madagascar", "África Central", "Europa"],
        correct: 0,
    },
    {
        question: "A perda de biodiversidade afeta diretamente o que?",
        alternatives: ["A saúde humana", "O clima global", "O aumento de população animal"],
        correct: 0,
    },
    {
        question: "O que significa 'espécie endêmica'?",
        alternatives: ["Espécie que só existe em uma área geográfica específica", "Espécie que se adapta rapidamente ao clima", "Espécie que vive em várias regiões do mundo"],
        correct: 0,
    },
    {
        question: "O que é um ecossistema?",
        alternatives: ["Conjunto de organismos e seu ambiente interagindo como um sistema", "A quantidade de plantas em uma área", "Apenas o conjunto de animais em uma região"],
        correct: 0,
    },
    {
        question: "O que é a ação de 'conservação da biodiversidade'?",
        alternatives: ["Atividades que buscam proteger e manter os ecossistemas e as espécies ameaçadas", "Plantio de árvores em áreas urbanas", "Adoção de animais em extinção em zoológicos"],
        correct: 0,
    },
    {
        question: "Qual bioma é conhecido por ser o maior sequestrador de carbono no planeta?",
        alternatives: ["Floresta Amazônica", "Desertos", "Campos de pastagem"],
        correct: 0,
    }
];

let score = 0;
let availableCards = []; // Array para armazenar os índices das cartas disponíveis
let discardedCards = []; // Array para armazenar as cartas que já foram viradas

// Função para embaralhar as alternativas de uma pergunta
function shuffleAlternatives(question) {
    let alternativesWithIndex = question.alternatives.map((alt, index) => ({
        text: alt,
        index: index
    }));

    alternativesWithIndex = alternativesWithIndex.sort(() => Math.random() - 0.5);

    question.alternatives = alternativesWithIndex.map(item => item.text);
    question.correct = alternativesWithIndex.find(item => item.index === question.correct).index;

    return question;
}

// Criar cartas
function createCards() {
    const cardArea = document.getElementById("card-area");
    for (let i = 0; i < 10; i++) {
        const card = document.createElement("div");
        card.classList.add("card");
        card.innerHTML = `
            <div class="card-inner">
                <div class="card-front">Carta ${i + 1}</div>
                <div class="card-back"></div>
            </div>
        `;
        card.dataset.index = i;
        cardArea.appendChild(card);
        cards.push(card);
        availableCards.push(i); // Inicializa todas as cartas como disponíveis
    }
}

// Começar o jogo - Iniciar a animação
function startGame() {
    if (availableCards.length === 0) {
        alert("Todas as cartas foram viradas!");
        return;
    }
    const currentCard = selectRandomCard(); // Seleciona uma carta aleatória não descartada
    const card = cards[currentCard];
    flipCard(card, currentCard); // Inicia a animação de virar a carta
}

// Seleciona uma carta aleatória que ainda não tenha sido descartada
function selectRandomCard() {
    if (availableCards.length === 0) {
        return null;
    }

    const randomIndex = Math.floor(Math.random() * availableCards.length);
    const selectedCardIndex = availableCards[randomIndex];

    availableCards.splice(randomIndex, 1); 
    discardedCards.push(selectedCardIndex);

    return selectedCardIndex;
}

// Animação de virar a carta com Anime.js
function flipCard(card, cardIndex) {
    if (card.classList.contains("flipping")) return;

    card.classList.add("flipping");

    card.querySelector('.card-inner').style.transform = 'rotateY(0deg)';

    anime({
        targets: card.querySelector('.card-inner'),
        rotateY: '180deg',
        duration: 600,
        easing: 'easeInOutSine',
        complete: () => {
            showQuestionModal(cardIndex);
        }
    });
}

// Mostrar pergunta no modal
function showQuestionModal(cardIndex) {
    let questionData = questions[cardIndex % questions.length];
    questionData = shuffleAlternatives(questionData); 

    const modal = document.getElementById("question-modal");
    const questionText = document.getElementById("question-text");
    const alternativesDiv = document.getElementById("alternatives");

    questionText.textContent = questionData.question;
    alternativesDiv.innerHTML = "";

    questionData.alternatives.forEach((alt, idx) => {
        const button = document.createElement("button");
        button.textContent = alt;
        button.onclick = () => checkAnswer(idx, questionData.correct);
        alternativesDiv.appendChild(button);
    });

    anime({
        targets: modal,
        opacity: [0, 1],
        scale: [0.8, 1],
        duration: 500,
        easing: 'easeOutQuad',
        complete: () => {
            modal.style.display = "flex";
        }
    });
}

// Verificar resposta
function checkAnswer(selected, correct) {
    const modal = document.getElementById("question-modal");
    const gameInfo = document.getElementById("game-info");
    const questionText = document.getElementById("question-text");

    if (selected === correct) {
        gameInfo.textContent = "Resposta correta!";
        score++;
        updateScore();
        questionText.textContent = "Você acertou!";

        anime({
            targets: "#question-text",
            scale: [1, 1.2, 1],
            color: "#00FF00", 
            duration: 800,
            easing: 'easeInOutQuad',
            loop: 2,
            complete: () => {
                questionText.style.color = "";
            }
        });

    } else {
        gameInfo.textContent = "Resposta incorreta!";
        score = Math.max(0, score - 1); 
        updateScore();
        questionText.textContent = "Que pena! Você errou.";
    }

    setTimeout(() => {
        modal.style.display = "none";
        checkGameCompletion(); 
    }, 1500);
}

// Verificar se todas as cartas foram viradas
function checkGameCompletion() {
    if (discardedCards.length === cards.length) {
        showGameCompletionModal(); 
    }
}

// Exibir o modal de agradecimento e pontuação
function showGameCompletionModal() {
    const modal = document.getElementById("completion-modal");
    const completionMessage = document.getElementById("completion-message");
    const scoreMessage = document.getElementById("score-message");

    completionMessage.textContent = "Obrigado por jogar!";
    scoreMessage.textContent = `Sua pontuação final é: ${score}`;

    anime({
        targets: modal,
        opacity: [0, 1],
        scale: [0.8, 1],
        duration: 500,
        easing: 'easeOutQuad',
        complete: () => {
            modal.style.display = "flex";
        }
    });
}

// Atualizar pontuação
function updateScore() {
    document.getElementById("score").textContent = `Pontuação: ${score}`;
}

// Inicializar o jogo
document.getElementById("start-button").addEventListener("click", startGame);
createCards(); // Criar as cartas ao carregar a página
