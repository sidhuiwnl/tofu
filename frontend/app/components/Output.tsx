'use client'

import { Box,Text,Button } from "@chakra-ui/react";
import  { executeCode } from  "@/lib/api"
import { useState } from "react";
import { useToast } from "@chakra-ui/react";


export default function Output({editorRef,language} : {editorRef: any,language : string}) {
  const toast = useToast();
   const [codeOutput,setCodeOutput] = useState<String[]>([]);
   const [isLoading,setIsLoading] = useState(false);
   const [isError,setIsError] = useState(false);

  const output = async () =>{
    setIsLoading(true);
    const sourceCode = editorRef.current.getValue();
    if(!sourceCode) return
    try {
      const {run : result} = await executeCode(language,sourceCode);
      setCodeOutput(result.output.split("\n"));
      
      result.stderr ? setIsError(true) : setIsError(false);
      
    } catch (error) {
      console.error(error);
      toast({
        title : "An error occured",
        description : "Unable to run code",
        status : "error",
        duration : 6000,
      })
    }finally{
      setIsLoading(false);
    }
  }
  return (
    <Box ml={2} className="p-4">
      <Text mb={4} fontSize="lg">
        Output
      </Text>
      <Button
        variant="outline"
        colorScheme="green"
        mb={4}
        onClick={output}
        isLoading={isLoading}
      >
        Run Code
      </Button>
      <Box
        height="90vh"
        width="40vw"
        p={2}
        color={isError ? "red.400" : "" }
        border="1px solid"
        borderRadius={4}
        borderColor={isError ? "red.500" : "#333"}
      >
        <Text mb={2} fontSize=" lg">{ codeOutput ? 
          codeOutput.map(code =>(
            <Text><code>{code}</code></Text>
          ))

        : "Click Run Code to see the output here"}</Text>
    </Box>
    </Box>
  );
} 
