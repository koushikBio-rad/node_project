//SOME code to web socket


//var ws = new WebSocket("ws://localhost:8001/echo");
var ws = new WebSocket("ws://"+ip_addr+":8001/echo");

   ws.send("SWEEP");
    ws.send("PING");
}
