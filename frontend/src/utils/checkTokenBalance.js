import { Contract, parseUnits, BrowserProvider } from "ethers";

const TOKEN_ADDRESS = "0xYourTokenContractAddress"; // Replace with your token contract address
const MINIMUM_BALANCE = parseUnits("1", 18); // 1 token, assuming 18 decimal places

export const checkTokenBalance = async (address) => {
    try {
        if (!window.ethereum) {
            console.error("No Ethereum provider found.");
            return false;
        }

        if (!address) {
            console.error("Invalid wallet address.");
            return false;
        }

        const provider = new BrowserProvider(window.ethereum); // ✅ Use BrowserProvider for v6
        const signer = await provider.getSigner(); // ✅ Ensure signer is awaited

        const tokenContract = new Contract(
            TOKEN_ADDRESS,
            ["function balanceOf(address owner) view returns (uint256)"],
            signer
        );

        const balance = await tokenContract.balanceOf(address);
        console.log(`Token Balance: ${balance.toString()}`);

        return balance >= MINIMUM_BALANCE; // ✅ Ensure correct balance comparison
    } catch (error) {
        console.error("Error checking token balance:", error);
        return false;
    }
};
