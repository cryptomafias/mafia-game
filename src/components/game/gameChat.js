import {
    Box,
    FormControl,
    Input,
    InputGroup,
    InputRightAddon,
    Stack,
    Text,
    useColorModeValue,
    VStack
} from '@chakra-ui/react';
import React, {useContext, useEffect, useState} from "react";
import {HubContext, IdentityContext} from "../../App";
import {Field, Form, Formik} from "formik";
import * as yup from "yup";
import {debounceByArgs} from "../utils";
import {PrivateKey} from "@textile/hub";
import {PolyAES} from "poly-crypto";

const initialState = {
    message: ""
}

const schema = yup.object().shape({
    message: yup.string().required("Message can't be empty!")
});

function Message({players, message, setGetRole}) {
    const {identity} = useContext(IdentityContext)
    const notificationColor = useColorModeValue('red', 'tomato')

    if (message.type === "CHAT" && message.to === "ALL") {
        const playerIdx = players.indexOf(message.from)
        console.log(`${playerIdx + 1}: ${message.message}`)
        return (
            <Text fontSize={"md"}>{`${playerIdx + 1}`}: {message.message}</Text>
        )
    } else if (message.type === "SYSTEM" && message.to === "ALL") {
        let notification
        const playerIdx = message.message === "none" ? "none" : players.indexOf(message.from)
        if (message.subject === "DEAD_PLAYER") {
            notification = `${playerIdx} has been killed during night!`
        } else if (message.subject === "EJECTED_PLAYER") {
            notification = `${playerIdx} has been voted out!`
        }
        return (
            <Text color={notificationColor} fontSize={"md"}>Notification: {notification}</Text>
        )
    } else if (message.type === "SYSTEM" && message.to === identity.public.toString()) {
        if (message.subject === "RoleAssignment") {
            const getRole = async () => {
                const data = JSON.parse(message.message)
                const privKey = PrivateKey.fromString(identity.toString())
                const hexKey = await privKey.decrypt(Buffer.from(data.encryptedHexKey))
                const role = PolyAES.withKey(hexKey.toString()).decrypt(data.encryptedRole)
                return role
            }
            setGetRole(getRole)
        }
    }
    return null
}


function GameChat({threads, players, setPlayerToRole}) {
    const hub = useContext(HubContext)
    const {identity} = useContext(IdentityContext)
    const [messages, setMessages] = useState([])
    const [getRole, setGetRole] = useState(null)
    const BoxBG = useColorModeValue('gray.200', 'gray.600')

    const sendMessage = async (values, {setSubmitting, resetForm}) => {
        const message = {
            subject: "",
            message: values.message,
            to: "ALL",
            from: identity.public.toString(),
            type: "CHAT"
        }
        await hub.client.create(threads.villagerThread, "chat", [message])
        setSubmitting(false)
        resetForm()
    }

    function serverAction({role,phase,playerId,victimId}){
      if(phase == "NIGHT")
      {
        if(role == "MAFIA")
        {   
            killVote(playerId,victimId);
        }
        else if(role == "DETECTIVE"){
            inspect(playerId,victimId);
        }
        else if(role=="DOCTOR"){
            heal(playerId,victimId);
        }
      }
      else if (phase == "VOTING")
      {
            ejectVote(playerId,victimId);
      }
    }
    
    function killVote({playerId,victimId})
    {
        const body = [{"playerId":playerId},{"victimId":victimId}];
        const res = await axios.put('https://cryptomafias-api.herokuapp.com/rooms/'+roomId+'killVote',{body});
    }
    
    function ejectVote({playerId,victimId})
    {
        const body = [{"playerId":playerId},{"victimId":victimId}];
        const res = await axios.put('https://cryptomafias-api.herokuapp.com/rooms/'+roomId+'vote',{}).then(res=>{console.log(res)})
    }
    
    function inspect({playerId,victimId}){
        const body = [{"playerId":playerId},{"victimId":victimId}];
        const res = await axios.get('https://cryptomafias-api.herokuapp.com/rooms/'+roomId+'inspect',{body}).then(res=>{console.log(res)})
    }
    
    function heal({playerId,victimId}){
      const body = [{"playerId":playerId},{"victimId":victimId}];
      const res = axios.put('https://cryptomafias-api.herokuapp.com/rooms/'+roomId+'heal',{body}).then(res=>{console.log(res)})
    }

    useEffect(() => {
        const fetch = async () => {
            if (getRole) {
                const role = await getRole()
                setPlayerToRole(playerToRole => {
                    playerToRole[identity.public.toString()] = role
                    return playerToRole
                })
            }
        }
        fetch()
    }, [getRole, identity, setPlayerToRole])

    useEffect(() => {
        let subMessage
        const receiveMessage = debounceByArgs((update) => {
            console.log(update)
            if (!update) {
                // fetch();
                return;
            } // hack for undefined callback
            if (update.collectionName !== "chat") return
            if (update.action === "CREATE") {
                setMessages((messages) => ([...messages, update.instance]))
            }
        }, 1500)
        const fetch = async () => {
            console.log("fetching")
            if (hub && hub.hasOwnProperty("client") && threads && threads.hasOwnProperty("villagerThread")) {
                console.log("chats loading")
                const initMessages = await hub.client.find(threads.villagerThread, 'chat', {})
                setMessages(initMessages)
                console.log(initMessages)
                subMessage = await hub.client.listen(threads.villagerThread, [{
                        collectionName: "chat"
                    }],
                    receiveMessage
                )
            }
        }
        fetch()
        return (setTimeout(() => {
            if (subMessage) {
                subMessage.close()
            }
        }), 10000)
    }, [hub, threads])

    return (
        <VStack spacing={2}>
            <Box
                w="650px"
                h="170px"
                rounded="5px"
                overflow="hidden"
                boxShadow="md"
                bg={BoxBG}
                align="left"
                pl={2}
                overflowY='scroll'
            >
                {
                    messages.map(message => (
                        <Message key={message._id} players={players} message={message} setGetRole={setGetRole}/>
                    ))
                }
            </Box>
            <Formik initialValues={initialState} onSubmit={sendMessage} validationSchema={schema}>
                {(props) => (
                    <Form>
                        <Stack spacing={4} w="650px">
                            <Field name="message">
                                {({field, form}) => (
                                    <FormControl isInvalid={form.errors.message && form.touched.message}>
                                        <InputGroup width='full'>
                                            <Input {...field} id={"message"} bg={BoxBG}/>
                                            <InputRightAddon as='button' children='send' type="submit"
                                                             disabled={props.isSubmitting}/>
                                        </InputGroup>
                                    </FormControl>
                                )}
                            </Field>
                        </Stack>
                    </Form>
                )}
            </Formik>
        </VStack>
    )
}

export default GameChat;
