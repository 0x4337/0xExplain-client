# 0xExplain
## _Discover, Explore and Explain Ethereum Data._

0xExplain is a powerful tool designed to simplify the analysis and understanding of Ethereum transactions, smart contracts, wallets and more data points. It leverages the GPT-4 AI model to provide detailed, human-like explanations of complex data.

- Input Ethereum data
- Get GPT-4 Powered Explinations
- ✨ Magic ✨

## Features

- Analyze Ethereum transactions by decoding input data and identifying invoked functions
- Analyze smart contracts and generate detailed reports about their functions, purposes, and potential security risks
- Wallet analysis (still in development) provides information such as wallet balance, creation date, total gas spent, and held tokens
- AI-driven analysis using GPT-4 for human-like explanations

## How It Works

0xExplain is built on top of the GPT-4 AI model, which is capable of providing detailed, human-like explanations of complex data and Solidity code. The tool communicates with the Ethereum network using various APIs to fetch data points. It then uses GPT-4 to analyze and explain the fetched data, providing users with easily understandable insights into the Ethereum ecosystem.

### Transaction Analysis

0xExplain breaks down Ethereum transactions by first decoding the input data to identify the transaction type. If the transaction is a contract call, the tool will fetch the contract's ABI enabing it to decode the input data and identify the invoked functions. Along with the ABI the tool also fetches the contract's source code. Combining the decoded input data, contract source code, and ABI, 0xExplain generates a detailed summary of the transaction, its expected outcomes, and invoked functions generated by cutting edge AI technologies provided by OpenAI.

### Smart Contract Analysis

0xExplain allows users to analyze Ethereum smart contracts. By providing the smart contracts address, 0xExplain will fetch and format the source code for each contract. The tool then generates, upon click of a simple or advanced analysis button, a detailed report, describing each function's purpose, potential security risks, and any other relevant information. This feature is invaluable for developers and security auditors, as it helps them identify vulnerabilities and understand the contract's inner workings. It is also useful for first timers looking to learn more about the smart contract they may be interacting with or considering to interact with.

### Wallet Analysis

This page is still in development and will be updated in the future. However, the page will currently provide important information such as wallet balance, creation date, total gas spent, ERC-721 / ERC-1155 tokens held etc...

## Usage

### Transaction Analysis

To analyze a transaction, simply input the transaction hash into the 0xExplain tool. The tool will fetch the input data, contract source code, and ABI associated with the transaction. It will then generate a detailed summary of the transaction, its expected outcomes, and invoked functions based on the decoded input data.

### Smart Contract Analysis

To analyze a smart contract, provide the contract's address to the 0xExplain tool. The tool will generate a comprehensive report, describing each function's purpose, potential security risks, and any other relevant information.

### Wallet Analysis

To analyze a wallet's history, input the wallet address into the 0xExplain tool. The tool will display various data points, however this feature is still in development and will be updated in the future.

## Conclusion

0xExplain is a powerful and versatile tool for anyone looking to dive deeper into the Ethereum ecosystem. With its intuitive interface and advanced AI-driven analysis, it simplifies complex transactions, smart contracts, and wallet history, making it easier for users to understand and navigate the world of Ethereum. Give 0xExplain a try and discover its potential for yourself!

#### Disclaimers
GPT-4 Is slow... really slow. This is likely to change but be prepared to wait up to 3 (ish) minutes for a response. 
The GPT-3.5-TURBO model is sometimes activated to save on expensive GPT-4 tokens, I'll add a toggle feature soon.
Test prompts are also sometimes activated.
More work needs doing to handle the shire amount of edge cases, especially for transactions. 


- https://0xexplain.com
