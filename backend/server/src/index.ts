import WebSocket from "ws";

const wss = new WebSocket.Server({ port: 8000 });

wss.on("connection", (ws) => {
  console.log("a client connected");

  ws.on("message", (message: WebSocket.RawData) => {
    const data = JSON.parse(message.toString());

   
    wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(data));
      }
    });
  });

  ws.on("close", () => {
    console.log("Client disconnected");
  });
});

console.log("WebSocket server is running on ws://localhost:8080");
