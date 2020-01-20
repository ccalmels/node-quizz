const url = window.location.href.replace('http', 'ws');
const ws = new WebSocket(url);

ws.onerror = function(event) {
    alert('Websocket connection failed');
};

ws.onmessage = function(message) {
    console.log(message);
};
