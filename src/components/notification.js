import {createStandaloneToast} from "@chakra-ui/react";

export const createNotification = (status, title, description) => {
    const toast = createStandaloneToast()
    toast({
        title: title,
        description: description,
        status: status,
        duration: 9000,
        isClosable: true,
        position: "bottom-right"
    })
}