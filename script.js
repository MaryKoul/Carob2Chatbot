async function sendMessage() {
  const userInput = document.getElementById('userInput').value;
  if (!userInput.trim()) return;

  const chatbox = document.getElementById('chatbox');
  chatbox.innerHTML += `<div class="user-message">${userInput}</div>`;

  const response = await fetch('/dialogflowGateway', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ message: userInput })
  });

  const data = await response.json();
  chatbox.innerHTML += `<div class="bot-message">${data.reply}</div>`;

  document.getElementById('userInput').value = '';
  chatbox.scrollTop = chatbox.scrollHeight;
}