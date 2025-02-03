import React, { useEffect, useState } from "react";
import axios from "axios";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { PhantomWalletAdapter, SolflareWalletAdapter } from "@solana/wallet-adapter-wallets";
import { clusterApiUrl } from "@solana/web3.js";

import PartnersMap from "./components/PartnersMap"; // ✅ FIX: Ensure correct relative path
import TokenAuth from "./components/TokenAuth";

// Default styles for the wallet modal
require("@solana/wallet-adapter-react-ui/styles.css");

const App = () => {
    const [walletAddress, setWalletAddress] = useState(null);
    const [locations, setLocations] = useState([]);
    const [userLocation, setUserLocation] = useState(null);
    const [username, setUsername] = useState("");
    const [isConnectedToX, setIsConnectedToX] = useState(false);

    // ✅ Set up Solana network
    const network = WalletAdapterNetwork.Devnet; // Change to Mainnet if needed
    const endpoint = clusterApiUrl(network);
    const wallets = [
        new PhantomWalletAdapter(),
        new SolflareWalletAdapter({ network }),
    ];

    // ✅ Fetch all pinned locations when the site loads
    useEffect(() => {
        axios.get("http://95.164.18.230:5000/api/locations/get-locations")
            .then(response => {
                console.log("Fetched locations:", response.data);
                setLocations(response.data);
            })
            .catch(error => console.error("❌ Error fetching locations:", error));
    }, []);

    return (
        <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={wallets} autoConnect>
                <WalletModalProvider>
                    <div className="bg-black min-h-screen text-white flex flex-col items-center relative">
                        {/* ✅ Token Authentication Section */}
                        <div className="absolute top-5 right-5 flex gap-4 z-50">
                            <TokenAuth setWalletAddress={setWalletAddress} />
                        </div>

                        {/* ✅ Partners Map Section */}
                        <div className="w-full max-w-6xl flex flex-col lg:flex-row mt-16">
                            <div className="flex-1 border border-white p-4 min-h-[500px] flex flex-col">
                                <h2 className="text-xl font-bold italic text-left">PARTNERS MAP</h2>
                                <PartnersMap 
                                    locations={locations} 
                                    userLocation={userLocation} 
                                    walletAddress={walletAddress}
                                />
                            </div>
                        </div>
                    </div>
                </WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    );
};

export default App;
