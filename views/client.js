const url = window.location.href.replace('http', 'ws');
const ws = new WebSocket(url);
const operation = document.querySelector('#operation');
const progress = document.querySelector('#progress');
const input = document.querySelector('#answer');

ws.onerror = function(event) {
    alert('Websocket connection failed');
};

ws.onmessage = function(message) {
    console.log(message);

    const obj = JSON.parse(message.data);

    switch(obj.type) {
    case 'question':
	operation.innerHTML = obj.data;
	input.focus();
	break;
    case 'progress':
	progress.style.width = obj.data;
	break;
    }
};

input.onkeypress = function(event) {
    if (event.which === 10 || event.which === 13) {
        // send message to server
        ws.send(input.value);
        input.value = '';
    }
};
