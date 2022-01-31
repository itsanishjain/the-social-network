import React from "react";
import Head from "next/head";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import SocialNetworkABI from "../SocailNetwork.json";
import { hasEthereum } from "../utils";
import Board from "../src/components/Board";
import toast from "../src/components/Toast";

export default function Home() {
  const [connectedWalletAddress, setConnectedWalletAddressState] = useState("");
  const [allPost, setAllPostState] = useState();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  // If wallet is already connected...
  useEffect(() => {
    if (!hasEthereum()) {
      notify("error", "MetaMask unavailable");
      setConnectedWalletAddressState(`MetaMask unavailable`);
      setLoading(false);
      return;
    }
    fetchAllPosts();
  }, []);

  const notify = React.useCallback((type, message) => {
    toast({ type, message });
  }, []);

  // Call smart contract, fetch all posts
  async function fetchAllPosts() {
    if (!hasEthereum()) {
      setConnectedWalletAddressState(`MetaMask unavailable`);
      return;
    }
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = new ethers.Contract(
      process.env.NEXT_PUBLIC_SOCIALNETWORK_ADDRESS,
      SocialNetworkABI,
      provider
    );
    try {
      const data = await contract.allPosts();
      console.log("ALL POSTS", data);
      setAllPostState(data);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  }

  return (
    <div className="App">
      <Head>
        <title>web3-job-board</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="recipe">
        hey, I am Social Network Dapp used to share posts and comments in
        decentralized way. I am using MetaMask to connect to the Ethereum and
        Avalanche blockchain for all things related to the blockchain.
        <p className="error">Running on Avalanche Testnet</p>
      </div>

      {loading ? (
        <div className="loader-center">
          <div className="loader"></div>
        </div>
      ) : (
        allPost &&
        allPost.map((post, index) => (
          <div key={index}>
            <Board
              id={index}
              user={post.user}
              imageUrl={
                post.imageUrl.startsWith("http")
                  ? post.imageUrl
                  : `https://ipfs.io/ipfs/${post.imageUrl}`
              }
            />
            <div style={{ marginTop: "15px" }}></div>
          </div>
        ))
      )}
    </div>
  );
}
