import PlayerCard from './playerCard';
import GameChat from './gameChat';
import {Box, Center, SimpleGrid, useColorModeValue, VStack} from '@chakra-ui/react';
import {useParams} from "react-router-dom";
import {useContext, useEffect, useState} from "react";
import {GAME_THREAD, HubContext} from "../../App";
import {ThreadID} from "@textile/hub";
import TitleBar from "./titlebar";

function Game() {
    const hub = useContext(HubContext)
    // const {identity} = useContext(IdentityContext)
    const {roomId} = useParams()
    const [threads, setThreads] = useState({})
    const [room, setRoom] = useState({})
    // const [players, setPlayers] = useState([])

    useEffect(() => {
        const updateRoom = (update) => {
            console.log(update)
            if(!update) return
            if(update.collectionName !== "rooms") return
            if(update.action === "SAVE"){
                setRoom(update.instance)
            }
        }

        const fetch = async () => {
            if (hub.hasOwnProperty("client")) {
                const threadId = ThreadID.fromString(GAME_THREAD)
                const initRoom = await hub.client.findByID(threadId, "rooms", roomId)
                console.log(initRoom)
                setRoom(initRoom)
                setThreads(threads => {
                    threads.villagerThread = initRoom.villagerThread
                    return threads
                })
                const subRoom = hub.client.listen(threadId, [{
                        collectionName: "rooms",
                        instanceID: roomId
                    }],
                    updateRoom
                )
            }
        }
        fetch()
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
