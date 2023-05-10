const Web3 = require('web3');
const contractAbi = require('./InteractiveProtocolContractAbi.json');

// Connect to the Ethereum network
const web3 = new Web3('http://localhost:8545'); // Replace with your Ethereum node URL
const contractAddress = '0x123456789ABCDEF'; // Replace with the actual contract address

// Create an instance of the smart contract
const contract = new web3.eth.Contract(contractAbi, contractAddress);

// Subscribe to events emitted by the contract
contract.events.TaskSubmitted((error, event) => {
  if (error) {
    console.error('Error:', error);
  } else {
    console.log('New task submitted:', event.returnValues.taskId);
  }
});

// Listen for new tasks and bid on them
contract.events.NewTask((error, event) => {
  if (error) {
    console.error('Error:', error);
  } else {
    const { taskId, taskData } = event.returnValues;
    console.log('New task:', taskId);
    
    // Perform computation and determine the bid
    const bid = computeBid(taskData);
    
    // Submit the bid to the contract
    contract.methods.submitBid(taskId, bid)
      .send({ from: '0xYourNodeAddress', gas: 200000 })
      .then(() => {
        console.log('Bid submitted successfully.');
      })
      .catch((error) => {
        console.error('Error submitting bid:', error);
      });
  }
});

// Start listening for events
contract.events.allEvents({}, (error, event) => {
  if (error) {
    console.error('Error:', error);
  } else {
    console.log('Event:', event.event);
  }
});

// Function to perform computation and determine the bid
function computeBid(taskData) {
  // Your custom logic to compute the bid based on the task data
  // ...
  return 100; // Replace with the actual bid amount
}
