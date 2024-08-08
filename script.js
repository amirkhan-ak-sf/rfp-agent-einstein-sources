document.getElementById('sendButton').addEventListener('click', () => {
    const userInput = document.getElementById('userInput').value;
    if (userInput) {
        addMessage('User', userInput);
        sendRequest(userInput);
        document.getElementById('userInput').value = ''; // Clear the input field
    }
});

function sendRequest(userInput) {
    // Replace the URL with the actual endpoint of the REST API
    const apiUrl = 'https://rfp-einstein-x95dl4.5sc6y6-3.usa-e2.cloudhub.io/prompt';

    fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({ question: userInput }),
    })
    .then(response => response.json())
    .then(data => {
        displayResponse(data);
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function addMessage(sender, text) {
    const messagesDiv = document.getElementById('messages');
    const message = document.createElement('div');
    message.classList.add('message');
    message.classList.add(sender.toLowerCase());
    message.innerHTML = `<div class="name">${sender}</div><div class="text">${text}</div>`;
    messagesDiv.appendChild(message);
    messagesDiv.scrollTop = messagesDiv.scrollHeight; // Scroll to the bottom
}

function displayResponse(data) {
    addMessage('AI', data.aiResponse.generatedText);

    const sourcesTableBody = document.getElementById('sourcesTable').getElementsByTagName('tbody')[0];
    sourcesTableBody.innerHTML = '';  // Clear previous sources

    if (data.sources && data.sources.length > 0) {
        document.getElementById('sourcesWindow').style.display = 'block';
        document.getElementById('chatWindow').style.height = '50%';

        data.sources.forEach(source => {
            const row = document.createElement('tr');

            const scoreCell = document.createElement('td');
            scoreCell.textContent = source.individualScore;
            row.appendChild(scoreCell);

            const textSegmentCell = document.createElement('td');
            textSegmentCell.textContent = source.textSegment;
            row.appendChild(textSegmentCell);

            const fileNameCell = document.createElement('td');
            fileNameCell.textContent = source.file_name;
            row.appendChild(fileNameCell);

            const absoluteDirectoryPathCell = document.createElement('td');
            absoluteDirectoryPathCell.textContent = source.absoluteDirectoryPath;
            row.appendChild(absoluteDirectoryPathCell);

            sourcesTableBody.appendChild(row);
        });
    } else {
        document.getElementById('sourcesWindow').style.display = 'none';
        document.getElementById('chatWindow').style.height = '100%';
    }
}
