if (!localStorage.getItem('sessionId')) {
    localStorage.setItem('sessionId', generateUUID());
}

function generateUUID() {
    var d = new Date().getTime();
    var d2 = (typeof performance !== 'undefined' && performance.now && (performance.now()*1000)) || 0;
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16;
        if(d > 0){
            r = (d + r) % 16 | 0;
            d = Math.floor(d/16);
        } else {
            r = (d2 + r) % 16 | 0;
            d2 = Math.floor(d2/16);
        }
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
}

document.addEventListener("DOMContentLoaded", function() {
    let username = '';
    let isFirstMessage = true;
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

        if(chatWindow.children.length === 0) {
            isFirstMessage = true;
        } else {
            isFirstMessage = false;
        }
        
        let messageToSend = {
            username: username,
            userInput: userInput,
            sessionId: localStorage.getItem('sessionId')
        };

        if(isFirstMessage) {
            delete messageToSend.userInput;
            messageToSend.userInput = `Navnet mitt er ${username}. ${userInput}`;
        }

        chatWindow.innerHTML += `<div class="user-message">${username}: ${userInput}</div>`;

        const response = await fetch('https://2g5xt7jm-7071.euw.devtunnels.ms/api/Bot/chat', {
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


