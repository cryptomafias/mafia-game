import React, {useContext} from "react"
import {IdentityContext, UserContext} from "../App";
import {Heading, IconButton, Stack, Text, useClipboard, useColorModeValue} from "@chakra-ui/react";
import Avatar from "./Avatar";
import Container from "./Container";
import {FaCopy} from "react-icons/all";
import {createNotification} from "./notification";

function Profile() {
    const {user} = useContext(UserContext)
    const {identity} = useContext(IdentityContext)
    const { onCopy } = useClipboard(identity.public.toString())
    const onClick = () => {
        onCopy()
        createNotification("success", "copied to clipboard")
    }
    return (
        <Container>
            <Stack spacing={4}>
                <Stack align={'center'}>
                    <Avatar value={identity.public.toString()}/>
                </Stack>
                <Heading fontSize={'2xl'} fontFamily={'body'}>
                    {user.name}
                </Heading>
                <Text fontWeight={600} color={'gray.500'} mb={4}>
                    @{identity.public.toString()}
                    <IconButton
                        variant="ghost"
                        color={'gray.500'}
                        onClick={onClick}
                        aria-label="copy"
                        icon={<FaCopy />}
                        _hover={{
                            color: useColorModeValue('gray.600', 'gray.400'),
                        }}
                    />
                </Text>
            </Stack>
        </Container>
    )
}

export default Profile