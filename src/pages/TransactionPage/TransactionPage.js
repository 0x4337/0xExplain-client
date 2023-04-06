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

// const TransactionPage = ({ ETHERSCAN_API_KEY }) => {
//   const { transactionHash } = useParams();
//   const [txnBasic, setTxnBasic] = useState(null);
//   const [txnFull, setTxnFull] = useState(null);
//   const [contract, setContract] = useState(null);
//   // const [contractResult, setContractResult] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);

//   // TRANSACTION STATUS STATE
//   const [isTxnSuccess, setIsTxnSuccess] = useState(false);
//   const [isTxnPending, setIsTxnPending] = useState(false);
//   const [isTxnFailed, setIsTxnFailed] = useState(false);
//   const [isTxnUnknown, setIsTxnUnknown] = useState(false);

//   const [txnStatus, setTxnStatus] = useState("");

//   const getTxnBasic = async () => {
//     const { data } = await axios.get(
//       `http://localhost:8080/api/alchemy/getTxnBasic/${transactionHash}`
//     );

//     // An endpoint to mock a response from the live API
//     // const { data } = await axios.get(
//     //   `http://localhost:8080/api/alchemy/testPending`
//     // );

//     setTxnBasic(data);
//   };

//   const getTxnFull = async () => {
//     const { data } = await axios.get(
//       `http://localhost:8080/api/alchemy/getTxnFull/${transactionHash}`
//     );

//     setTxnFull(data);
//   };

//   const getTxnStatus = () => {
//     setIsTxnUnknown(false);
//     setIsTxnPending(false);
//     setIsTxnSuccess(false);
//     setIsTxnFailed(false);

//     if (!txnBasic) {
//       setIsTxnUnknown(true);
//       setTxnStatus("Unknown");
//     } else if (!txnFull && txnBasic) {
//       setIsTxnPending(true);
//       setTxnStatus("Pending");
//     } else if (txnFull.status === 1) {
//       setIsTxnSuccess(true);
//       setTxnStatus("Success");
//     } else if (txnFull.status === 0) {
//       setIsTxnFailed(true);
//       setTxnStatus("Failed");
//     } else {
//       setIsTxnUnknown(true);
//       setTxnStatus("Unknown");
//     }
//   };

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         // setIsLoading(true);
//         await getTxnBasic();
//         await getTxnFull();
//         setIsLoading(false);
//       } catch (error) {
//         console.log(error);
//         setIsLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   useEffect(() => {
//     getTxnStatus();
//   }, [txnBasic, txnFull]);

//   // useEffect(() => {
//   //   if (txnFull) {
//   //     const getContract = async () => {
//   //       const { data } = await axios.get(
//   //         `https://api.etherscan.io/api?module=contract&action=getsourcecode&address=${txnFull.to}&apikey=${ETHERSCAN_API_KEY}`
//   //       );

//   //       setContract(data);
//   //     };

//   //     getContract();
//   //   }
//   // }, [txnFull]);

//   useEffect(() => {
//     const interval = setInterval(async () => {
//       if (isTxnPending) {
//         await getTxnBasic();
//         await getTxnFull();
//       } else {
//         clearInterval(interval);
//       }
//     }, 4000);

//     return () => clearInterval(interval);
//   }, [isTxnUnknown, isTxnPending]);

