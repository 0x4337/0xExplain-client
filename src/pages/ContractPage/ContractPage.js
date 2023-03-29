import axios from "axios";
import "./ContractPage.scss";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";

const ContractPage = ({ ETHERSCAN_API_KEY }) => {
  const { contractAddress } = useParams();

  const [contract, setContract] = useState(null);
  const [explanation, setExplanation] = useState("");

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
    const { data } = await axios.get(
      `https://api.etherscan.io/api?module=contract&action=getsourcecode&address=${contractAddress}&apikey=${ETHERSCAN_API_KEY}`
    );

    const jsonString = data.result[0].SourceCode.replace(/{{/g, "{").replace(
      /}}/g,
      "}"
    );
    console.log(data);

    const contractName = data.result[0].ContractName;
    const response = JSON.parse(jsonString);

    console.log("CONTRACT NAME");
    console.log(contractName);

    // Can be used for looping over etc...
    console.log(response);

    // const mainContract = response.sources.find((source) => {
    //   console.log(source.name);

    //   console.log(contractName);

    //   return source.name === contractName;
    // });

    // console.log(mainContract);

    console.log(typeof response.sources);

    for (const contract in response.sources) {
      // Key
      // console.log(contract);

      // Value
      // console.log(response.sources[contract]);

      // If the key string contains the text from the contractName variable  (e.g. contracts/Azuki.sol), we have the MAIN contract
      if (contract.includes(contractName)) {
        console.log("found main contract");
        console.log(contract);
        console.log();

        const content = response.sources[contract].content;
        const formattedResponse = content
          .replace(/\n/g, "<br />")
          .replace(/\t/g, "&emsp;");

        setContract(formattedResponse);

        const gptContractString = content.replace(/\n/g, "").replace(/\t/g, "");

        console.log(content.length);
        console.log(formattedResponse.length);
        console.log(gptContractString.length);

        const explanation = await getExplanation(content);
        setExplanation(explanation);
      }

      // With the main one...
    }

    // Continue cleaning to prepare for GPT???
  };

  useEffect(() => {
    try {
      getSourceCode();
    } catch (error) {
      console.log(error);
    }
  }, []);

  return (
    <section className="contract">
      <div className="contract__titles">
        <div className="contract__top">
          <div className="contract__circle"></div>
          <h1 className="contract__title">Smart Contract</h1>
          <div className="contract__circle"></div>
        </div>

        <div className="contract__subtitles">
          <h2 className="contract__subtitle">Address</h2>
          <h2 className="contract__subtitle">{contractAddress}</h2>
        </div>
      </div>

      <h2 className="contract__explain">Explain</h2>
      <p className="contract__explain-text">{explanation}</p>

      <div className="contract__details">
        <div className="contract__name"></div>
      </div>
      <pre>
        <code dangerouslySetInnerHTML={{ __html: contract }} />
      </pre>
    </section>
    // <section className="explain">
    //   <h1 className="explain__title">Contract Page</h1>
    //   <p className="explain__text">
    //     Showing the contract source code for {contractId}
    //   </p>

    //   <pre>
    //     <code dangerouslySetInnerHTML={{ __html: contract }} />
    //   </pre>

    //   <h2 className="explain__subtitle">Explanation</h2>
    //   <p className="explain__text">{explanation}</p>
    // </section>
  );
};

export default ContractPage;
