// WalletConnect.jsx
import React from "react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { FaWallet } from "react-icons/fa";

const WalletConnect = () => {
  const { publicKey, connected } = useWallet();

  return (
    <WalletMultiButton
      className="!bg-green-500 !text-black !px-6 !py-3 !rounded-full !border-2 !border-black hover:!bg-green-400 transition-all duration-300 !text-lg !font-bold !shadow-lg hover:!shadow-green-500/50 hover:!-translate-y-1"
      startIcon={<FaWallet size={20} />}
    >
      <span className="italic">
        {connected ? `Connected: ${publicKey.toBase58().slice(0, 6)}...` : "CONNECT WALLET"}
      </span>
    </WalletMultiButton>
  );
};

export default WalletConnect;
