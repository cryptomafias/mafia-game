import {Box, Stack, Text, useColorModeValue, Button} from '@chakra-ui/react';
import Avatar from '../Avatar';

function PlayerCard(player) {
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
                    </>) : <Box width={"100px"} height={"150px"} display={"flex"}/>
                }
            </Stack>
        </Box>
    );
}

export default PlayerCard;
