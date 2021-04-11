import {Contract} from 'ethers'

const gptAddress = "0xB4341D98e12B6e93dcf231dd615B16d8b208C83c"
const gptABI = [
    "function signUp(string memory accountURI, uint256 accountID) external returns (uint256)",
    "function signIn(uint256 accountID) external view returns (string memory)",
    "function deleteAccount(uint accountID) external",
    "function tokenURI(uint256 tokenId) public view virtual override returns (string memory)",
    "event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)",
    "function ownerOf(uint256 tokenId) public view virtual returns (address)"
]

export function getGptContract(provider, signer) {
    const gptContract = new Contract(gptAddress, gptABI, provider)
    const gptSigner = gptContract.connect(signer)
    return {gptContract, gptSigner}
}
