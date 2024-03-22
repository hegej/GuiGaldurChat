document.addEventListener("DOMContentLoaded", function() {
    let username = '';
    const chatWindow = document.getElementById('chatWindow');

    function promptUsername() {
        const modal = document.getElementById('usernameModal');
        const submitButton = document.getElementById('usernameSubmit');
        const inputField = document.getElementById('usernameInputModal');
    
        modal.style.display = "block";
    
        submitButton.onclick = function() {
            username = inputField.value;
            if(!username || username.trim() === "") {
                alert("Please enter a valid name");
            } else {
                modal.style.display = "none";
            }
        }
    }

    promptUsername();

    async function sendMessage() {
        const inputField = document.getElementById('userInput');
        let userInput = inputField.value;
        inputField.value = '';

        const isFirstMessage = chatWindow.children.length === 0;
        
        let messageToSend = {
            userInput: userInput,
            username: username
        };

        if(isFirstMessage) {
            messageToSend.UserInput = `Navnet mitt er ${username}. ${userInput}`;
        }

        chatWindow.innerHTML += `<div class="user-message">${username}: ${userInput}</div>`;

        const response = await fetch('https://vnb78t34-7071.euw.devtunnels.ms//api/Bot/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(messageToSend)
        });

        if(!response.ok) {
            chatWindow.innerHTML += `<div class="bot-message">Galdur: There was an error processing your message.</div>`;
            return;
        }

        const data = await response.json();
        chatWindow.innerHTML += `<div style="text-align: left;">Galdur: ${data.message}</div>`;
        chatWindow.scrollTop = chatWindow.scrollHeight;

        if(isFirstMessage) {
            isFirstMessage = false;
        }
    }

    window.sendMessage = sendMessage;

    document.getElementById('messageForm').addEventListener('submit', function(event) {
        event.preventDefault();
        sendMessage();
    });

    document.getElementById('infoLink').addEventListener('click', function(event) {
        event.preventDefault();
        document.getElementById('infoModal').style.display = 'block';
    });
    
    document.getElementById('closeInfoModal').addEventListener('click', function() {
        document.getElementById('infoModal').style.display = 'none';
    });
});


