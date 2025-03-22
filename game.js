// Smart Contract Details
const contractAddress = "YOUR_CONTRACT_ADDRESS"; // Replace with your deployed address
const contractABI = [
    {
        "inputs": [],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "anonymous": false,
        "inputs": [
            {"indexed": true, "internalType": "address", "name": "player", "type": "address"},
            {"indexed": false, "internalType": "uint256", "name": "reward", "type": "uint256"}
        ],
        "name": "DailyRewardClaimed",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {"indexed": true, "internalType": "address", "name": "player", "type": "address"},
            {"indexed": false, "internalType": "string", "name": "powerUp", "type": "string"}
        ],
        "name": "PowerUpActivated",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {"indexed": true, "internalType": "address", "name": "referrer", "type": "address"},
            {"indexed": true, "internalType": "address", "name": "referred", "type": "address"},
            {"indexed": false, "internalType": "uint256", "name": "bonus", "type": "uint256"}
        ],
        "name": "ReferralUsed",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {"indexed": true, "internalType": "address", "name": "player", "type": "address"},
            {"indexed": false, "internalType": "uint256", "name": "totalTaps", "type": "uint256"}
        ],
        "name": "Tapped",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {"indexed": true, "internalType": "address", "name": "player", "type": "address"},
            {"indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256"}
        ],
        "name": "TapsPurchased",
        "type": "event"
    },
    {
        "inputs": [],
        "name": "activateAutoTapper",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "activateDoubleTap",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [
            {"internalType": "uint256", "name": "amount", "type": "uint256"}
        ],
        "name": "buyTaps",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "claimDailyReward",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "dailyReward",
        "outputs": [
            {"internalType": "uint256", "name": "", "type": "uint256"}
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {"internalType": "address", "name": "player", "type": "address"}
        ],
        "name": "getTaps",
        "outputs": [
            {"internalType": "uint256", "name": "", "type": "uint256"}
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "owner",
        "outputs": [
            {"internalType": "address", "name": "", "type": "address"}
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {"internalType": "address", "name": "", "type": "address"}
        ],
        "name": "players",
        "outputs": [
            {"internalType": "uint256", "name": "taps", "type": "uint256"},
            {"internalType": "uint256", "name": "lastClaimed", "type": "uint256"}
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "referralBonus",
        "outputs": [
            {"internalType": "uint256", "name": "", "type": "uint256"}
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "tap",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "tapPrice",
        "outputs": [
            {"internalType": "uint256", "name": "", "type": "uint256"}
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {"internalType": "address", "name": "referrer", "type": "address"}
        ],
        "name": "useReferral",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "withdraw",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
];

// Game State
let tapCount = 0;
let autoTapCount = 0;
let monEarned = 0;
let doubleTapActive = false;
let autoTapperActive = false;
const maxTapsForProgress = 1000000;
let web3, contract, userAddress;

// DOM Elements
const tapButton = document.getElementById("tap-button");
const walletAddressSpan = document.getElementById("wallet-address");
const connectWalletBtn = document.getElementById("connect-wallet");
const tapDisplay = document.getElementById("tap-display");
const autoTapperDisplay = document.getElementById("auto-tapper-display");
const monEarnedDisplay = document.getElementById("mon-earned");
const themeToggle = document.getElementById("theme-toggle");
const shareButton = document.getElementById("share-button");
const leaderboardPopup = document.getElementById("leaderboard-popup");
const leaderboardList = document.getElementById("leaderboard-list");
const luckyTapPopup = document.getElementById("lucky-tap-popup");
const luckyTapAmount = document.getElementById("lucky-tap-amount");
const dailyRewardBtn = document.getElementById("daily-reward");

// Sound Effect
const tapSound = new Audio("https://www.soundjay.com/buttons/beep-01a.mp3");

// Particle System
const canvas = document.getElementById("particle-canvas");
const ctx = canvas.getContext("2d");
let particles = [];

class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 5 + 1;
        this.speedX = Math.random() * 3 - 1.5;
        this.speedY = Math.random() * 3 - 1.5;
        this.life = 20;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.life--;
    }

    draw() {
        ctx.fillStyle = "rgba(138, 117, 255, " + this.life / 20 + ")";
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function spawnParticles(x, y) {
    for (let i = 0; i < 10; i++) {
        particles.push(new Particle(x, y));
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = particles.length - 1; i >= 0; i--) {
        particles[i].update();
        particles[i].draw();
        if (particles[i].life <= 0) {
            particles.splice(i, 1);
        }
    }
    requestAnimationFrame(animateParticles);
}

animateParticles();

// Monad Testnet Config
const monadTestnet = {
    chainId: "0xYOUR_CHAIN_ID", // Replace with Monad testnet chain ID (hex)
    chainName: "Monad Testnet",
    rpcUrls: ["YOUR_MONAD_TESTNET_RPC_URL"], // Replace with Monad testnet RPC URL
    nativeCurrency: {
        name: "Monad",
        symbol: "MON",
        decimals: 18
    },
    blockExplorerUrls: ["YOUR_MONAD_TESTNET_EXPLORER_URL"] // Optional
};

// Wallet Connection & Network Switch
async function connectWallet() {
    if (window.ethereum) {
        try {
            web3 = new Web3(window.ethereum);
            await window.ethereum.request({ method: "eth_requestAccounts" });
            const accounts = await web3.eth.getAccounts();
            userAddress = accounts[0];
            walletAddressSpan.textContent = `Connected: ${userAddress.slice(0, 6)}...${userAddress.slice(-4)}`;
            connectWalletBtn.style.display = "none";

            // Switch to Monad Testnet
            try {
                await window.ethereum.request({
                    method: "wallet_switchEthereumChain",
                    params: [{ chainId: monadTestnet.chainId }]
                });
            } catch (switchError) {
                if (switchError.code === 4902) {
                    await window.ethereum.request({
                        method: "wallet_addEthereumChain",
                        params: [monadTestnet]
                    });
                } else {
                    throw switchError;
                }
            }

            contract = new web3.eth.Contract(contractABI, contractAddress);
            await syncTapCount();
            console.log("Wallet connected:", userAddress);
        } catch (error) {
            console.error("Wallet connection failed:", error);
            alert("Failed to connect wallet.");
        }
    } else {
        alert("Please install MetaMask!");
    }
}

connectWalletBtn.addEventListener("click", connectWallet);

// Sync Tap Count with Blockchain
async function syncTapCount() {
    if (contract && userAddress) {
        tapCount = await contract.methods.getTaps(userAddress).call();
        updateTapDisplay();
    }
}

// Tap Button Logic
tapButton.addEventListener("click", async function() {
    if (contract && userAddress) {
        try {
            await contract.methods.tap().send({ from: userAddress });
            tapCount++;
            monEarned += doubleTapActive ? 2 : 1; // Example MON earning
            updateTapDisplay();
            tapSound.play();
            spawnParticles(canvas.width / 2, canvas.height / 2);
            console.log(`Tapped! Total Taps: ${tapCount}`);
        } catch (error) {
            console.error("Tap failed:", error);
            alert("Tap failed!");
        }
    } else {
        alert("Please connect your wallet!");
    }
});

// Update Displays
function updateTapDisplay() {
    tapDisplay.textContent = tapCount.toLocaleString();
    autoTapperDisplay.textContent = autoTapperActive ? autoTapCount.toLocaleString() : "0";
    monEarnedDisplay.textContent = monEarned.toLocaleString();
}

function updateLeaderboard() {
    const leaderboard = [
        { name: "Player1", taps: 1000000 },
        { name: "Player2", taps: 750000 },
        { name: "Player3", taps: 500000 }
    ];
    leaderboardList.innerHTML = "";
    leaderboard.forEach(player => {
        const li = document.createElement("li");
        li.textContent = `${player.name} - ${player.taps.toLocaleString()}`;
        leaderboardList.appendChild(li);
    });
}

// Theme Toggle
themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("light-mode");
    themeToggle.textContent = document.body.classList.contains("light-mode") ? "🌞" : "🌙";
});

// Share Button
shareButton.addEventListener("click", () => {
    const text = `I’ve tapped ${tapCount.toLocaleString()} times in Tap to MON! Can you beat me? #TapToMON`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
});

// Leaderboard Toggle
function toggleLeaderboard() {
    leaderboardPopup.classList.toggle("hidden");
    if (!leaderboardPopup.classList.contains("hidden")) {
        updateLeaderboard();
    }
}

// Lucky Tap Popup
function showLuckyTapPopup(amount) {
    luckyTapAmount.textContent = `+${amount.toLocaleString()} Taps!`;
    luckyTapPopup.classList.remove("hidden");
}

function closeLuckyTapPopup() {
    luckyTapPopup.classList.add("hidden");
}

// Power-ups & Buy Taps Functions
async function buyTaps(amount) {
    if (contract && userAddress) {
        try {
            const price = web3.utils.toWei((amount * 0.00001).toString(), "ether");
            await contract.methods.buyTaps(amount).send({ from: userAddress, value: price });
            tapCount += amount;
            monEarned += amount / 1000; // Example MON earning
            updateTapDisplay();
            console.log(`Bought ${amount} taps! Total: ${tapCount}`);
        } catch (error) {
            console.error("Buy taps failed:", error);
            alert("Buy taps failed!");
        }
    } else {
        alert("Please connect your wallet!");
    }
}

async function activateAutoTapper() {
    if (contract && userAddress) {
        try {
            const price = web3.utils.toWei("0.00025", "ether");
            await contract.methods.activateAutoTapper().send({ from: userAddress, value: price });
            if (!autoTapperActive) {
                autoTapperActive = true;
                setInterval(async () => {
                    if (autoTapperActive) {
                        await contract.methods.tap().send({ from: userAddress });
                        tapCount++;
                        autoTapCount++;
                        monEarned += doubleTapActive ? 2 : 1;
                        updateTapDisplay();
                        console.log("Auto-Tap! Total:", tapCount);
                    }
                }, 1000);
                console.log("Auto-Tapper Activated!");
            }
        } catch (error) {
            console.error("Auto-Tapper failed:", error);
            alert("Auto-Tapper activation failed!");
        }
    } else {
        alert("Please connect your wallet!");
    }
}

async function activateDoubleTap() {
    if (contract && userAddress) {
        try {
            const price = web3.utils.toWei("0.0005", "ether");
            await contract.methods.activateDoubleTap().send({ from: userAddress, value: price });
            doubleTapActive = true;
            console.log("Double Tap Activated!");
        } catch (error) {
            console.error("Double Tap failed:", error);
            alert("Double Tap activation failed!");
        }
    } else {
        alert("Please connect your wallet!");
    }
}

async function checkLuckyTap() {
    const luckyChance = Math.random();
    if (luckyChance > 0.8) {
        const bonus = 1000;
        tapCount += bonus;
        monEarned += bonus / 1000;
        updateTapDisplay();
        showLuckyTapPopup(bonus);
        console.log("Lucky Tap! +1000 taps! Total:", tapCount);
    } else {
        console.log("No luck this time.");
        alert("No luck this time.");
    }
}

async function claimDailyReward() {
    if (contract && userAddress) {
        try {
            await contract.methods.claimDailyReward().send({ from: userAddress });
            tapCount += 10000;
            monEarned += 10;
            updateTapDisplay();
            alert("Claimed Daily Reward: +10,000 Taps!");
            dailyRewardBtn.disabled = true;
            setTimeout(() => dailyRewardBtn.disabled = false, 24 * 60 * 60 * 1000);
        } catch (error) {
            console.error("Daily reward failed:", error);
            alert("Daily reward claim failed! Maybe you already claimed it today.");
        }
    } else {
        alert("Please connect your wallet!");
    }
}

async function activateReferral() {
    if (contract && userAddress) {
        const referrer = prompt("Enter referrer's address:");
        if (referrer && web3.utils.isAddress(referrer)) {
            try {
                await contract.methods.useReferral(referrer).send({ from: userAddress });
                console.log("Referral Bonus Activated!");
                alert("Referral Bonus: +5000 taps added to referrer!");
                await syncTapCount();
            } catch (error) {
                console.error("Referral failed:", error);
                alert("Referral failed!");
            }
        } else {
            alert("Invalid referrer address!");
        }
    } else {
        alert("Please connect your wallet!");
    }
}

// Initialize
updateTapDisplay();
