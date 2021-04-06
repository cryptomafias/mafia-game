import React from "react"
import {
    Button,
    FormControl,
    FormErrorMessage,
    Input,
    InputGroup,
    InputLeftElement,
    Stack,
    Text
} from '@chakra-ui/react';
import {useHistory} from "react-router-dom";
import Container from "./Container";
import {Field, Form, Formik} from "formik";
import * as yup from "yup";
import {ImEnter} from "react-icons/all";


const initialState = {
    roomId: '',
}

const schema = yup.object().shape({
    roomId: yup.string().required("Room ID is required")
});

function Room() {
    const history = useHistory()
    const onJoinRoom = () => {
    }
    const onCreateRoom = () => {
    }

    return (
        <Container>
            <Stack spacing={4}>
                <Formik initialValues={initialState} onSubmit={onJoinRoom} validationSchema={schema}>
                    {(props) => (
                        <Form>
                            <Stack spacing={4}>
                                <Button
                                    isLoading={props.isSubmitting}
                                    type="submit"
                                    bg={'blue.400'}
                                    color={'white'}
                                    onClick={onCreateRoom}
                                    _hover={{
                                        bg: 'blue.500',
                                    }}>
                                    Create Room
                                </Button>
                            </Stack>
                        </Form>
                    )}
                </Formik>
                <Text>or</Text>
                <Formik initialValues={initialState} onSubmit={onJoinRoom} validationSchema={schema}>
                    {(props) => (
                        <Form>
                            <Stack spacing={4}>
                                <Field name="roomId">
                                    {({field, form}) => (
                                        <FormControl isInvalid={form.errors.roomId && form.touched.roomId}>
                                            <InputGroup>
                                                <InputLeftElement
                                                    pointerEvents="none"
                                                    children={<ImEnter color="gray.300"/>}
                                                />
                                                <Input {...field} id="roomId" placeholder="Enter Room ID"/>
                                            </InputGroup>
                                            <FormErrorMessage>{form.errors.roomId}</FormErrorMessage>
                                        </FormControl>
                                    )}
                                </Field>
                                <Button
                                    isLoading={props.isSubmitting}
                                    type="submit"
                                    bg={'blue.400'}
                                    color={'white'}
                                    onClick={onJoinRoom}
                                    _hover={{
                                        bg: 'blue.500',
                                    }}>
                                    Join Room
                                </Button>
                            </Stack>
                        </Form>
                    )}
                </Formik>
            </Stack>
        </Container>
    );
}

export default Room