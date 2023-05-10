const Web3 = require("web3");
const contractABI = require("./contractABI.json");

// Set up the Web3 instance
const web3 = new Web3("http://localhost:8545"); // Replace with your Ethereum provider URL

// Load the contract ABI and address
const contractAddress = "0x1234567890abcdef"; // Replace with your contract address
const contract = new web3.eth.Contract(contractABI, contractAddress);

// Listen for new task events
contract.events.NewTask({}, (error, event) => {
  if (error) {
    console.error("Error in event listener:", error);
    return;
  }

  const { taskId, taskData } = event.returnValues;
  console.log("New task received:", taskId, taskData);

  // Perform bid computation and submit bid
  const bid = computeBid(taskData); // Custom bid computation logic
  submitBid(taskId, bid);
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
