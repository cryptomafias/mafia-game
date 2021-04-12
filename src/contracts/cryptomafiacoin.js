import {Contract} from 'ethers'

const gptAddress = "0x91D89b2F9B8cb1873546Ce99E4166AD05264cB76"

const gptABI = [
    "function joinRoom() public",
    "function distributeReward(uint256[] memory playerIds) public onlyGameMaster"
]

export function getGptContract(provider, signer) {
    const gptContract = new Contract(gptAddress, gptABI, provider)
    const gptSigner = gptContract.connect(signer)
    return {gptContract, gptSigner}
}