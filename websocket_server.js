var net = require('net');
var ws = require("nodejs-websocket");
var sock = new net.Socket();
sock.setNoDelay(true);
var receivedText="PING";
var settings = require('./config.properties');
var serverResponse="";
var readers="";


fs = require('fs');
fs.readFile('C:\\javasocket.properties', 'utf8', function (err,data) {
  if (err) {
    return console.log(err);
  }
  console.log(data);
  readers = data;
});

// if property is set to yes, it will connect to java socket and listen continously.

if(settings.java_socket == 'YES') {
	var client = sock.connect({port: settings.blackbox_port,host:settings.blackbox_host},function() {
	  console.log('connected to blackbox server...! port 10008');
	  client.write('chemtrack blackbox'+'\r\n');
	});
client.on('data', function(data) {
  receivedText = data.toString();
  serverResponse = serverResponse+receivedText;
  if(serverResponse.indexOf("OK") >-1) {
    broadcast(server, serverResponse);
  }
});

// This web socket server listing at port.
var server = ws.createServer(function (conn) {
  console.log("Web socket Listener started ...at port 8001");
    conn.on("text", function (str) {
     if (str == 'READERS') {
		conn.sendText(readers);
	 }
    if (str != 'PING') {
      client.write(str + '\r\n');
      conn.sendText('PING');
    }
    else {
      conn.sendText(receivedText);
      receivedText="PING";
    }
  })
  conn.on("close", function (code, reason) {
    console.log("Connection closed")
  })
}).listen(8001);
}


function broadcast(server, msg) {
  server.connections.forEach(function (conn) {
    conn.sendText(msg);
    serverResponse="";
  })
}