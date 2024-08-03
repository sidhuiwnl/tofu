import axios from "axios";
import { LANGUAGE_CHOICES } from "./languages";


const api = axios.create({
    baseURL :"https://emkc.org/api/v2/piston"
})



export  const executeCode  = async(language : string,sourceCode : any) =>{
    
    const version =  (LANGUAGE_CHOICES as CODE_SNIPPETS)[language];
    
    const response = await api.post('/execute',{
        language : language,
        version : version,
        files : [
            {
                content : sourceCode
            }
        ]
    })
    return response.data
}

type CODE_SNIPPETS = {
    [key: string]: string;
};