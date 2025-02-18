const { ethers } = require("ethers");
const axios = require("axios");
const fs = require("fs");
const randomUseragent = require("random-useragent");
const { HttpsProxyAgent } = require("https-proxy-agent");
const blessed = require("blessed");
const contrib = require("blessed-contrib");
const readline = require("readline");
const chalk = require("chalk");

const RPC_URL = "https://rpc.edu-chain.raas.gelato.cloud";
const CONTRACT_ADDRESS = "0x153d7e04Cdc4423B42a4407274C9D1f94a2720c5";
const ABI = ["function mint(address recipient, uint256 tokenId, uint256 quantity, bytes data) public"];

const wallets = fs.readFileSync("wallet.txt", "utf-8")
  .split(/\r?\n/).map(line => line.trim()).filter(line => line.length > 0);

const proxies = fs.readFileSync("proxy.txt", "utf-8")
  .split(/\r?\n/).map(line => line.trim()).filter(line => line.length > 0)
  .map(proxy => proxy.startsWith("http") ? proxy : `http://${proxy}`);

const tokens = fs.readFileSync("token.txt", "utf-8")
  .split(/\r?\n/).map(line => line.trim()).filter(line => line.length > 0);

if (wallets.length !== tokens.length || proxies.length < wallets.length) {
  console.error("❌ Số lượng wallet và token phải bằng nhau, proxy phải đủ!");
  process.exit(1);
}

const screen = blessed.screen();
const grid = new contrib.grid({ rows: 14, cols: 12, screen }); 

const bannerText = "Auto Mint NFT ED3 - by Mob";
const screenWidth = process.stdout.columns || 80;
const centeredText = bannerText.padStart((screenWidth + bannerText.length) / 2); 

const smallTextBox = blessed.box({
  top: 0,
  left: 'center',
  width: '100%',
  height: 1,
  content: chalk.cyanBright(centeredText),
  tags: true,
  style: {
    fg: 'cyan',
    bg: 'black',
    bold: true,
  },
});

screen.append(smallTextBox);

const tableLeft = grid.set(2, 0, 4, 4, contrib.table, {
  keys: true,
  label: "Wallets",
  columnSpacing: 2,
  columnWidth: [42],
});

const tableCenter = grid.set(2, 4, 4, 4, contrib.table, {
  keys: true,
  label: "Proxies",
  columnSpacing: 2,
  columnWidth: [42],
});

const tableRight = grid.set(2, 8, 4, 4, contrib.table, {
  keys: true,
  label: "NFT Mint Count",
  columnSpacing: 2,
  columnWidth: [42],
});

const logBox = grid.set(6, 0, 8, 12, blessed.log, {
  label: "Logs",
  tags: true,
  scrollable: true,
  alwaysScroll: true,
  scrollbar: { ch: " ", inverse: true },
});

screen.render();

let userAgents = wallets.map(() => randomUseragent.getRandom());

let mintStatus = wallets.map((wallet, index) => ({
  wallet,
  proxy: proxies[index] || "N/A",
  nftMinted: 0,
}));

const updateTableData = () => {
  tableLeft.setData({
    headers: ["Wallet"],
    data: mintStatus.map(entry => [entry.wallet]),
  });

  tableCenter.setData({
    headers: ["Proxy"],
    data: mintStatus.map(entry => [entry.proxy]),
  });

  tableRight.setData({
    headers: ["NFT Minted"],
    data: mintStatus.map(entry => [entry.nftMinted]),
  });

  screen.render();
};

const logMessage = (message, color = "white") => {
  logBox.log(chalk[color](message));
  screen.render();
};

const mintNFT = async (walletIndex) => {
  const privateKey = wallets[walletIndex];
  const token = tokens[walletIndex];
  const proxy = proxies[walletIndex];
  const userAgent = userAgents[walletIndex];

  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const wallet = new ethers.Wallet(privateKey, provider);
  const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, wallet);

  const tokenId = Math.floor(Math.random() * 4) + 1;

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
    logMessage(`🚀 ${chalk.blue("Minting NFT")} for ${wallet.address} with tokenId: ${tokenId}...`, 'cyan');
    await tx.wait();
    logMessage(`${chalk.green("✅ Minted successfully!")} TX Hash: ${tx.hash}`, 'green');

    mintStatus[walletIndex].nftMinted++;
    updateTableData();

    await updateTokenMetadata(wallet.address, tx.hash, tokenId, token, proxy, walletIndex, headers, agent);
  } catch (error) {
    logMessage(`${chalk.red("❌ Error minting NFT")} for ${wallet.address}: ${error.message}`, 'red');
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
    logMessage(`${chalk.yellow("✅ Metadata updated")} for ${wallet}: ${response.data.message}`, 'yellow');
  } catch (error) {
    logMessage(`${chalk.red("❌ Error updating metadata")} for ${wallet}: ${error.message}`, 'red');
  }
};

const startMinting = async () => {
  const loopLimit = 1000;

  let totalMinted = 0;
  let currentIndex = 0;

  const mintPromises = [];
  while (totalMinted < wallets.length * loopLimit) {
    mintPromises.push(mintNFT(currentIndex));
    totalMinted++;

    currentIndex = (currentIndex + 1) % wallets.length;

    if (mintPromises.length >= 10) {
      await Promise.all(mintPromises);
      mintPromises.length = 0; 
    }

    await new Promise((resolve) => setTimeout(resolve, Math.random() * 700 + 1000));
  }

  if (mintPromises.length > 0) {
    await Promise.all(mintPromises);
  }

  console.log("✅ Đã hoàn thành quá trình minting cho tất cả ví.");
  logMessage("✅ Quá trình minting hoàn thành!", 'green');
};

startMinting();

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

process.on("SIGINT", () => {
  rl.question("\n🛑 Bạn có chắc chắn muốn dừng chương trình? (y/n): ", (answer) => {
    if (answer.toLowerCase() === "y" || answer.toLowerCase() === "yes") {
      console.log("\n⏳ Đang dừng chương trình...");
      process.exit(0);
    } else {
      console.log("\n✅ Tiếp tục chạy...");
    }
    rl.close();
  });
});
