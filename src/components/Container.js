import {Box, Stack, useColorModeValue} from "@chakra-ui/react";
import React from "react";

function Container({children}) {
    return (
        <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
            <Box
                rounded={'lg'}
                bg={useColorModeValue('white', 'gray.700')}
                boxShadow={'lg'}
                p={8}>
                {children}
            </Box>
        </Stack>
    )
}

export default Container