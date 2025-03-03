const { ethers } = require("ethers");
const axios = require("axios");
const fs = require("fs");
const randomUseragent = require("random-useragent");
const { HttpsProxyAgent } = require("https-proxy-agent");
const chalk = require("chalk");

const RPC_URL = "https://rpc.edu-chain.raas.gelato.cloud";
const CONTRACT_ADDRESS = "0xAc8e0FA217DFA19Ba69057977b6bC335a73401cc";
const ABI = ["function mint(address recipient, uint256 tokenId, uint256 quantity, bytes data) public"];

const wallets = fs.readFileSync("wallet.txt", "utf-8").split(/\r?\n/).map(line => line.trim()).filter(line => line.length > 0);
const proxies = fs.readFileSync("proxy.txt", "utf-8").split(/\r?\n/).map(line => line.trim()).filter(line => line.length > 0).map(proxy => proxy.startsWith("http") ? proxy : `http://${proxy}`);
const tokens = fs.readFileSync("token.txt", "utf-8").split(/\r?\n/).map(line => line.trim()).filter(line => line.length > 0);

if (wallets.length !== tokens.length || proxies.length < wallets.length) {
  console.error(chalk.red("❌ Số lượng wallet và token phải bằng nhau, proxy phải đủ!"));
  process.exit(1);
}

let userAgents = wallets.map(() => randomUseragent.getRandom());

const mintNFT = async (walletIndex) => {
  const privateKey = wallets[walletIndex];
  const token = tokens[walletIndex];
  const proxy = proxies[walletIndex];
  const userAgent = userAgents[walletIndex];

  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const wallet = new ethers.Wallet(privateKey, provider);
  const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, wallet);

  const tokenId = Math.floor(Math.random() * 10) + 1;
  const agent = new HttpsProxyAgent(proxy);

  const headers = {
    Authorization: `Bearer ${token}`,
    "Api-Key": "d9b2d63d-a233-4123-845e-7b9209a8a001",
    Accept: "application/json, text/plain",
    Host: "launchpad.danlabs.xyz",
    Origin: "https://ed3.xyz",
    Referer: "https://ed3.xyz/",
    "Content-Type": "application/json; charset=utf-8",
    "User-Agent": userAgent,
  };

  try {
    const tx = await contract.mint(wallet.address, tokenId, 1, "0x");
    console.log(chalk.cyan(`🚀 Minting NFT for ${wallet.address} with tokenId: ${tokenId}...`));
    await tx.wait();
    console.log(chalk.green(`✅ Minted successfully! TX Hash: ${tx.hash}`));

    await updateTokenMetadata(wallet.address, tx.hash, tokenId, token, proxy, walletIndex, headers, agent);
  } catch (error) {
    console.log(chalk.red(`❌ Error minting NFT for ${wallet.address}: ${error.message}`));
  }
};

const updateTokenMetadata = async (wallet, hash, tokenId, token, proxy, walletIndex, headers, agent) => {
  const payload = {
    tokenAddress: CONTRACT_ADDRESS,
    tokenId: tokenId,
    mintable: true,
    amount: 1,
    txnHash: hash,
    chainId: "41923",
  };

  try {
    const response = await axios.put(
      `https://launchpad.danlabs.xyz/launchpad/updateTokenMetadata?wallet=${wallet}`,
      payload,
      { headers, httpsAgent: agent }
    );
  
    if (response.status === 200) {
      const totalMinted = response.data.data.total_minted;
      console.log(chalk.green(`✅ Success! Metadata updated for ${wallet}. Total minted: ${totalMinted}`));
    } else {
      console.log(chalk.red(`❌ Error updating metadata for ${wallet}: Unexpected status code ${response.status}`));
    }
  } catch (error) {
    if (error.response) {
      console.log(chalk.red(`❌ Error updating metadata for ${wallet}: ${JSON.stringify(error.response.data)}`));
    } else if (error.request) {
      console.log(chalk.red(`❌ No response received for ${wallet}: ${JSON.stringify(error.request)}`));
    } else {
      console.log(chalk.red(`❌ Error updating metadata for ${wallet}: ${error.message}`));
    }
  }};  

const startMinting = async () => {
  const loopLimit = 1000;

  let totalMinted = 0;
  let currentIndex = 0;

  while (totalMinted < wallets.length * loopLimit) {
    await mintNFT(currentIndex);
    totalMinted++;

    currentIndex = (currentIndex + 1) % wallets.length;

    await new Promise((resolve) => setTimeout(resolve, Math.random() * 700 + 1000));
  }

  console.log(chalk.green("✅ Completed minting for all wallets."));
};

startMinting();

process.on("SIGINT", () => {
  console.log(chalk.yellow("\n⏳ Shutting down..."));
  process.exit(0);
});
