import {useState} from "react";
import {Box, Stack, useColorModeValue} from '@chakra-ui/react';

import Logo from "../../Logo";
import Login from "./login";
import SignUp from "./signUp";

export default function Auth({currentForm}) {
    const [formType, updateFormType] = useState(currentForm)

    function renderForm() {
        switch (formType) {
            case 'SignUp':
                return (
                    <SignUp updateFormType={updateFormType}/>
                )
            case 'SignIn':
                return (
                    <Login updateFormType={updateFormType}/>
                )
            default:
                return null
        }
    }
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
                {renderForm()}
            </Box>
        </Stack>
    );
}