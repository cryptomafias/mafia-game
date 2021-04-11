import PlayerCard from './playerCard';
import GameChat from './gameChat';
import {Box, Center, SimpleGrid, useColorModeValue, VStack} from '@chakra-ui/react';
import {useParams} from "react-router-dom";
import {useContext, useEffect, useState} from "react";
import {GAME_THREAD, HubContext} from "../../App";
import {ThreadID} from "@textile/hub";
import TitleBar from "./titlebar";
import {debounce} from "../utils";

function Game() {
    const hub = useContext(HubContext)
    // const {identity} = useContext(IdentityContext)
    const {roomId} = useParams()
    const [threads, setThreads] = useState({})
    const [room, setRoom] = useState({})
    // const [players, setPlayers] = useState([])

    useEffect(() => {
        let subRoom
        // Alternatively we can have a custom timer which we can use to fetch current state
        // Ofcourse best way is to figure out whu listener is being closed.
        const updateRoom = (update) => {
            console.log(update)
            if(!update) {
                fetch();
                return;
            } // hack for undefined callback
            if(update.collectionName !== "rooms") return
            if(update.action === "SAVE"){
                setRoom(update.instance)
            }
        }

        const fetch = debounce(async () => {
            if (hub.hasOwnProperty("client") && hub) {
                const threadId = ThreadID.fromString(GAME_THREAD)
                const initRoom = await hub.client.findByID(threadId, "rooms", roomId)
                console.log(initRoom)
                setRoom(initRoom)
                if(!threads){
                    setThreads({villagerThread: initRoom.villagerThread})   
                }
                subRoom = await hub.client.listen(threadId, [{
                        collectionName: "rooms",
                        instanceID: roomId
                    }],
                    updateRoom
                )
            }
            
        }, 2000)
        fetch()
        return (
            () => {
                if(subRoom) {subRoom.close()}
            }
        )
    }, [hub, roomId])

    return (
        <Center>
            <Box
                rounded="20px"
                overflow="hidden"
                boxShadow="md"
                width='fit-content'
                bg={useColorModeValue('gray.300', 'gray.700')}
            >
                <VStack p={4} spacing={4}>
                    <TitleBar roomId={roomId} phase={room ? room.phase : "LOADING"}/>
                    <SimpleGrid columns={4} spacing={5}>
                        {Array(8).fill(0).map((_, i) => (
                            <PlayerCard
                                key={i}
                                number={i + 1}
                                role={"ALIVE"}
                                name={room.hasOwnProperty("players") && room.players.length > i ? room.players[i] : ""}
                            />
                        ))}
                    </SimpleGrid>
                    <GameChat threads={threads}/>
                </VStack>
            </Box>
        </Center>
    );
};

export default Game;
