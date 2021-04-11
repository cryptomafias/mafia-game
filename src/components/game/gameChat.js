import {Box, Input, InputGroup, InputRightAddon, Text,Button, useColorModeValue, VStack} from '@chakra-ui/react';
import {useContext, useEffect, useState} from "react";
import {HubContext} from "../../App";
import {ThreadID} from "@textile/hub";

function GameChat({threads}){
    const hub = useContext(HubContext)
    const [messages, setMessages] = useState([{"id":1234,
    "message":"sup boi"}])
    const [userMessage,setUserMessage] = useState()
    useEffect(() => {
        const fetch = async() => {
            if(hub && hub.hasOwnProperty("client") && threads && threads.hasOwnProperty("villagerThread")){

                console.log("chats loading")
                const villagerThread = ThreadID.fromString(threads.villagerThread)
                const initMessages = await hub.client.find(villagerThread, 'chat', {})
                setMessages(initMessages);
                
            }
            console.log(messages.id)
        }
        fetch()
    }, [hub, threads])

    //Implement function to send message here
    const sendMessage = async(e) => {
        e.preventDefault()
        console.log("Empty Message")
        if(userMessage!=='')
        {
            //If message is not empty send it
            console.log("Message Sent!")
            console.log(userMessage)
        }
    }

    return (
        <VStack spacing={2}>
            <Box
                w="650px"
                minH ="150px"
                maxH="250px"
                rounded="5px"
                overflow="hidden"
                boxShadow="md"
                bg={useColorModeValue('gray.200', 'gray.600')}
                align="left"
                pl={2}
                overflowY='scroll'
            >
                <main>
                
                {messages && messages.map(msg=> <ChatMessage id={msg.id} message={msg.message}/>)}
                
                </main>
                
            </Box>
            <form onSubmit={sendMessage}>
            <InputGroup width = {650} >
                <Input 
                bg={useColorModeValue('gray.200', 'gray.600')}
                value ={userMessage} onChange={(e)=>setUserMessage(e.target.value)}/>
                <InputRightAddon as='button' children='SEND' type = "submit" />
            </InputGroup>
            </form>
            
        </VStack>
    )
}

function ChatMessage({id,message}) {
    //processing before printing
  
    return (
        <Text fontSize={"l"}>{id} {message}</Text>
    )
  }

export default GameChat
