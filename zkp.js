const snarkjs = require("snarkjs");
const { circuit, witness } = require("./zkpCircuit");

// Define the proving and verification keys
const { provingKey, verificationKey } = snarkjs["groth"].setup(circuit);

// Perform zero-knowledge proof (ZKP)
async function performZKP(taskData) {
  // Convert task data to the format expected by the circuit
  const inputData = Buffer.from(taskData);

  try {
    // Generate the proof
    const proof = await snarkjs["groth"].prove(provingKey, witness, inputData);

    // Verify the proof
    const isValid = snarkjs["groth"].verify(verificationKey, proof);

    console.log("Proof is valid:", isValid);

    return isValid;
  } catch (error) {
    console.error("Error performing ZKP:", error);
    return false;
  }
}

// Other functions related to ZKP (e.g., generating keys, setting up the circuit, etc.) can be added here

module.exports = {
  performZKP,
};
