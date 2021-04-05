import {useState} from 'react';
import {
    Box,
    useColorMode,
    Text,
    Heading,
    InputGroup,
    Input,
    HStack,
    VStack,
    InputRightAddon
  } from '@chakra-ui/react';


const GameChat = () => {
    const [name, setName] = useState('');
    const [room, setRoom] = useState('');
    const { colorMode } = useColorMode();
    const bgColor = { light: 'gray.300', dark: 'gray.700' };
    const textColor = { light: 'gray.500', dark: 'gray.100' };
    return (
        
        
            
            <VStack>
            <Heading>Chat</Heading>
            <Box 
            w="850px"
            maxH="170px"
            rounded="5px"
            overflow="hidden"
            boxShadow="md"
            bg={'white'}
            align="left"
            pl={5}
            overflowY='scroll'>
            <Text>YO</Text>
            <Text>YO</Text>
            <Text>YO</Text>
            <Text>YO</Text>
            <Text>YO</Text>
            <Text>YO</Text>
            <Text>YO</Text>
            <Text>YO</Text><Text>YO</Text>
            </Box>
            <InputGroup width='full'>
            <Input bgColor='white'/>
            <InputRightAddon as='button' children='SEND'/>
            </InputGroup> 
            </VStack>
            
            
            
       
    )
}

export default GameChat
