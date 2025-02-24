const sideNavigation = document.querySelector(".sideNavigation");
const sideBarToggle = document.querySelector(".fa-bars");
const startContentUl = document.querySelector(".startContent ul");
const inputArea = document.querySelector(".inputArea input");
const sendRequest = document.querySelector(".fa-paper-plane");
const chatHistory = document.querySelector(".chatHistory ul");
const startContent = document.querySelector(".startContent");
const chatContent = document.querySelector(".chatContent");
const results = document.querySelector(".results");

document.querySelector('.sideNavButton button').addEventListener('click', newChat);

const promptQuestions = [
    {
        question: "Write a Hello World code in JavaScript",
        icon: "fa-solid fa-wand-magic-sparkles",
    },
    {
        question: "What is javascript",
        icon: "fa-solid fa-code",
    },
    {
        question: "How to become a Full Stack Developer?",
        icon: "fa-solid fa-laptop-code",
    },
    {
        question: "Tell me about Your Self",
        icon: "fa-solid fa-database",
    },
];

window.addEventListener("load", () => {
    promptQuestions.forEach((data) => {
        const item = document.createElement("li");
        item.innerHTML = `
            <div class="promptSuggestion">
                <p>${data.question}</p>
                <i class="${data.icon}"></i>
            </div>
        `;
        item.addEventListener("click", () => getGeminiResponse(data.question, true));
        startContentUl.appendChild(item);
    });
});

sideBarToggle.addEventListener("click", () => {
    sideNavigation.classList.toggle("expandClose");
});

inputArea.addEventListener("input", () => {
    sendRequest.style.display = inputArea.value ? "block" : "none";
});

sendRequest.addEventListener("click", () => {
    if (inputArea.value.trim()) getGeminiResponse(inputArea.value.trim(), true);
});

function getGeminiResponse(question, appendHistory) {
    if (appendHistory) {
        const historyLi = document.createElement("li");
        historyLi.innerHTML = `<i class="fa-regular fa-message"></i>${question}`;
        historyLi.addEventListener("click", () => getGeminiResponse(question, false));
        chatHistory.appendChild(historyLi);
    }

    inputArea.value = "";
    startContent.style.display = "none";
    chatContent.style.display = "block";

    results.innerHTML = `
        <div class="resultTitle">
       <b> Ques: </b>
            <p>${question}</p>
        </div>
    `;

    const API_KEY = "AIzaSyChfMY3LotHEsiyG8mEm0_N_hR6qWg9COU";
    fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: [{ parts: [{ text: question }] }] })
    })
    .then(response => response.json())
    .then(data => {
        const responseText = data.candidates[0].content.parts[0].text;
        results.innerHTML += `
            <div class="resultResponse">
            <b> Ans: </b>
                <p>${formatResponseText(responseText)}</p>
            </div>
        `;
    })
    .catch(error => {
        console.error("Error:", error);
        results.innerHTML += `<p class="error">Error fetching response. Please try again.</p>`;
    });
}

function formatResponseText(text) {
    return text
        .split("**")
        .map((part, index) => index % 2 ? `<strong>${part}</strong>` : part)
        .join(" ")
        .replace(/\n/g, "<br>");
}

function newChat() {
    startContent.style.display = "block";
    chatContent.style.display = "none";
    inputArea.value = "";
    results.innerHTML = "";
    chatHistory.innerHTML = "";
    sendRequest.style.display = "none";
}