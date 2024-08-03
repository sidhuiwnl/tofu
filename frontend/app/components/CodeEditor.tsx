'use client'

import { Editor } from "@monaco-editor/react"
import LanguageSelector from "./LanguageSelector"
import { useEffect, useRef, useState } from "react"
import { CODE_SNIPPETS } from "@/lib/languages"
import Output from "./Output"

export default function TheEditorComponent(){
    
    const editorRef = useRef();
    const [value,setValue] = useState<string | undefined>("");
    const [language,setLanguage] = useState("javascript");
    const[socket,setSocket] = useState<WebSocket | null>(null);

    
    useEffect(() =>{
        const ws = new WebSocket('http://localhost:8000');

        ws.onopen = () =>{
            console.log('Connected to Websocket sever');
           setSocket(ws)
        }

        ws.onmessage = (event) =>{
            const data = JSON.parse(event.data);
            if(data.type === 'language_change'){
                setLanguage(data.language);
                setValue(data.code);
            }else if(data.type === 'code_change'){
                setValue(data.code);
            }
        }
        ws.onerror = (error) => {
            console.error('WebSocket error:', error);
        };
        ws.onclose = () => {
            console.log('Disconnected from WebSocket server');
        };
        return () => {
            if (ws && ws.readyState === WebSocket.OPEN) {
                ws.close();
            }
        };
    },[])
    const onMount = (editor : any) =>{
        editorRef.current = editor;
        editor.focus(); 
    }

    const onSelect = (language : string) => {
        setLanguage(language);
        const newValue = (CODE_SNIPPETS as CODE_SNIPPETS)[language] ?? "";
        setValue(newValue);
        if (socket && socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify({
                type: 'language_change',
                language,
                code: newValue
            }));
        }
    }
    const onChange = (newValue: string | undefined) => {
        setValue(newValue);
        if (socket && socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify({
                type: 'code_change',
                code: newValue
            }));
        }
    }

    
    return (
        <div className="flex flex-row">
            
            <div>
            <LanguageSelector language={language} onSelect={onSelect}/>
             <Editor
            className="p-4"
             height="90vh"
             width="50vw"
             language={language}
             defaultValue={(CODE_SNIPPETS as CODE_SNIPPETS)[language] ?? ""} 
             theme="vs-dark"
             value={value}
             onChange={onChange}
             onMount={onMount}
             /> 
            </div>
            <div>
                <Output editorRef={editorRef} language={language}/>
            </div>
        </div>
    )
}


type CODE_SNIPPETS =    {
    [key : string]  :string
}