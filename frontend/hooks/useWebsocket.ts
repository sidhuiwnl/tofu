import { useState,useEffect,useCallback } from "react";

interface WebSocketMessage{
    type : string,
    [key : string] : any
}

export function useWebsocket(url : string){
    const [socket,setSocket] = useState<WebSocket | null>(null);
    const [isConnected,setIsConnected] = useState(false);

    useEffect(() =>{
        const ws = new WebSocket(url);

        ws.onopen = () =>{
            console.log('Connected to WebSocket server');
            setIsConnected(true);
            setSocket(ws);
        }
        ws.onclose = () => {
            console.log('Disconnected from WebSocket server');
            setIsConnected(false);
            setSocket(null);
          };
      
          ws.onerror = (error) => {
            console.error('WebSocket error:', error);
          };
      
          return () => {
            if (ws.readyState === WebSocket.OPEN) {
              ws.close();
            }
          };
    },[url]);

    const sendMessage = useCallback((message : WebSocketMessage) =>{
      if(socket && socket.readyState === WebSocket.OPEN){
        socket.send(JSON.stringify(message))
      }else{
        console.error('Websocket is not connected')
      }
    },[socket])

    return { socket,isConnected,sendMessage}
}