import PlayerCard from './playerCard';
import GameChat from './gameChat';
import {Box, Center, SimpleGrid, useColorModeValue, VStack} from '@chakra-ui/react';
import {useParams} from "react-router-dom";
import {useContext, useEffect, useState} from "react";
import {API_URL, GAME_THREAD, HubContext, IdentityContext} from "../../App";
import {ThreadID} from "@textile/hub";
import TitleBar from "./titlebar";
import {debounce} from "../utils";
import axios from "axios";

function Game() {
    const hub = useContext(HubContext)
    const {identity} = useContext(IdentityContext)
    const {roomId} = useParams()
    const [threads, setThreads] = useState({})
    const [room, setRoom] = useState({})
    const [playerToRole, setPlayersToRole] = useState({})

    const takeAction = async (body) => {
        const phase = room.phase
        const role = playerToRole[identity.public.toString()]
        if (phase === "NIGHT") {
            if (role === "MAFIA") {
                await axios.put(`${API_URL}/rooms/${roomId}/killVote`, body);
            } else if (role === "DETECTIVE") {
                await axios.put(`${API_URL}/rooms/${roomId}/inspect`, body);
            } else if (role === "DOCTOR") {
                await axios.put(`${API_URL}/rooms/${roomId}/heal`, body);
            }
        } else if (phase === "VOTING") {
            await axios.put(`${API_URL}/rooms/${roomId}/vote`, body);
        }
    }

    // const [playerNameToNum, serPlayerNameToNum] = useState({})

    useEffect(() => {
        let subRoom
        // Alternatively we can have a custom timer which we can use to fetch current state
        // Ofcourse best way is to figure out whu listener is being closed.
        const updateRoom = (update) => {
            console.log(update)
            if (!update) {
                fetch();
                return;
            } // hack for undefined callback
            if (update.collectionName !== "rooms") return
            if (update.action === "SAVE") {
                setRoom(update.instance)
            }
        }

        const fetch = debounce(async () => {
            if (hub && hub.hasOwnProperty("client")) {
                const threadId = ThreadID.fromString(GAME_THREAD)
                const initRoom = await hub.client.findByID(threadId, "rooms", roomId)
                console.log(initRoom)
                setRoom(initRoom)
                if (!(threads && threads.hasOwnProperty("villagerThread"))) {
                    setThreads({villagerThread: ThreadID.fromString(initRoom.villagerThread)})
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
        return (setTimeout(() => {
            if (subRoom) {
                subRoom.close()
            }
        }), 10000)
    }, [hub, roomId, threads])

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
                                takeAction={takeAction}
                                role={(
                                    room &&
                                    room.hasOwnProperty("players") &&
                                    room.players.length > i &&
                                    playerToRole &&
                                    playerToRole.hasOwnProperty(room.players[i])
                                )
                                    ? playerToRole[room.players[i]] : "ALIVE"
                                }
                                name={room && room.hasOwnProperty("players") && room.players.length > i ? room.players[i] : ""}
                            />
                        ))}
                    </SimpleGrid>
                    <GameChat
                        room={room}
                        threads={threads}
                        setThreads={setThreads}
                        // players={room && room.hasOwnProperty("players") ? room.players : []}
                        setPlayerToRole={setPlayersToRole}
                    />
                </VStack>
            </Box>
        </Center>
    );
};

export default Game;