const TransactionPage = ({ ETHERSCAN_API_KEY }) => {
  const { transactionHash } = useParams();
  const [txnBasic, setTxnBasic] = useState(null);
  const [txnFull, setTxnFull] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [txnStatus, setTxnStatus] = useState("");
  const [contract, setContract] = useState(null);

  const fetchTransactionData = async () => {
    console.log("fetching transaction data");
    try {
      const basicResponse = await axios.get(
        `http://localhost:8080/api/alchemy/getTxnBasic/${transactionHash}`
      );

      setTxnBasic(basicResponse.data);

      if (basicResponse.data) {
        const fullResponse = await axios.get(
          `http://localhost:8080/api/alchemy/getTxnFull/${transactionHash}`
        );

        setTxnFull(fullResponse.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const getTxnStatus = () => {
    if (!txnBasic) {
      setTxnStatus("Unknown");
    } else if (!txnFull && txnBasic) {
      setTxnStatus("Pending");
    } else if (txnFull && txnFull.status === 1) {
      setTxnStatus("Success");
    } else if (txnFull && txnFull.status === 0) {
      setTxnStatus("Failed");
    } else {
      setTxnStatus("Unknown");
    }
  };

  useEffect(() => {
    fetchTransactionData();
  }, []);

  useEffect(() => {
    getTxnStatus();
  }, [txnBasic, txnFull]);

  useEffect(() => {
    if (txnStatus === "Pending") {
      const interval = setInterval(() => {
        fetchTransactionData();
      }, 4000);

      return () => clearInterval(interval);
    }
  }, [txnStatus]);

  const isContractInteraction = (input) => {
    if (input === "0x") {
      return false;
    } else {
      return true;
    }
  };

  console.log("TXN BASIC", txnBasic);

  const getContract = async () => {
    if (txnBasic) {
      let isContract = isContractInteraction(txnBasic.data);

      if (isContract) {
        const { data } = await axios.get(
          `https://api.etherscan.io/api?module=contract&action=getsourcecode&address=${txnBasic.to}&apikey=${ETHERSCAN_API_KEY}`
        );

        setContract(data);
        console.log(data);

        // MAYBE for GPT-4 we dont need to parse it, just use the ABI as is (data.result[0].ABI)
        // But for decoding purposes we need to parse it (JSON.parse...)
        const abi = JSON.parse(data.result[0].ABI);
        const decoder = new InputDataDecoder(abi);

        const txnInput = txnBasic.data;
        const decodedInput = decoder.decodeData(txnInput);

        console.log("DECODED INPUT", decodedInput);
        const stringedDecodedInput = JSON.stringify(decodedInput);

        console.log("STINGIFIED INPUT", stringedDecodedInput);

        const decodedInputString = `INPUTS: ${decodedInput.inputs[0]._hex} METHOD: ${decodedInput.method} NAMES: ${decodedInput.names[0]} TYPES: ${decodedInput.types[0]}`;
        console.log("DECODED INPUT STRING", decodedInputString);
        return decodedInputString;
      } else {
        setContract(null);
      }
    }
  };

  useEffect(() => {
    try {
      getContract();
    } catch (error) {
      console.log(error);
    }
  }, [txnBasic]);

  // console.log("CONTRACT RESULT IF TO IS A CONTRACT", contract);

  // Checks if the transaction is interacting with a smart contract
  // First it checks if the transaction is interacting with a smart contract by checking if the input data is 0x or not
  // If the input data is 0x, then it is not interacting with a smart contract and it returns false
  // If the input data is not 0x, then it is interacting with a smart contract and it sets the
  // contractResult state to the result of the API call and returns true
  // const isContractInteraction = async (address, inputData) => {
  //   console.log("Checking contract interaction...");

  //   if (inputData === "0x") {
  //     console.log("inputDate is 0x, returning false...");

  //     return false;
  //   }

  //   try {
  //     console.log(
  //       "inputData is NOT 0x, doing GET to etherscan for source code..."
  //     );

  //     // INFINATE LOOP
  //     const { data } = await axios.get(
  //       `https://api.etherscan.io/api?module=contract&action=getsourcecode&address=${address}&apikey=${ETHERSCAN_API_KEY}`
  //     );
  //     if (data.result[0].SourceCode === "") {
  //       return false;
  //     } else {
  //       setContractResult(data.result[0]);
  //       return true;
  //     }
  //   } catch (error) {
  //     console.error("Error checking contract interaction:", error);
  //     return false;
  //   }
  // };

  // // First it checks if we have the basic transaction data, if we dont it returns null
  // // Then if we have the basic transaction data, it checks if we have the basic and full transaction data (problems here)
  // // IsContract is set to the result of the isContractInteraction function which either returns false or returns true
  // // If isContract is false, then it returns null
  // // Otherwise we call the etherscan API to get the contract source code again??
  // // Then we decode the input data we got from the txnBasic state using the ABI we got from the contract source code
  // // It then sets the decodedInputStrng

  // //
  // const decodeInput = async () => {
  //   console.log("Wagwan?");
  //   if (!txnBasic) {
  //     return null;
  //   }
  //   // FIXME:
  //   // 1. txnFull doesnt need to be checked here but it breaks the code if I dont check it
  //   // 2. It causes a loop of requests to etherscan to get the contract source
  //   if (txnBasic && txnFull) {
  //     const isContract = await isContractInteraction(
  //       txnBasic.to,
  //       txnBasic.data
  //     );
  //     if (!isContract) {
  //       // The transaction is not interacting with a smart contract
  //       return null;
  //     }
  //     // Proceed with decoding input data using the ABI

  //     // FIXME:
  //     // 1. Can't i use the isContractInteractions invocation of the API to get the ABI instead of making another call?
  //     // 2. Maybe not because it puts it in state
  //     const { data } = await axios.get(
  //       `https://api.etherscan.io/api?module=contract&action=getsourcecode&address=${txnBasic.to}&apikey=${ETHERSCAN_API_KEY}`
  //     );
  //     const abi = JSON.parse(data.result[0].ABI);
  //     const decoder = new InputDataDecoder(abi);

  //     const txnInput = txnBasic.data;
  //     const decodedInput = decoder.decodeData(txnInput);

  //     const decodedInputString = `INPUTS: ${decodedInput.inputs[0]} METHOD: ${decodedInput.method} NAMES: ${decodedInput.names[0]} TYPES: ${decodedInput.types[0]}`;
  //     return decodedInputString;
  //   }
  // };

  // // FIXME: MY VERSION
  // // useEffect(() => {
  // //   if (txnBasic) {
  // //     // const decodedInput = decodeInput();
  // //     // console.log("Decoded Input:", decodedInput);
  // //     decodeInput();
  // //   }
  // // }, [txnBasic]);

  // // FIXME: GPT VERSION
  // useEffect(() => {
  //   const decodeAndProcessInput = async () => {
  //     if (txnBasic) {
  //       await decodeInput();
  //     }
  //   };
  //   try {
  //     decodeAndProcessInput();
  //   } catch (error) {}
  //   // }, [txnBasic, contractResult]);
  // }, [txnBasic]);

  // // TODO:
  // // 1. Now we have the decoded input data and the contract source code + ABI we
  // // can now generate a summary of the transaction using GPT-4

  // // FIXME:
  // // 1. The SourceCode needs formatting
  // // 2. and maybe the ABI needs formatting

  // if (!contractResult) {
  //   console.log("No contract result");
  //   <p>Loading...</p>;
  // }

  // const allData = contractResult
  //   ? `
  // CONTRACT SOURCE CODE:
  // ${contractResult.SourceCode}

  // CONTRACT ABI:
  // ${contractResult.ABI}

  // DECODED INPUT DATA:
  // ${decodeInput()}
  // `
  //   : "";

  // console.log(contractResult);
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
                  <p className="status__text">Checking</p>
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
            {txnStatus === "Success" && (
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
