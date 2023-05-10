# Interactive Protocol - Node

The node component of the Interactive Protocol is responsible for executing computation tasks submitted by users. It participates in the bidding process and performs secure computations using Zero-Knowledge Proofs (ZKPs).

## Installation

1. Clone the repository: `git clone https://github.com/Interactive-Protocol/node.git`
2. Install the dependencies: `npm install`

## Configuration

1. Set the configuration options in the `.env` file. Specify the Ethereum network, contract address, and other relevant parameters.

## Usage

1. Start the node: `node node.js`
2. The node will listen for incoming computation tasks and bid on them based on available resources and the bidding mechanism implemented in the code.
3. The bidding mechanism takes into account factors such as the node's available resources, task complexity, and other predefined logic.
4. Once a task is assigned to the node, it will execute the computation securely using ZKPs.
5. After completing the computation, the node will submit the results to the contract.

## Customization

You can customize the node's behavior by modifying the code in the `index.js` file. This includes implementing your own logic for bidding on tasks, resource management, and interacting with the ZKP module.

## Dependencies

- Web3.js: Ethereum library for interacting with smart contracts
- Other dependencies (listed in package.json)

## Contributing

Contributions are welcome! If you have any suggestions, bug reports, or feature requests, please open an issue or submit a pull request.

## License

This project is licensed under the [MIT License](LICENSE).
