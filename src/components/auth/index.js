import {Box, Stack, useColorModeValue} from '@chakra-ui/react';
import Logo from "../../Logo";
import Login from "./login";

export default function Auth() {
    return (
        <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
            <Stack align={'center'}>
                <Logo/>
            </Stack>
            <Box
                rounded={'lg'}
                bg={useColorModeValue('white', 'gray.700')}
                boxShadow={'lg'}
                p={8}>
                <Login/>
            </Box>
        </Stack>
    );
}