import axios from "axios";
import "./ContractPage.scss";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
// import SyntaxHighlighter from "react-syntax-highlighter";
// // import { Object.values } from "react-syntax-highlighter/dist/esm/styles/hljs";
// import * as styles from "react-syntax-highlighter/dist/esm/styles/hljs";
// import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import BeatLoader from "react-spinners/BeatLoader";
import cube from "../../assets/images/cube.mp4";

import {
  duotoneSea,
  oneDark,
  twilight,
  atomDark,
  moonscript,
} from "react-syntax-highlighter/dist/esm/styles/prism";

// import solidity from "react-syntax-highlighter/dist/esm/languages/prism/solidity";

// SyntaxHighlighter.registerLanguage("solidity", solidity);

const ContractPage = ({ ETHERSCAN_API_KEY }) => {
  const { contractAddress } = useParams();

  const [contract, setContract] = useState(null);
  const [contractInfo, setContractInfo] = useState({});
  const [explanation, setExplanation] = useState("");

  // TODO:
  // 1. Add a loading state for the GPT response which takes time
  // 2. Add multiple messages during the loading like "wow this is taking a long time", "still thinking", "hmmmm...." etc...

  /**
   * Get the explanation of the contract from the backend by sending the source code of the contract
   * to the api/explain endpoint of the backend.
   * @param {string} sourceCode the source code of the contract
   * @returns the explanation of the contract
   */
  const getExplanation = async (sourceCode) => {
    try {
      const response = await axios.post(
        "http://localhost:8080/api/openai/contract",
        {
          sourceCode,
        }
      );
      console.log(response.data.explanation);
      return response.data.explanation;
    } catch (error) {
      console.log(error);
      return "An error occurred while getting the explanation.";
    }
  };

  /**
   * Get the source code of the contract from Etherscan API
   * and format it to be displayed on the page.
   * Then call the getExplanation function to get the explanation
   * @returns a formatted string of the contract source code
   */
  const getSourceCode = async () => {
    console.log(ETHERSCAN_API_KEY);
    const { data } = await axios.get(
      `https://api.etherscan.io/api?module=contract&action=getsourcecode&address=${contractAddress}&apikey=${ETHERSCAN_API_KEY}`
    );

    // LOGGING
    console.log("DATA BELOW");
    console.log(data);
    console.log("SOURCE CODE BELOW");
    console.log(data.result[0].SourceCode);
    console.log("CONTRACT NAME BELOW");
    console.log(data.result[0].ContractName);

    // TODO:
    // 1. Need logic to check if there is only one contract that doesnt have a name
    // 2. If there is no name, use the first contract
    // 3. Also need logic to check if the SourceCode response is valid JSON, if it isnt then we don't need to parse it
    // 4. Attempt to parse it first, then if its not JSON, just use the SourceCode response as the source code and proceed to format it
    // 5. If it is JSON, then parse it and use the SourceCode response as the source code and proceed to format it

    // let contractName = data.result[0].ContractName;
    // let response;

    // const sourceCode = data.result[0].SourceCode;

    // if (sourceCode.trim().startsWith("{")) {
    //   const jsonString = sourceCode.replace(/{{/g, "{").replace(/}}/g, "}");
    //   try {
    //     response = JSON.parse(jsonString);
    //   } catch (error) {
    //     console.log("Not valid JSON. Skipping JSON.parse...");
    //     response = { sources: { [contractName]: { content: jsonString } } };
    //   }
    // } else {
    //   response = { sources: { [contractName]: { content: sourceCode } } };
    // }

    // const jsonString = data.result[0].SourceCode.replace(/{{/g, "{").replace(
    //   /}}/g,
    //   "}"
    // );

    // // console.log(jsonString);

    // const contractName = data.result[0].ContractName.toLowerCase();
    // const response = JSON.parse(jsonString);

    // console.log(response);

    const newContractInfo = {
      contractName: data.result[0].ContractName,
      compilerVersion: data.result[0].CompilerVersion,
      optimizationUsed: data.result[0].OptimizationUsed,
      runs: data.result[0].Runs,
      evmVersion: data.result[0].EVMVersion,
      library: data.result[0].Library,
      licenseType: data.result[0].LicenseType,
      proxy: data.result[0].Proxy,
      implementation: data.result[0].Implementation,
      swarmSource: data.result[0].SwarmSource,
    };

    setContractInfo(newContractInfo);

    const sourceCode = data.result[0].SourceCode;
    const contractName = data.result[0].ContractName.toLowerCase();
    let response;

    try {
      const jsonString = sourceCode.replace(/{{/g, "{").replace(/}}/g, "}");
      console.log("JSON STRING BELOW");
      console.log(jsonString);
      response = JSON.parse(jsonString);
      console.log("PARSED JSON STRING BELOW");
      console.log(response);
    } catch (error) {
      console.log("Not valid JSON. Skipping reformat and JSON.parse...");
      response = {
        sources: {
          [`${contractName}.sol`]: {
            content: sourceCode,
          },
        },
      };
      console.log("NOT VALID JSON RESPONSE BELOW");
      console.log(response);
    }

    // TODO:
    // 1. Use the response object to loop through each contract
    // 2. for each contract, display it on the page
    // 3. Call gpt-3.5-turbo for basic explinations
    // console.log(response);

    // const mainContract = response.sources.find((source) => {
    //   console.log(source.name);

    //   console.log(contractName);

    //   return source.name === contractName;
    // });

    for (const contract in response.sources) {
      // If the key string contains the text from the contractName variable  (e.g. contracts/Azuki.sol), we have the MAIN contract
      if (contract.toLowerCase().includes(contractName)) {
        const content = response.sources[contract].content;
        console.log("CONTENT BELOW");
        console.log(content);

        // FIXME:
        // 1. DONT need to format the response as react syntax highlighting does it for us

        // const formattedResponse = content
        //   .replace(/\n/g, "<br />")
        //   .replace(/\t/g, "&emsp;");

        setContract(content);

        const gptContractString = content.replace(/\n/g, "").replace(/\t/g, "");

        // console.log(content.length);
        // console.log(formattedResponse.length);
        // console.log(gptContractString.length);

        const explanation = await getExplanation(content);
        setExplanation(explanation);
      }
    }
  };

  useEffect(() => {
    try {
      getSourceCode();
    } catch (error) {
      console.log(error);
    }
  }, []);

  // TODO:
  // 1. Format the layout so that each contract is an accordion
  // 2. Format each accordion so that the gpt explination is at the top and the solidity code is below
  // 3. Highlight the solidty code syntax with prism js and experiment with formatting requirements

  return (
    <section className="contract">
      <div className="contract__titles">
        <div className="contract__top">
          <div className="contract__circle"></div>
          <h1 className="contract__title">Smart Contract</h1>
          <div className="contract__circle"></div>
        </div>

        <div className="contract__subtitles">
          <h2 className="contract__subtitle">{contractInfo.contractName}</h2>
          <h2 className="contract__subtitle">{contractAddress}</h2>
        </div>
      </div>

      <div className="info">
        <h2 className="info__title">Contract Details</h2>

        {Object.keys(contractInfo).length === 0 && (
          <BeatLoader
            className="info__loader"
            color={"#fff"}
            loading={true}
            size={10}
          />
        )}

        <div className="info__wrapper">
          {contractInfo.compilerVersion && (
            <div className="info__item">
              <p className="info__sub">Compiler Version •</p>
              <p className="info__text">{contractInfo.compilerVersion}</p>
            </div>
          )}

          {contractInfo.optimizationUsed && (
            <div className="info__item">
              <p className="info__sub">Optimization Used •</p>
              <p className="info__text">{contractInfo.optimizationUsed}</p>
            </div>
          )}

          {contractInfo.runs && (
            <div className="info__item">
              <p className="info__sub">Runs •</p>
              <p className="info__text">{contractInfo.runs}</p>
            </div>
          )}

          {contractInfo.evmVersion && (
            <div className="info__item">
              <p className="info__sub">EVM Version •</p>
              <p className="info__text">{contractInfo.evmVersion}</p>
            </div>
          )}

          {contractInfo.library && (
            <div className="info__item">
              <p className="info__sub">Library •</p>
              <p className="info__text">{contractInfo.library}</p>
            </div>
          )}

          {contractInfo.licenseType && (
            <div className="info__item">
              <p className="info__sub">License Type •</p>
              <p className="info__text">{contractInfo.licenseType}</p>
            </div>
          )}

          {contractInfo.proxy && (
            <div className="info__item">
              <p className="info__sub">Proxy •</p>
              <p className="info__text">{contractInfo.proxy}</p>
            </div>
          )}

          {contractInfo.implementation && (
            <div className="info__item">
              <p className="info__sub">Implementation •</p>
              <p className="info__text">{contractInfo.implementation}</p>
            </div>
          )}

          {contractInfo.swarmSource && (
            <div className="info__item">
              <p className="info__sub">Swarm Source •</p>
              <p className="info__text">{contractInfo.swarmSource}</p>
            </div>
          )}
        </div>
      </div>

      <div className="gpt">
        <h2 className="gpt__title">GPT-4 Overview</h2>
        <div className="gpt__wrapper">
          <p className="gpt__text">{explanation}</p>
        </div>
      </div>

      <SyntaxHighlighter
        showLineNumbers
        language="solidity"
        wrapLongLines={true}
        style={duotoneSea}
      >
        {contract}
      </SyntaxHighlighter>
    </section>
  );
};

export default ContractPage;
