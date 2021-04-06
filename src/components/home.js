import React from "react"
import {Button, Stack} from '@chakra-ui/react';
import {useHistory} from "react-router-dom";
import Container from "./Container";


function Home() {
    const history = useHistory()
    return (
        <Container>
            <Stack spacing={4}>
                <Button
                    width="200px"
                    bg={'blue.400'}
                    color={'white'}
                    onClick={() => {
                        history.push("/room")
                    }}
                    _hover={{
                        bg: 'blue.500',
                    }}>
                    play
                </Button>
                <Button
                    width="200px"
                    bg={'blue.400'}
                    color={'white'}
                    onClick={() => {
                        history.push("/profile")
                    }}
                    _hover={{
                        bg: 'blue.500',
                    }}>
                    profile
                </Button>
                <Button
                    width="200px"
                    bg={'blue.400'}
                    color={'white'}
                    _hover={{
                        bg: 'blue.500',
                    }}>
                    store
                </Button>
            </Stack>
        </Container>
    );
}

export default Home