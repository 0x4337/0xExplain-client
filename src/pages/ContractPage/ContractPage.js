import axios from "axios";
import "./ContractPage.scss";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import BeatLoader from "react-spinners/BeatLoader";
import ContractAccord from "../../components/ContractAccord/ContractAccord";
import cube from "../../assets/images/cube.mp4";
import gradient from "../../assets/images/gradientblur.jpg";
import spray from "../../assets/images/spray.mp4";
import waves from "../../assets/images/waves.mp4";

import {
  duotoneSea,
  oneDark,
  twilight,
  atomDark,
  moonscript,
} from "react-syntax-highlighter/dist/esm/styles/prism";

const ContractPage = ({ ETHERSCAN_API_KEY }) => {
  const { contractAddress } = useParams();

  const [contract, setContract] = useState(null);
  const [allContracts, setAllContracts] = useState(null);
  const [contractInfo, setContractInfo] = useState({});
  // const [explanation, setExplanation] = useState("");

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

      response = JSON.parse(jsonString);
    } catch (error) {
      response = {
        sources: {
          [`${contractName}.sol`]: {
            content: sourceCode,
          },
        },
      };
    }

    for (const contract in response.sources) {
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

        // const gptContractString = content.replace(/\n/g, "").replace(/\t/g, "");

        // console.log(content.length);
        // console.log(formattedResponse.length);
        // console.log(gptContractString.length);

        // TODO:
        // EXPLANATION TESTING:
        // const explanation = await getExplanation(content);
        // setExplanation(explanation);
      }
    }

    console.log("RESPONSE BELOW");
    console.log(response);
    setAllContracts(response.sources);
  };

  // const createContractAccord = () => {
  //   if (allContracts) {
  //     return allContracts.map((contract) => {
  //       return <ContractAccord contract={contract} />;
  //     });
  //   }
  // };

  const createContractAccord = () => {
    if (allContracts) {
      return Object.keys(allContracts).map((contract) => {
        const content = allContracts[contract].content;
        return (
          <ContractAccord contract={content} getExplanation={getExplanation} />
        );
      });
    }
  };

  console.log("ALL CONTRACTS BELOW");
  console.log(allContracts);

  useEffect(() => {
    try {
      getSourceCode();
    } catch (error) {
      console.log(error);
    }
  }, []);

  // TODO:
  // 1. Loop through the response object and pass down each contract to the contract accordion component
  // 2. For each accordion, there will be a button to call the gpt-4 model to explain the contract
  // 3. The gpt-4 model will return a string of text that will be displayed in the accordion

  return (
    <>
      <video className="ball__video" loop muted>
        <source src={waves} type="video/mp4" />
      </video>
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
        {/* 
      <ContractAccord />
      <ContractAccord />
      <ContractAccord /> */}

        {createContractAccord()}

        <div className="gpt">
          <h2 className="gpt__title">GPT-4 Overview</h2>
          <div className="gpt__wrapper">
            <p className="gpt__text">old explination location</p>
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
    </>
  );
};

export default ContractPage;
