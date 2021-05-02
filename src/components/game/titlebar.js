import {Badge, Box, HStack, IconButton, Text, useClipboard, useColorModeValue} from "@chakra-ui/react";
import {createNotification} from "../notification";
import {FaCopy} from "react-icons/all";
import React from "react";

function TitleBar({roomId, phase}) {
    const {onCopy} = useClipboard(roomId)
    const onClick = () => {
        onCopy()
        createNotification("success", "copied to clipboard")
    }
    return (
        <HStack w="650px" spacing={6}>
            <Box>
                <HStack spacing={1}>
                    <Text as={"bold"} fontSize={"md"}>Room ID: </Text>
                    <Box bg="green" px={1} rounded={3}>
                        <Text
                            fontWeight={"bold"}
                            fontSize={"sm"}
                            color={"white"}
                        >{roomId}
                        </Text>
                    </Box>
                    <IconButton
                        variant="ghost"
                        color={'gray.500'}
                        onClick={onClick}
                        aria-label="copy"
                        icon={<FaCopy/>}
                        _focus={{}}
                        _hover={{
                            color: useColorModeValue('gray.600', 'gray.400'),
                        }}
                    />
                </HStack>
            </Box>
            <Box>
                <HStack>
                    <Text as={"bold"} fontSize={"md"}>Phase: </Text>
                    <Badge variant="solid" colorScheme="yellow">{phase}</Badge>
                </HStack>
            </Box>
        </HStack>
    )
}

export default TitleBar