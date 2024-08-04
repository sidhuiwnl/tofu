"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = __importDefault(require("ws"));
const wss = new ws_1.default.Server({ port: 8000 });
wss.on('connection', (ws) => {
    console.log("a client connected");
    ws.on('message', (message) => {
        const data = JSON.parse(message.toString());
        // Broadcast the message to all clients except the sender
        wss.clients.forEach((client) => {
            if (client !== ws && client.readyState === ws_1.default.OPEN) {
                client.send(JSON.stringify(data));
            }
        });
    });
    ws.on('close', () => {
        console.log('Client disconnected');
    });
});
console.log('WebSocket server is running on ws://localhost:8080');
