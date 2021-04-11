import {Box, Button, Stack, Text, useColorModeValue} from '@chakra-ui/react';
import Avatar from '../Avatar';
import {useContext} from "react";
import {IdentityContext} from "../../App";

function PlayerCard({takeAction, ...player}) {
    const {identity} = useContext(IdentityContext)
    return (
        <Box
            rounded="20px"
            overflow="hidden"
            boxShadow="md"
            bg={useColorModeValue('gray.200', 'gray.600')}
            align="center"
            p={2}
        >
            <Stack spacing={0}>
                {player.name ? (
                    <>
                        <Avatar value={player.name} display="flex"/>
                        <Button
                            size="xs"
                            variant={"ghost"}
                            _focus={{}}
                            onClick={async () => {
                                const body = {playerId: identity.toString(), victimId: player.name}
                                await takeAction(body)
                            }}
                        >
                            <Text
                                textTransform="uppercase"
                                fontSize="sm"
                                maxWidth={"116px"}
                                fontWeight="bold"
                                isTruncated
                            >
                                {`${player.number}.${player.name}`}
                            </Text>
                        </Button>
                        <Text
                            textTransform="uppercase"
                            fontSize="sm"
                        >
                            {player.role}
                        </Text>
                    </>) : <Box width={"130px"} height={"150px"} display={"flex"}/>
                }
            </Stack>
        </Box>
    );
}

export default PlayerCard;
