import "./TransactionPage.scss";
import burst from "../../assets/images/burst.png";
import galaxystar from "../../assets/images/galaxystar.mp4";
import ethereumIcon from "../../assets/images/ethereum-icon.svg";
import ethereumIcon2 from "../../assets/images/ethereum-icon-2.svg";
import gem2 from "../../assets/images/gem2.mp4";
import BounceLoader from "react-spinners/BounceLoader";
import artifactWave from "../../assets/images/artifact-wave.jpeg";
import successTick from "../../assets/images/success-tick.svg";
// const InputDataDecoder = require("ethereum-input-data-decoder");
import InputDataDecoder from "ethereum-input-data-decoder";

import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const TransactionPage = ({ ETHERSCAN_API_KEY }) => {
  const { transactionHash } = useParams();
  const [txnBasic, setTxnBasic] = useState(null);
  const [txnFull, setTxnFull] = useState(null);
  const [contract, setContract] = useState(null);
  const [contractResult, setContractResult] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // TRANSACTION STATUS STATE
  const [isTxnSuccess, setIsTxnSuccess] = useState(false);
  const [isTxnPending, setIsTxnPending] = useState(false);
  const [isTxnFailed, setIsTxnFailed] = useState(false);
  const [isTxnUnknown, setIsTxnUnknown] = useState(false);

  const [txnStatus, setTxnStatus] = useState("");

  const getTxnBasic = async () => {
    const { data } = await axios.get(
      `http://localhost:8080/api/alchemy/getTxnBasic/${transactionHash}`
    );

    // An endpoint to mock a response from the live API
    // const { data } = await axios.get(
    //   `http://localhost:8080/api/alchemy/testPending`
    // );

    setTxnBasic(data);
  };

  const getTxnFull = async () => {
    const { data } = await axios.get(
      `http://localhost:8080/api/alchemy/getTxnFull/${transactionHash}`
    );

    setTxnFull(data);
  };

  const getTxnStatus = () => {
    setIsTxnUnknown(false);
    setIsTxnPending(false);
    setIsTxnSuccess(false);
    setIsTxnFailed(false);

    if (!txnBasic) {
      setIsTxnUnknown(true);
      setTxnStatus("Unknown");
    } else if (!txnFull && txnBasic) {
      setIsTxnPending(true);
      setTxnStatus("Pending");
    } else if (txnFull.status === 1) {
      setIsTxnSuccess(true);
      setTxnStatus("Success");
    } else if (txnFull.status === 0) {
      setIsTxnFailed(true);
      setTxnStatus("Failed");
    } else {
      setIsTxnUnknown(true);
      setTxnStatus("Unknown");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // setIsLoading(true);
        await getTxnBasic();
        await getTxnFull();
        setIsLoading(false);
      } catch (error) {
        console.log(error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    getTxnStatus();
  }, [txnBasic, txnFull]);

  // useEffect(() => {
  //   if (txnFull) {
  //     const getContract = async () => {
  //       const { data } = await axios.get(
  //         `https://api.etherscan.io/api?module=contract&action=getsourcecode&address=${txnFull.to}&apikey=${ETHERSCAN_API_KEY}`
  //       );

  //       setContract(data);
  //     };

  //     getContract();
  //   }
  // }, [txnFull]);

  useEffect(() => {
    const interval = setInterval(async () => {
      if (isTxnPending) {
        await getTxnBasic();
        await getTxnFull();
      } else {
        clearInterval(interval);
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [isTxnUnknown, isTxnPending]);

  // const getContract = async () => {
  //   const { data } = await axios.get(
  //     `https://api.etherscan.io/api?module=contract&action=getsourcecode&address=${txnFull.to}&apikey=${ETHERSCAN_API_KEY}`
  //   );

  //   setContract(data);
  // };

  // useEffect(() => {
  //   try {
  //     getContract();
  //   } catch (error) {
  //     console.log("error");
  //   }
  // }, []);

  // TODO:
  // 1. Check if the transaction data is 0x, if so, then it's a normal transaction
  // 2. If it's not 0x, then it's a contract transaction
  // 3. If it's a contract transaction, then we need to decode the input data using the interacted contracts ABI
  // 4. We'll then have the decoded input data, which we can give to GPT-4 to generate a summary of the transaction
  // 5. We can also display the transaction method on the UI

  // const decodeInput = () => {
  //   if (contract && txnBasic) {
  //     const abi = JSON.parse(contract.result[0].ABI);
  //     const decoder = new InputDataDecoder(abi);

  //     const txnInput = txnBasic.data;
  //     const decodedInput = decoder.decodeData(txnInput);

  //     return decodedInput;
  //   }
  // };

  const isContractInteraction = async (address, inputData) => {
    // FIXME:
    // Its highly likley that if 0x is the input data,
    // then the transaction is not interacting with a smart contract

    if (inputData === "0x") {
      return false;
    }
    try {
      const { data } = await axios.get(
        `https://api.etherscan.io/api?module=contract&action=getsourcecode&address=${address}&apikey=${ETHERSCAN_API_KEY}`
      );
      if (data.result[0].SourceCode === "") {
        return false;
      } else {
        setContractResult(data.result[0]);
        return true;
      }
    } catch (error) {
      console.error("Error checking contract interaction:", error);
      return false;
    }
  };

  const decodeInput = async () => {
    if (txnBasic && txnFull) {
      const isContract = await isContractInteraction(
        txnBasic.to,
        txnBasic.data
      );
      if (!isContract) {
        // The transaction is not interacting with a smart contract
        return null;
      }

      // Proceed with decoding input data using the ABI
      const { data } = await axios.get(
        `https://api.etherscan.io/api?module=contract&action=getsourcecode&address=${txnBasic.to}&apikey=${ETHERSCAN_API_KEY}`
      );
      const abi = JSON.parse(data.result[0].ABI);
      const decoder = new InputDataDecoder(abi);

      const txnInput = txnBasic.data;
      const decodedInput = decoder.decodeData(txnInput);

      const decodedInputString = `INPUTS: ${decodedInput.inputs[0]} METHOD: ${decodedInput.method} NAMES: ${decodedInput.names[0]} TYPES: ${decodedInput.types[0]}`;
      return decodedInputString;
    }
  };

  useEffect(() => {
    if (txnBasic) {
      // const decodedInput = decodeInput();
      // console.log("Decoded Input:", decodedInput);
      decodeInput();
    }
  }, [txnBasic]);

  // TODO:
  // 1. Now we have the decoded input data and the contract source code + ABI we
  // can now generate a summary of the transaction using GPT-4

  // FIXME:
  // 1. The SourceCode needs formatting
  // 2. The ABI needs formatting

  // console.log(contractResult);
  // const allData = `
  // CONTRACT SOURCE CODE:
  // ${contractResult.SourceCode}

  // CONTRACT ABI:
  // ${contractResult.ABI}

  // DECODED INPUT DATA:
  // ${decodeInput()}
  // `;

  // console.log(allData);

  // const generateInteractionSummary = async () => {
  //   try {
  //     const { data } = await axios.post(
  //       "http://localhost:8080/api/openai/generate",
  //       {
  //         allData,
  //       }
  //     );

  //     console.log("Generated Summary:", data.explanation);
  //   } catch (error) {
  //     console.error("Error generating interaction summary:", error);
  //   }
  // };

  return (
    <>
      <section className="txn">
        {/* <img src={artifactWave} alt="graphic" className="txn__wave" /> */}

        <video className="txn__graphic" loop muted>
          <source src={gem2} type="video/mp4" />
        </video>

        <div className="txn__titles">
          <div className="txn__top">
            {/* <img src={ethereumIcon} alt="ethereum icon" className="txn__icon" /> */}

            <div className="txn__icon"></div>

            <h1 className="txn__title">Transaction</h1>
            {/* <img src={ethereumIcon} alt="ethereum icon" className="txn__icon" /> */}
            <div className="txn__icon"></div>
          </div>

          <div className="txn__subtitles">
            <h2 className="txn__subtitle">Txn Hash</h2>
            <h2 className="txn__subtitle">{transactionHash}</h2>
          </div>
        </div>

        <div className="pre">
          <div className="status">
            <div className="status__wrapper">
              <p className="status__sub">Status •</p>
              {isLoading && (
                <>
                  <p className="status__text">Loading</p>
                  <BounceLoader
                    className="status__icon"
                    color="#fff"
                    size={20}
                  />
                </>
              )}
              {!isLoading && <p className="status__text">{txnStatus}</p>}
            </div>
          </div>

          <div className="pregas">
            {isTxnSuccess && (
              <div className="pregas__wrapper">
                <p className="pregas__sub">Max Gas Fee •</p>
                {/* {maxGas && <p className="pregas__text">{maxGas}</p>} */}
                <p className="pregas__text">Gas</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default TransactionPage;
