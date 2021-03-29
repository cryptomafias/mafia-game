import {BigNumber, providers, utils} from "ethers";
import {PrivateKey, Client, Users, Buckets} from "@textile/hub";
import {keccak256} from "ethers/lib/utils";
import toBuffer from "it-to-buffer";

const KEY = {key: 'bwkrt36qlemdl2zfvgkp6dthvjy'}

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

const getSignerAndProvider = async () => {
    if (!window.ethereum) {
        throw new Error(
            'Ethereum is not connected. Please download Metamask from https://metamask.io/download.html'
        );
    }

    console.debug('Initializing web3 provider...');
    const provider = new providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    return {provider, signer}
}

export const getMetamask = async () => {
    const {signer, provider} = await getSignerAndProvider()
    // @ts-ignore
    const accounts = await window.ethereum.request({method: 'eth_requestAccounts'});
    if (accounts.length === 0) {
        throw new Error('No account is provided. Please provide an account to this application.');
    }

    const address = accounts[0];

    return {address, provider, signer}
}

export const generatePrivateKey = async (metamask, password) => {
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

    // Your app can now use this identity for generating a user Mailbox, Threads, Buckets, etc
    return identity
}

async function initClient(identity){
    const client = await Client.withKeyInfo(KEY)
    await client.getToken(identity)
    return client
}

async function initUsers(identity){
    const users = await Users.withKeyInfo(KEY)
    await users.getToken(identity)
    return users
}

async function initBuckets(identity){
    const buckets = await Buckets.withKeyInfo(KEY)
    await buckets.getToken(identity)
    return buckets
}

export async function getHub(identity) {
    if(identity){
        const client = await initClient(identity)
        const users = await initUsers(identity)
        const buckets = await initBuckets(identity)
        const hub = {
            client,
            users,
            buckets
        }
        return hub
    }
    return {}
}

export function identityToAccountId(identity){
    const pubKey = identity.public.bytes
    return BigNumber.from(keccak256(pubKey))
}

export const pushFile = async (buckets, name, data, bucketKey) => {
    const content = JSON.stringify(data)
    const file = { path: `/${name}.json`, content: Buffer.from(content) }
    await buckets.pushPath(bucketKey, `/${name}.json`, file)
}

export const pullFile = async (buckets, path, key) => {
    const buf = await toBuffer(buckets.pullPath(key, path))
    return JSON.parse(Buffer.from(buf).toString("utf-8"))
}

export const getIpnsLink = async (buckets, bucketKey) => {
    const links = await buckets.links(bucketKey)
    return links.ipns
}
