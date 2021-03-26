import React, {useContext} from 'react'
import {PrivateKey} from '@textile/hub'
import {BigNumber, providers, utils} from 'ethers'

import {Field, Form, Formik} from 'formik';
import * as yup from 'yup'
import {UserContext} from "../../App";
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
} from "@chakra-ui/react";
import { LockIcon } from '@chakra-ui/icons'

const initialState = {
    password: '',
}

const schema = yup.object().shape({
    password: yup.string().required("Password is required")
});


function Login() {
    const {identity, setIdentity} = useContext(UserContext)

    const generateMessageForEntropy = (ethereum_address, application_name, secret) => (
        '******************************************************************************** \n' +
        'READ THIS MESSAGE CAREFULLY. \n' +
        'DO NOT SHARE THIS SIGNED MESSAGE WITH ANYONE OR THEY WILL HAVE READ AND WRITE \n' +
        'ACCESS TO THIS APPLICATION. \n' +
        'DO NOT SIGN THIS MESSAGE IF THE FOLLOWING IS NOT TRUE OR YOU DO NOT CONSENT \n' +
        'TO THE CURRENT APPLICATION HAVING ACCESS TO THE FOLLOWING APPLICATION. \n' +
        '******************************************************************************** \n' +
        'The Ethereum address used by this application is: \n' +
        '\n' +
        ethereum_address +
        '\n' +
        '\n' +
        '\n' +
        'By signing this message, you authorize the current application to use the \n' +
        'following app associated with the above address: \n' +
        '\n' +
        application_name +
        '\n' +
        '\n' +
        '\n' +
        'your non-recoverable, private, non-persisted password or secret \n' +
        'phrase is: \n' +
        '\n' +
        secret +
        '\n' +
        '\n' +
        '\n' +
        '******************************************************************************** \n' +
        'ONLY SIGN THIS MESSAGE IF YOU CONSENT TO THE CURRENT PAGE ACCESSING THE KEYS \n' +
        'ASSOCIATED WITH THE ABOVE ADDRESS AND APPLICATION. \n' +
        'AGAIN, DO NOT SHARE THIS SIGNED MESSAGE WITH ANYONE OR THEY WILL HAVE READ AND \n' +
        'WRITE ACCESS TO THIS APPLICATION. \n' +
        '******************************************************************************** \n'
    )

    const getSigner = async () => {
        if (!window.ethereum) {
            throw new Error(
                'Ethereum is not connected. Please download Metamask from https://metamask.io/download.html'
            );
        }

        console.debug('Initializing web3 provider...');
        const provider = new providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        return signer
    }

    const getAddressAndSigner = async () => {
        const signer = await getSigner()
        // @ts-ignore
        const accounts = await window.ethereum.request({method: 'eth_requestAccounts'});
        if (accounts.length === 0) {
            throw new Error('No account is provided. Please provide an account to this application.');
        }

        const address = accounts[0];

        return {address, signer}
    }

    const generatePrivateKey = async (password) => {
        const metamask = await getAddressAndSigner()
        // avoid sending the raw secret by hashing it first
        const secret = password
        const message = generateMessageForEntropy(metamask.address, 'Notes', secret)
        const signedText = await metamask.signer.signMessage(message);
        const hash = utils.keccak256(signedText);
        if (hash === null) {
            throw new Error('No account is provided. Please provide an account to this application.');
        }
        // The following line converts the hash in hex to an array of 32 integers.
        // @ts-ignore
        const array = hash
            // @ts-ignore
            .replace('0x', '')
            // @ts-ignore
            .match(/.{2}/g)
            .map((hexNoPrefix) => BigNumber.from('0x' + hexNoPrefix).toNumber())

        if (array.length !== 32) {
            throw new Error('Hash of signature is not the correct size! Something went wrong!');
        }
        const identity = PrivateKey.fromRawEd25519Seed(Uint8Array.from(array))
        console.log(identity.toString())

        createNotification(identity)

        // Your app can now use this identity for generating a user Mailbox, Threads, Buckets, etc
        return identity
    }

    const createNotification = (identity) => {
        // dispatchCustomEvent({
        //     name: "create-notification", detail: {
        //         id: 1,
        //         description: `PubKey: ${identity.public.toString()}. Your app can now generate and reuse this users PrivateKey for creating user Mailboxes, Threads, and Buckets.`,
        //         timeout: 5000,
        //     }
        // })
    }

    const onSubmit = async (values, {setSubmitting}) => {
        const {password} = values
        try {
            const newIdentity = await generatePrivateKey(password)
            console.log(newIdentity)
            setIdentity(newIdentity)
            setSubmitting(false)
        } catch (err) {
            alert(err)
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
                                            children={<LockIcon color="gray.300" />}
                                        />
                                        <Input {...field} id="password" placeholder="password" type="password"/>
                                    </InputGroup>
                                    <FormErrorMessage>{form.errors.name}</FormErrorMessage>
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
                                Sign in
                            </Button>
                            <Stack
                                fontSize="md"
                                direction={{ base: 'column', sm: 'row' }}
                                align={'start'}
                                justify={'space-between'}>
                                <Text>Don't have an account?</Text>
                                <Link color={'blue.400'}>Sign Up</Link>
                            </Stack>
                        </Stack>
                    </Stack>
                </Form>
            )}
        </Formik>
    )
}

export default Login