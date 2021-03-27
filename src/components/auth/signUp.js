import React, {useContext} from 'react'

import {Field, Form, Formik} from 'formik';
import * as yup from 'yup'
import {
    Button,
    FormControl,
    FormErrorMessage,
    FormLabel,
    Input,
    InputGroup,
    InputLeftElement,
    Link,
    Stack,
    Text
} from "@chakra-ui/react"
import {LockIcon, Icon} from '@chakra-ui/icons'

import {createNotification} from "../notification"
import {UserContext} from "../../App";
import {generatePrivateKey} from "./utils";
import {FaUser} from "react-icons/all";

const initialState = {
    username: '',
    password: '',
}

const schema = yup.object().shape({
    username: yup.string().required("Username is required"),
    password: yup.string().required("Password is required")
});


function SignUp({updateFormType}) {
    const {identity, setIdentity} = useContext(UserContext)

    const onSubmit = async (values, {setSubmitting}) => {
        const {password} = values
        try {
            const newIdentity = await generatePrivateKey(password)
            createNotification(
                "success",
                "Signed In",
                `You are now signed in with the public key: ${newIdentity.public.toString()}`
            )
            setIdentity(newIdentity)
            setSubmitting(false)
        } catch (err) {
            createNotification("error", err.name, err.message)
        }
    }
    return (
        <Formik initialValues={initialState} onSubmit={onSubmit} validationSchema={schema}>
            {(props) => (
                <Form>
                    <Stack spacing={4}>
                        <Field name="username">
                            {({field, form}) => (
                                <FormControl isInvalid={form.errors.username && form.touched.username}>
                                    <FormLabel htmlFor="username">Username</FormLabel>
                                    <InputGroup>
                                        <InputLeftElement
                                            pointerEvents="none"
                                            children={<Icon as={FaUser} color="gray.300" />}
                                        />
                                        <Input {...field} id="username" placeholder="username"/>
                                    </InputGroup>
                                    <FormErrorMessage>{form.errors.username}</FormErrorMessage>
                                </FormControl>
                            )}
                        </Field>
                        <Field name="password">
                            {({field, form}) => (
                                <FormControl isInvalid={form.errors.password && form.touched.password}>
                                    <FormLabel htmlFor="password">Password</FormLabel>
                                    <InputGroup>
                                        <InputLeftElement
                                            pointerEvents="none"
                                            children={<LockIcon color="gray.300" />}
                                        />
                                        <Input {...field} id="password" placeholder="password" type="password"/>
                                    </InputGroup>
                                    <FormErrorMessage>{form.errors.password}</FormErrorMessage>
                                </FormControl>
                            )}
                        </Field>
                        <Stack spacing={10}>
                            <Button
                                isLoading={props.isSubmitting}
                                type="submit"
                                bg={'blue.400'}
                                color={'white'}
                                _hover={{
                                    bg: 'blue.500',
                                }}>
                                Sign Up
                            </Button>
                            <Stack
                                fontSize="md"
                                direction={{ base: 'column', sm: 'row' }}
                                align={'start'}
                                justify={'space-between'}>
                                <Text>Already have an account?</Text>
                                <Link color={'blue.400'} onClick={() => {updateFormType("SignIn")}}>Login</Link>
                            </Stack>
                        </Stack>
                    </Stack>
                </Form>
            )}
        </Formik>
    )
}

export default SignUp