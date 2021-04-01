import PlayerCard from "./game/playerCard"
import {SimpleGrid} from '@chakra-ui/react'
const Game = () => {
    return (
        <>
            {/* <h1 border="1px" borderColor="black">Game Page</h1> */}
            <SimpleGrid columns={4} spacing={5} border="1px" borderColor="black">
            <PlayerCard name='Akash'/>
            <PlayerCard name='Akash'/>
            <PlayerCard name='Akash'/>
            <PlayerCard name='Akash'/>
            <PlayerCard name='Akash'/>
            <PlayerCard name='Akash'/>
            <PlayerCard name='Akash'/>
            <PlayerCard name='Akash'/>
            </SimpleGrid>
            
            
            
        </>
    )
}

export default Game
