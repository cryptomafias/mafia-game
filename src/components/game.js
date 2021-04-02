import PlayerCard from './game/playerCard';
import { SimpleGrid, Text, Heading, VStack } from '@chakra-ui/react';
const Game = () => {
  return (
    <>
      <VStack p={4}>
        <Heading mb="8" fontSize="7xl">
          Game Page
        </Heading>
        <SimpleGrid columns={4} spacing={5}>
          <PlayerCard name="Akash" number="1" />
          <PlayerCard name="Akash" number="1" />
          <PlayerCard name="Akash" number="1" />
          <PlayerCard name="Akash" number="1" />
          <PlayerCard name="Akash" number="1" />
          <PlayerCard name="Akash" number="1" />
          <PlayerCard name="Akash" number="1" />
          <PlayerCard name="Akash" number="1" />
        </SimpleGrid>
      </VStack>
    </>
  );
};

export default Game;
