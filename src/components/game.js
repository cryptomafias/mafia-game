import PlayerCard from './game/playerCard';
import GameChat from './game/gameChat';
import {
  SimpleGrid,
  Text,
  Heading,
  VStack,
  Box,
  useColorMode,
  Center
} from '@chakra-ui/react';
const Game = () => {
  const { colorMode } = useColorMode();
  const bgColor = { light: 'gray.300', dark: 'gray.700' };
  const textColor = { light: 'gray.500', dark: 'gray.100' };
  return (
    <Center>
    <Box
      rounded="20px"
      overflow="hidden"
      boxShadow="md"
      width='fit-content'
      bg={bgColor[colorMode]}
    >
      <VStack p={4}>
        <Heading mb="8" fontSize="7xl">
          Game Page
        </Heading>
        <SimpleGrid columns={4} spacing={5}>
          <PlayerCard
            name="Akasbjbjkbjhjkhjkhkjhjkhkjh"
            number="1"
            role="Mafia"
          />
          <PlayerCard name="Akash" number="1" />
          <PlayerCard name="Akash" number="1" />
          <PlayerCard name="Akash" number="1" />
          <PlayerCard name="Akash" number="1" />
          <PlayerCard name="Akash" number="1" />
          <PlayerCard name="Akash" number="1" />
          <PlayerCard name="Akash" number="1" />
        </SimpleGrid>
        <GameChat/>
      </VStack>
      
    </Box>
    </Center>
  );
};

export default Game;
