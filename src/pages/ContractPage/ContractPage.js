import axios from "axios";
import "./ContractPage.scss";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";

import BeatLoader from "react-spinners/BeatLoader";
import ContractAccord from "../../components/ContractAccord/ContractAccord";
import gem from "../../assets/images/gem.mp4";
import gem2 from "../../assets/images/gem2.mp4";

const ContractPage = ({ ETHERSCAN_API_KEY }) => {
  const { contractAddress } = useParams();

  const [contract, setContract] = useState(null);
  const [allContracts, setAllContracts] = useState(null);
  const [contractInfo, setContractInfo] = useState({});
  // const [explanation, setExplanation] = useState("");

  /**
   * Get the explanation of the contract from the backend by sending
   * the source code of the contract
   * to the api/explain endpoint of the backend.
   * @param {string} sourceCode the source code of the contract
   * @returns the explanation of the contract
   */
  const getExplanation = async (sourceCode, promptIndex = null) => {
    if (!promptIndex) {
      promptIndex = Math.floor(Math.random() * 5);
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/openai/generate`,
        {
          sourceCode,
          promptIndex,
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
    // console.log(ETHERSCAN_API_KEY);
    const { data } = await axios.get(
      `https://api.etherscan.io/api?module=contract&action=getsourcecode&address=${contractAddress}&apikey=${ETHERSCAN_API_KEY}`
    );

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
        // console.log("CONTENT BELOW");
        // console.log(content);

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
      }
    }

    setAllContracts(response.sources);
  };

  const createContractAccord = () => {
    if (allContracts) {
      return Object.keys(allContracts).map((contract, index) => {
        const content = allContracts[contract].content;

        return (
          <ContractAccord
            total={Object.keys(allContracts).length}
            key={index}
            number={index + 1}
            name={contract}
            contract={content}
            getExplanation={getExplanation}
          />
        );
      });
    }
  };

  useEffect(() => {
    try {
      getSourceCode();
    } catch (error) {
      console.log(error);
    }
  }, []);

  return (
    <>
      <video className="gem" loop autoPlay muted>
        <source src={gem} type="video/mp4" />
      </video>
      <video className="core" loop autoPlay muted>
        <source src={gem2} type="video/mp4" />
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

        {createContractAccord()}
      </section>
    </>
  );
};

export default ContractPage;
