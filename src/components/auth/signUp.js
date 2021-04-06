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
import {Icon, LockIcon} from '@chakra-ui/icons'

import {createNotification} from "../notification"
import {IdentityContext, MetamaskContext, UserContext} from "../../App";
import {generatePrivateKey, initBuckets, getIpnsLink, identityToAccountId, pushFile} from "../utils";
import {FaUser} from "react-icons/all";
import {getGptContract} from "../../contracts/accounts";
import {useHistory, useLocation} from "react-router-dom";

const initialState = {
    username: '',
    password: '',
}

const schema = yup.object().shape({
    username: yup.string().required("Username is required"),
    password: yup.string().required("Password is required")
});


function SignUp({updateFormType}) {
    const {setUser} = useContext(UserContext)
    const {identity, setIdentity} = useContext(IdentityContext)
    const metamask = useContext(MetamaskContext)
    const {gptSigner} = getGptContract(metamask.provider, metamask.signer)
    const history = useHistory()
    const location = useLocation()
    const {from} = location.state || {from: {pathname: "/"}};

    useEffect(() => {
        if (identity) {
            history.replace(from)
        }
    }, [identity, from, history])

    const onSubmit = async (values, {setSubmitting}) => {
        const {username, password} = values
        try {
            const newIdentity = await generatePrivateKey(metamask, password)
            const buckets = await initBuckets(newIdentity)
            const buck = await buckets.getOrCreate('profiles')
            console.log(buck)
            const userData = {
                name: username,
            }
            await pushFile(
                buckets,
                newIdentity.public.toString(),
                userData,
                buck.root.key
            )
            console.log("file")
            const ipnsLink = await getIpnsLink(buckets, buck.root.key)
            console.log(ipnsLink)
            const accountId = identityToAccountId(newIdentity)
            await gptSigner.signUp(`${ipnsLink}/${newIdentity.public.toString()}.json`, accountId)
            createNotification(
                "success",
                "Signed Up",
                `Your new account has been created with the public key: ${newIdentity.public.toString()}`
            )
            createNotification(
                "success",
                "Signed In",
                `You are now signed in with the public key: ${newIdentity.public.toString()}`
            )
            setSubmitting(false)
            setUser(userData)
            setIdentity(newIdentity)
        } catch (err) {
            console.error(err)
            createNotification("error", err.name, err.message)
            throw err
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
                                            children={<Icon as={FaUser} color="gray.300"/>}
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
                                Sign Up
                            </Button>
                            <Stack
                                fontSize="md"
                                direction={{base: 'column', sm: 'row'}}
                                align={'start'}
                                justify={'space-between'}>
                                <Text>Already have an account?</Text>
                                <Link color={'blue.400'} onClick={() => {
                                    updateFormType("SignIn")
                                }}>Login</Link>
                            </Stack>
                        </Stack>
                    </Stack>
                </Form>
            )}
        </Formik>
    )
}

export default SignUp