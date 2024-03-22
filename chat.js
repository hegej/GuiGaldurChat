document.addEventListener("DOMContentLoaded", function() {
    let username = '';
    const chatWindow = document.getElementById('chatWindow');

    function promptUsername() {
        username = prompt("Før du kan fortsette, må du skrive inn det navnet du ønsker Galdur skal kalle deg");
        if(!username || username.trim() === "") {
            promptUsername();
        }
    }

    promptUsername();

    async function sendMessage() {
        const inputField = document.getElementById('userInput');
        let userInput = inputField.value;
        inputField.value = '';

        const isFirstMessage = chatWindow.children.length === 0;
        let messageToSend = { message: userInput };

        if(isFirstMessage) {
            messageToSend = { message: `Navnet mitt er ${username}. ${userInput}` };
        }

        chatWindow.innerHTML += `<div style="text-align: left;">${username}: ${userInput}</div>`;

        const response = await fetch('http://127.0.0.1.BotAPI', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(messageToSend)
        });

        if(!response.ok) {
            chatWindow.innerHTML += `<div style="color: red;">Failed to get a response from Galdur.</div>`;
            return;
        }

        const data = await response.json();
        chatWindow.innerHTML += `<div style="text-align: left;">Galdur: ${data.message}</div>`;
        chatWindow.scrollTop = chatWindow.scrollHeight;
    }

    window.sendMessage = sendMessage;

    document.getElementById('messageForm').addEventListener('submit', function(event) {
        event.preventDefault();
        sendMessage();
    });
});


