import {useState} from 'react';
import {
    Box,
    useColorMode,
    Text,
    Heading,
    Input
  } from '@chakra-ui/react';

const GameChat = () => {
    const [name, setName] = useState('');
    const [room, setRoom] = useState('');
    const { colorMode } = useColorMode();
    const bgColor = { light: 'gray.300', dark: 'gray.700' };
    const textColor = { light: 'gray.500', dark: 'gray.100' };
    return (
        
        // <div className="joinOuterContainer">
        //     <div className="joinInnerContainer">
            <Box width='full'
            bg={bgColor[colorMode]}
            >
            <Heading>Chat</Heading>
            <Input
            isFullWidth/>
            </Box>
        //     </div>

            
        // </div>
    )
}

export default GameChat
