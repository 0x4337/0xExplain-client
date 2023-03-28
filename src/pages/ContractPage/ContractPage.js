import axios from "axios";
import "./ContractPage.scss";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
require("dotenv").config();

const ContractPage = () => {
  const { contractId } = useParams();

  const [contract, setContract] = useState(null);
  const [explanation, setExplanation] = useState("");

  const ETHERSCAN_API_KEY = process.env.REACT_APP_ETHERSCAN_API_KEY;

  /**
   * Get the explanation of the contract from the backend by sending the source code of the contract
   * to the api/explain endpoint of the backend.
   * @param {string} sourceCode the source code of the contract
   * @returns the explanation of the contract
   */
  const getExplanation = async (sourceCode) => {
    try {
      const response = await axios.post("http://localhost:8081/api/explain", {
        sourceCode,
      });
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
      `https://api.etherscan.io/api?module=contract&action=getsourcecode&address=${contractId}&apikey=${ETHERSCAN_API_KEY}`
    );

    // console.log(JSON.parse(data.result[0].SourceCode));

    const jsonString = data.result[0].SourceCode.replace(/{{/g, "{").replace(
      /}}/g,
      "}"
    );

    // console.log(jsonString);

    const response = JSON.parse(jsonString);

    // Can be used for looping over etc...
    console.log(response.sources);

    const content = response.sources["/contracts/Moonbirds.sol"].content;

    const formattedResponse = content
      .replace(/\n/g, "<br />")
      .replace(/\t/g, "&emsp;");
    setContract(formattedResponse);

    // Continue cleaning to prepare for GPT???

    // const explanation = await getExplanation(content);
    // setExplanation(explanation);
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
      <h1 className="contract__title">Smart Contract</h1>
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
