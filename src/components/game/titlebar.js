import {Badge, Box, HStack, Text} from "@chakra-ui/react";

function TitleBar({roomId, phase}) {
    return (
        <HStack w="650px" spacing={6}>
            <Box> <Text as={"bold"} fontSize={"md"}>Room ID: </Text> <Badge variant="solid"
                                                                            colorScheme="green">{roomId}</Badge></Box>
            <Box> <Text as={"bold"} fontSize={"md"}>Phase: </Text> <Badge variant="solid"
                                                                          colorScheme="yellow">{phase}</Badge></Box>
        </HStack>
    )
}

export default TitleBar