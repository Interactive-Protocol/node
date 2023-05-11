const Web3 = require("web3");
const contractABI = require("./contractABI.json");
const snarkjs = require("snarkjs");
const { circuit, witness } = require("./zkpCircuit");

// Set up the Web3 instance
const web3 = new Web3("http://localhost:8545"); // Replace with your Ethereum provider URL

// Load the contract ABI and address
const contractAddress = "0x1234567890abcdef"; // Replace with your contract address
const contract = new web3.eth.Contract(contractABI, contractAddress);

// Define the proving and verification keys
const { provingKey, verificationKey } = snarkjs["groth"].setup(circuit);

// Listen for new task events
contract.events.NewTask({}, async (error, event) => {
  if (error) {
    console.error("Error in event listener:", error);
    return;
  }

  const { taskId, taskData } = event.returnValues;
  console.log("New task received:", taskId, taskData);

  // Perform ZKP and bid computation
  const isProofValid = await performZKP(taskData);
  if (isProofValid) {
    const bid = computeBid(taskData); // Custom bid computation logic
    submitBid(taskId, bid);
  } else {
    console.log("ZKP proof is not valid. Bid not submitted.");
  }
});

// Submit a bid for a task
function submitBid(taskId, bid) {
  const accounts = web3.eth.getAccounts();
  const account = accounts[0]; // Replace with the desired Ethereum account

  contract.methods.submitBid(taskId, bid)
    .send({ from: account })
    .on("transactionHash", (hash) => {
      console.log("Bid submitted. Transaction hash:", hash);
    })
    .on("receipt", (receipt) => {
      console.log("Bid receipt:", receipt);
    })
    .on("error", (error) => {
      console.error("Error submitting bid:", error);
    });
}

// Perform zero-knowledge proof (ZKP)
async function performZKP(taskData) {
  // Convert task data to the format expected by the circuit
  const inputData = snarkjs["groth"].stringifyBigInts({ ...witness, inputData: Buffer.from(taskData) });

  try {
    // Generate the proof
    const proof = await snarkjs["groth"].prove(provingKey, circuit, inputData);

    // Verify the proof
    const isValid = snarkjs["groth"].verify(verificationKey, proof);

    console.log("Proof is valid:", isValid);

    return isValid;
  } catch (error) {
    console.error("Error performing ZKP:", error);
    return false;
  }
}

// Compute the bid for a given task data (Custom logic)
function computeBid(taskData) {
  // Example custom logic: Compute the bid as a percentage of the task data length
  const bidPercentage = 0.05; // 5% of task data length
  const taskDataLength = taskData.length;
  const bid = taskDataLength * bidPercentage;

  return bid;
}

// Other functions for interacting with the contract (e.g., getting task details, submitting results, etc.) can be added here

// Main entry point
async function startNode() {
  try {
    // Connect to the Ethereum network
    await web3.eth.net.isListening();

    console.log("Node started. Listening for new tasks...");

    // Other initialization logic or background processes can be added here

  } catch (error) {
    console.error("Error starting the node:", error);
  }
}

// Start the node
startNode();
