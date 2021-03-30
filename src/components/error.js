import React from "react"
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    useDisclosure,
} from "@chakra-ui/react"

function ErrorFallback({error, resetErrorBoundary}) {
    const {onClose} = useDisclosure()
    const close = () => {
        onClose()
        resetErrorBoundary()
    }
    return (
        <Modal isOpen={true} onClose={onClose}>
            <ModalOverlay/>
            <ModalContent>
                <ModalHeader>Oops, something went wrong!</ModalHeader>
                <ModalCloseButton/>
                <ModalBody>
                    {error.message}
                </ModalBody>
                <ModalFooter>
                    <Button colorScheme="blue" mr={3} onClick={close}>
                        Close
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export default ErrorFallback