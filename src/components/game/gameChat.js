import {Box, Input, InputGroup, InputRightAddon, Text, useColorModeValue, VStack} from '@chakra-ui/react';
import {useContext, useEffect} from "react";
import {HubContext} from "../../App";
import {ThreadID} from "@textile/hub";

function GameChat({threads}){
    const hub = useContext(HubContext)
    // const [messages, setMessages] = useState([])

    useEffect(() => {
        const fetch = async() => {
            if(hub.hasOwnProperty("client") && threads.hasOwnProperty("villagerThread")){
                console.log("chats loading")
                const villagerThread = ThreadID.fromString(threads.villagerThread)
                const initMessages = await hub.client.find(villagerThread, 'chat', {})
                console.log(initMessages)
            }
        }
        fetch()
    }, [hub, threads])

    return (
        <VStack spacing={2}>
            <Box
                w="650px"
                maxH="170px"
                rounded="5px"
                overflow="hidden"
                boxShadow="md"
                bg={useColorModeValue('gray.200', 'gray.600')}
                align="left"
                pl={2}
                overflowY='scroll'
            >
                <Text fontSize={"md"}>1: Hi</Text>
                <Text fontSize={"md"}>2: Hello</Text>
                <Text fontSize={"md"}>1: I am noobie</Text>
                <Text fontSize={"md"}>1: Please tell me how to play</Text>
                <Text fontSize={"md"}>2: It's very easy</Text>
                <Text fontSize={"md"}>2: You will get a role in the beginning</Text>
                <Text fontSize={"md"}>2: If you are mafia, kill player at Night</Text>
                <Text fontSize={"md"}>2: If you are detective, inspect a player</Text>
                <Text fontSize={"md"}>2: If you are doctor, heal someone</Text>
                <Text fontSize={"md"}>1: Thanks, this sounds fun!</Text>
            </Box>
            <InputGroup width='full'>
                <Input bg={useColorModeValue('gray.200', 'gray.600')}/>
                <InputRightAddon as='button' children='SEND'/>
            </InputGroup>
        </VStack>
    )
}

export default GameChat
