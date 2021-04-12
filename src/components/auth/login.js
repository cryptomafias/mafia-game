import React, {useContext, useEffect} from 'react'

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
import {LockIcon} from '@chakra-ui/icons'

import {createNotification} from "../notification"
import {IdentityContext, MetamaskContext, UserContext} from "../../App";
import {generatePrivateKey, identityToAccountId} from "../utils";
import {useHistory, useLocation} from "react-router-dom";
import {getGptContract} from "../../contracts/accounts";
import axios from "axios";

const initialState = {
    password: '',
}

const schema = yup.object().shape({
    password: yup.string().required("Password is required")
});


function Login({updateFormType}) {
    const {setUser} = useContext(UserContext)
    const {identity, setIdentity} = useContext(IdentityContext)
    const metamask = useContext(MetamaskContext)
    const {gptContract} = getGptContract(metamask.provider, metamask.signer)
    const history = useHistory()
    const location = useLocation()
    const {from} = location.state || {from: {pathname: "/"}};

    useEffect(() => {
        if (identity) {
            history.replace(from)
        }
    }, [identity, from, history])

    const onSubmit = async (values, {setSubmitting}) => {
        const {password} = values
        try {
            const newIdentity = await generatePrivateKey(metamask, password)
            const accountId = identityToAccountId(newIdentity)
            console.log(accountId)
            const gptURI = await gptContract.signIn(accountId)
            const userData = await axios.get(gptURI)
            setUser(userData.data)
            createNotification(
                "success",
                "Signed In",
                `You are now signed in with the public key: ${newIdentity.public.toString()}`
            )
            setSubmitting(false)
            setIdentity(newIdentity)
        } catch (err) {
            console.log(err)
            createNotification("error", err.name, err.message)
        }
    }
    return (
        <Formik initialValues={initialState} onSubmit={onSubmit} validationSchema={schema}>
            {(props) => (
                <Form>
                    <Stack spacing={4}>
                        <Field name="password">
                            {({field, form}) => (
                                <FormControl isInvalid={form.errors.password && form.touched.password}>
                                    <FormLabel htmlFor="password">Password</FormLabel>
                                    <InputGroup>
                                        <InputLeftElement
                                            pointerEvents="none"
                                            children={<LockIcon color="gray.300"/>}
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
                                Sign In
                            </Button>
                            <Stack
                                fontSize="md"
                                direction={{base: 'column', sm: 'row'}}
                                align={'start'}
                                justify={'space-between'}>
                                <Text>Don't have an account?</Text>
                                <Link color={'blue.400'} onClick={() => {
                                    updateFormType("SignUp")
                                }}>Sign Up</Link>
                            </Stack>
                        </Stack>
                    </Stack>
                </Form>
            )}
        </Formik>
    )
}

export default Login