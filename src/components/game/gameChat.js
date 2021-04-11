import {
  Box,
  Input,
  InputGroup,
  InputRightAddon,
  Text,
  useColorModeValue,
  VStack,
} from '@chakra-ui/react';
import { useContext, useEffect, useState } from 'react';
import { HubContext } from '../../App';
import { PrivateKey, ThreadID } from '@textile/hub';
import {axios} from 'axios';
function GameChat({ threads,roomId }) {
  const hub = useContext(HubContext);
  const [messages, setMessages] = useState([]);
  const [userMessage, setUserMessage] = useState();
  useEffect(() => {
    const fetch = async () => {
      if (
        hub &&
        hub.hasOwnProperty('client') &&
        threads &&
        threads.hasOwnProperty('villagerThread')
      ) {
        console.log('chats loading');
        const villagerThread = ThreadID.fromString(threads.villagerThread);
        const initMessages = await hub.client.find(villagerThread, 'chat', {});
        
        //setMessages(initMessages);
      }
    };
    fetch();
  }, [hub, threads]);

  //Implement function to send message here
  const sendMessage = async e => {
    e.preventDefault();
    if (userMessage !== '') {
      //If message is not empty send it
      console.log('Message Sent!');
      console.log(userMessage);
      setUserMessage('');
    }
  };

  return (
    <VStack spacing={2}>
      <Box
        w="650px"
        minH="150px"
        maxH="250px"
        rounded="5px"
        overflow="hidden"
        boxShadow="md"
        bg={useColorModeValue('gray.200', 'gray.600')}
        align="left"
        pl={2}
        overflowY="scroll"
      >
        <main>
          {messages &&
            messages.map(msg => (
              <ChatMessage id={msg._id} message={msg.message} />
            ))}
        </main>
      </Box>
      <form onSubmit={sendMessage}>
        <InputGroup width={650}>
          <Input
            bg={useColorModeValue('gray.200', 'gray.600')}
            value={userMessage}
            onChange={e => setUserMessage(e.target.value)}
          />
          <InputRightAddon as="button" children="SEND" type="submit" />
        </InputGroup>
      </form>
    </VStack>
  );
}

function serverAction({role,phase,playerId,victimId}){
  if(phase == "NIGHT")
  {
    if(role == "MAFIA")
    {   
        killVote(playerId,victimId);
    }
    else if(role == "DETECTIVE"){
        inspect(playerId,victimId);
    }
    else if(role=="DOCTOR"){
        heal(playerId,victimId);
    }
  }
  else if (phase == "VOTING")
  {
        ejectVote(playerId,victimId);
  }
}

function killVote({playerId,victimId})
{
    const body = [{"playerId":playerId},{"victimId":victimId}];
    const res = await axios.put('/rooms/'+roomId+'killVote',{body});
}

function ejectVote({playerId,victimId})
{
    const body = [{"playerId":playerId},{"victimId":victimId}];
    const res = await axios.put('/rooms/'+roomId+'vote',{}).then(res=>{console.log(res)})
}

function inspect({playerId,victimId}){
    const body = [{"playerId":playerId},{"victimId":victimId}];
    const res = await axios.get('/rooms/'+roomId+'inspect',{body}).then(res=>{console.log(res)})
}

function heal({playerId,victimId}){
  const body = [{"playerId":playerId},{"victimId":victimId}];
  const res = axios.put('/rooms/'+roomId+'heal',{body}).then(res=>{console.log(res)})
}

function ChatMessage({ id, message }) {
  //processing before printing
  // const msg = PrivateKey.decrypt(message.encryptedRole)
  // console.log(msg)
  return (
    <Text fontSize={'l'}>
      {id}:{message}
    </Text>
  );
}

export default GameChat;
