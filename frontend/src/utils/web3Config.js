import { BrowserProvider } from "ethers";

export const getProvider = () => {
    if (window.ethereum) {
        console.log("✅ Ethereum provider detected!");
        return new BrowserProvider(window.ethereum); // ✅ Correct for Ethers v6
    } else {
        console.error("❌ No Ethereum wallet found.");
        alert("MetaMask is required to connect your wallet.");
        return null;
    }
};
