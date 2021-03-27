import {Contract} from 'ethers'

const gptAddress = ""
const gptABI = [
    "function signUp(string memory accountURI, uint256 accountID) external returns (uint256)",
    "function signIn(uint256 accountID) external view returns (bool)",
    "function deleteAccount(uint accountID) external",
    "function tokenURI(uint256 tokenId) public view virtual override returns (string memory)",
    "event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)"
]

export function getContract(provider, signer){
    const gptContract = new Contract(gptAddress, gptABI, provider)
    const gptSigner = gptContract.connect(signer)
    return {gptContract, gptSigner}
}
