let provider;
let signer;
let contract;

const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

const abi = [
  {
    "inputs": [
      { "internalType": "string[]", "name": "_candidateNames", "type": "string[]" },
      { "internalType": "uint256", "name": "_durationInMinutes", "type": "uint256" }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [],
    "name": "getAllVotesOfCandiates",
    "outputs": [
      {
        "components": [
          { "internalType": "string", "name": "name", "type": "string" },
          { "internalType": "uint256", "name": "voteCount", "type": "uint256" }
        ],
        "internalType": "struct Voting.Candidate[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "_candidateIndex", "type": "uint256" }],
    "name": "vote",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

async function connectWallet() {
  try {
    if (!window.ethereum) {
      alert("MetaMask not detected");
      return;
    }
    await window.ethereum.request({ method: "eth_requestAccounts" });
    provider = new ethers.BrowserProvider(window.ethereum);
    const network = await provider.getNetwork();
    if (network.chainId !== 31337n) {
      alert("Please switch MetaMask to Hardhat Localhost");
      return;
    }

    signer = await provider.getSigner();
    contract = new ethers.Contract(contractAddress, abi, signer);

    console.log("Wallet connected");
    console.log("Contract address:", contractAddress);

    alert("Wallet connected");

    await loadCandidates();
  } catch (error) {
    console.error("Wallet connection failed:", error);
    alert("Wallet connection failed");
  }
}

async function loadCandidates() {
  try {
    const container = document.getElementById("candidates");
    container.innerHTML = "";

    console.log("Calling getAllVotesOfCandiates...");
    const candidates = await contract.getAllVotesOfCandiates();
    console.log("Candidates from contract:", candidates);

    candidates.forEach((candidate, index) => {
      const div = document.createElement("div");
      div.innerHTML = `
        <p>
          <b>${candidate.name}</b> | Votes: ${candidate.voteCount.toString()}
          <button onclick="vote(${index})">Vote</button>
        </p>
      `;
      container.appendChild(div);
    });
  } catch (error) {
    console.error("REAL loadCandidates error:", error);
    alert("Failed to load candidates");
  }
}

async function vote(index) {
  try {
    if (!contract) {
      alert("Connect wallet first");
      return;
    }
    const tx = await contract.vote(index);
    await tx.wait();

    alert("Vote cast successfully!");
    await loadCandidates();
  } catch (error) {
    console.error("Voting failed:", error);
    alert("You already voted or voting has ended");
  }
}
