'use client'

import { Editor } from "@monaco-editor/react"
import LanguageSelector from "./LanguageSelector"
import { useEffect, useRef, useState } from "react"
import { CODE_SNIPPETS } from "@/lib/languages"
import Output from "./Output"
import { useWebsocket } from "@/hooks/useWebsocket"

export default function TheEditorComponent(){
    
    const editorRef = useRef();
    const [value,setValue] = useState<string | undefined>("");
    const [language,setLanguage] = useState("javascript");
    const { socket, isConnected, sendMessage } = useWebsocket("https://tofu-9j1l.onrender.com");

    
    useEffect(() =>{
        if (socket) {
            socket.onmessage = (event) => {
                const data = JSON.parse(event.data);
                if (data.type === 'language_change') {
                    setLanguage(data.language);
                    setValue(data.code);
                } else if (data.type === 'code_change') {
                    setValue(data.code);
                }
            };
        }
    },[socket])
    const onMount = (editor : any) =>{
        editorRef.current = editor;
        editor.focus(); 
    }

    const onSelect = (language: string) => {
        setLanguage(language);
        const newValue = (CODE_SNIPPETS as CODE_SNIPPETS)[language] ?? "";
        setValue(newValue);
        if (isConnected) {
            sendMessage({
                type: 'language_change',
                language,
                code: newValue
            });
        }
    }
    const onChange = (newValue: string | undefined) => {
        setValue(newValue);
        if (isConnected) {
            sendMessage({
                type: 'code_change',
                code: newValue
            });
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