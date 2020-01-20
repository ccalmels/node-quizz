const url = window.location.href.replace('http', 'ws');
const ws = new WebSocket(url);
const operation = document.querySelector('#operation');

ws.onerror = function(event) {
    alert('Websocket connection failed');
};

ws.onmessage = function(message) {
    console.log(message);

    operation.innerHTML = message.data;
};

const input = document.querySelector('#answer');

input.onkeypress = function(event) {
    if (event.which === 10 || event.which === 13) {
        // send message to server
        ws.send(input.value);
        input.value = '';
    }
};
