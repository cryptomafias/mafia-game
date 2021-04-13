import {Contract} from 'ethers'

const gptAddress = "0x0059915f5b41Fbbdd9059f028AC8EcDFf15Ff6d2"

const gptABI = [

"function requestRandomNumber(uint256 userProvidedSeed, uint256 roomId) external returns (bytes32 requestId);",
"function getRandomNumber(uint256 roomNumber) external view returns (uint256);"
]

export function getGptContract(provider, signer) {
    const gptContract = new Contract(gptAddress, gptABI, provider)
    const gptSigner = gptContract.connect(signer)
    return {gptContract, gptSigner}
}