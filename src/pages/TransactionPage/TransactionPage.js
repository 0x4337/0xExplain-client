import "./TransactionPage.scss";
import burst from "../../assets/images/burst.png";
import galaxystar from "../../assets/images/galaxystar.mp4";
import ethereumIcon from "../../assets/images/ethereum-icon.svg";
import ethereumIcon2 from "../../assets/images/ethereum-icon-2.svg";
import gem2 from "../../assets/images/gem2.mp4";
import BounceLoader from "react-spinners/BounceLoader";
import BeatLoader from "react-spinners/BeatLoader";
import PuffLoader from "react-spinners/PuffLoader";
import artifactWave from "../../assets/images/artifact-wave.jpeg";
import successTick from "../../assets/images/success-tick.svg";
// const InputDataDecoder = require("ethereum-input-data-decoder");
import InputDataDecoder from "ethereum-input-data-decoder";
import contractIcon from "../../assets/images/contract.svg";

import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { badgeUnstyledClasses } from "@mui/base";
import { formatUnits, parseUnits } from "ethers";

const TransactionPage = ({ ETHERSCAN_API_KEY }) => {
  const { transactionHash } = useParams();
  const [txnBasic, setTxnBasic] = useState(null);
  const [txnFull, setTxnFull] = useState(null);
  const [basicGas, setBasicGas] = useState({});
  const [fullGas, setFullGas] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [txnStatus, setTxnStatus] = useState("");
  const [contract, setContract] = useState(null);
  const [decodedInput, setDecodedInput] = useState(null);
  const [txnExplination, setTxnExplination] = useState(null);

  const fetchTransactionData = async () => {
    console.log("fetching transaction data");
    try {
      const basicResponse = await axios.get(
        `http://localhost:8080/api/alchemy/getTxnBasic/${transactionHash}`
      );

      setTxnBasic(basicResponse.data);

      // FIXME:
      // Some transactions do not include maxPriorityFeePerGas and maxFeePerGas which causes the app to crash
      // Need to handle this case
      // const gasPriceInGwei = parseFloat(
      //   formatUnits(basicResponse.data.gasPrice.hex, "gwei")
      // ).toFixed(2);
      // const maxPriorityFeePerGasInGwei = parseFloat(
      //   formatUnits(basicResponse.data.maxPriorityFeePerGas.hex, "gwei")
      // ).toFixed(2);
      // const maxFeePerGasInGwei = parseFloat(
      //   formatUnits(basicResponse.data.maxFeePerGas.hex, "gwei")
      // ).toFixed(2);
      // const gasLimitInGwei = parseFloat(
      //   formatUnits(basicResponse.data.gasLimit.hex, "wei")
      // );
      // setBasicGas({
      //   gasPriceInGwei,
      //   maxPriorityFeePerGasInGwei,
      //   maxFeePerGasInGwei,
      //   gasLimitInGwei,
      // });

      const gasPriceInGwei = parseFloat(
        formatUnits(basicResponse.data.gasPrice.hex, "gwei")
      ).toFixed(2);
      const maxPriorityFeePerGasInGwei = basicResponse.data.maxPriorityFeePerGas
        ? parseFloat(
            formatUnits(basicResponse.data.maxPriorityFeePerGas.hex, "gwei")
          ).toFixed(2)
        : 0; // Default value when not available
      const maxFeePerGasInGwei = basicResponse.data.maxFeePerGas
        ? parseFloat(
            formatUnits(basicResponse.data.maxFeePerGas.hex, "gwei")
          ).toFixed(2)
        : 0; // Default value when not available
      const gasLimitInGwei = parseFloat(
        formatUnits(basicResponse.data.gasLimit.hex, "wei")
      );
      setBasicGas({
        gasPriceInGwei,
        maxPriorityFeePerGasInGwei,
        maxFeePerGasInGwei,
        gasLimitInGwei,
      });

      if (basicResponse.data) {
        const fullResponse = await axios.get(
          `http://localhost:8080/api/alchemy/getTxnFull/${transactionHash}`
        );

        setTxnFull(fullResponse.data);

        // const gasUsedInGwei = parseFloat(
        //   formatUnits(fullResponse.data.gasUsed.hex, "wei")
        // );

        // const cumulativeGasUsedInGwei = parseFloat(
        //   formatUnits(fullResponse.data.cumulativeGasUsed.hex, "wei")
        // );

        // const effectiveGasPriceInGwei = parseFloat(
        //   formatUnits(fullResponse.data.effectiveGasPrice.hex, "gwei")
        // );

        // setFullGas({
        //   gasUsedInGwei,
        //   cumulativeGasUsedInGwei,
        //   effectiveGasPriceInGwei,
        // });
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
  console.log("TXN FULL", txnFull);

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
        // FIXME:
        // There are cases when a contracts source code is not verified so it returns just byteCode and not ABI or other data
        const abi = JSON.parse(data.result[0].ABI);
        const decoder = new InputDataDecoder(abi);

        const txnInput = txnBasic.data;
        const decodedInput = decoder.decodeData(txnInput);

        // FIXME:
        // There are cases where the .inputs are not hex codes, but strings

        console.log("DECODED INPUT", decodedInput);
        const stringedDecodedInput = JSON.stringify(decodedInput);

        setDecodedInput(decodedInput);

        console.log("STINGIFIED INPUT", stringedDecodedInput);

        const abiForGpt = data.result[0].ABI;

        // FIXME:
        // Need to get the main contract for the source code, not the whole thing
        // Same logic as in contractPage for getting the main contract

        // =============================

        const sourceCode = data.result[0].SourceCode;
        const contractName = data.result[0].ContractName.toLowerCase();
        let response;
        let mainContract;

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
            mainContract = response.sources[contract].content;
          }
        }

        // =============================

        const allData = `
        CONTRACT SOURCE CODE:

        ${mainContract}

        ----------------------------

        CONTRACT ABI:

        ${abiForGpt}

        ----------------------------

        DECODED INPUT DATA:

        ${stringedDecodedInput}

        ----------------------------

        `;

        console.log("ALL DATA", allData);

        // try {
        //   const { data } = await axios.post(
        //     "http://localhost:8080/api/openai/generateInteraction",
        //     {
        //       allData,
        //     }
        //   );

        //   console.log("Generated Summary:", data.explanation);
        //   setTxnExplination(data.explanation);
        // } catch (error) {
        //   console.error("Error generating interaction summary:", error);
        // }

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

        <div className="status">
          <div className="status__wrapper">
            <p className="status__sub">Status •</p>
            {isLoading && (
              <>
                <p className="status__text">Checking</p>
                <PuffLoader className="status__icon" color="#fff" size={20} />
              </>
            )}
            {/* {!isLoading && <p className="status__text">{txnStatus}</p>} */}
            {!isLoading && txnStatus === "Pending" && (
              <>
                <p className="status__text">{txnStatus}</p>
                <BounceLoader className="status__icon" color="#fff" size={15} />
              </>
            )}
            {!isLoading && txnStatus !== "Pending" && (
              <p className="status__text">{txnStatus}</p>
            )}
          </div>
        </div>

        <div className="basic">
          <div className="basic__details">
            <div className="basic__item">
              <p className="basic__sub">Block Number •</p>
              {txnBasic && (
                <p className="basic__text">{txnBasic.blockNumber}</p>
              )}
            </div>
            <div className="basic__item">
              <p className="basic__sub">Current Confirmations •</p>
              {txnBasic && (
                <p className="basic__text">{txnBasic.confirmations}</p>
              )}
            </div>
            <div className="basic__item">
              <p className="basic__sub">Transaction Index •</p>
              {txnBasic && (
                <p className="basic__text">{txnBasic.transactionIndex}</p>
              )}
            </div>
          </div>
          <div className="basic__parties">
            <div className="basic__to">
              <div className="basic__to-content">
                <p className="basic__sub">To •</p>

                {contract && (
                  <div className="basic__contract">
                    <div className="basic__disclaimer">
                      <img
                        className="basic__icon"
                        src={contractIcon}
                        alt="icon of contract"
                      />
                      <p className="basic__text">Smart Contract</p>
                    </div>
                  </div>
                )}
              </div>

              {contract && txnBasic && (
                <Link
                  className="basic__text basic__text--contract"
                  to={`/contract/${txnBasic.to}`}
                >
                  {txnBasic.to}
                </Link>
              )}

              {!contract && txnBasic && (
                <p className="basic__text">{txnBasic.to}</p>
              )}

              {!txnBasic && <BeatLoader color="#fff" size={5} />}
            </div>
            <div className="basic__from">
              <p className="basic__sub">From •</p>
              {txnBasic && <p className="basic__text">{txnBasic.from}</p>}
              {!txnBasic && <BeatLoader color="#fff" size={5} />}
            </div>
          </div>
        </div>

        <div className="gas">
          <div className="gas__wrapper">
            <div className="gas__sent">
              <h3 className="gas__title">Gas Sent</h3>
              <div className="gas__item">
                <p className="gas__sub">Max Gas Fee •</p>
                {txnBasic && (
                  <p className="gas__text">
                    {basicGas.maxFeePerGasInGwei} Gwei
                  </p>
                )}
                {!txnBasic && <BeatLoader color="#fff" size={5} />}
              </div>
              <div className="gas__item">
                <p className="gas__sub">Max Priority Fee •</p>
                {txnBasic && (
                  <p className="gas__text">
                    {basicGas.maxPriorityFeePerGasInGwei} Gwei
                  </p>
                )}
                {!txnBasic && <BeatLoader color="#fff" size={5} />}
              </div>
              <div className="gas__item">
                <p className="gas__sub">Gas Limit •</p>
                {txnBasic && (
                  <p className="gas__text">{basicGas.gasLimitInGwei}</p>
                )}
                {!txnBasic && <BeatLoader color="#fff" size={5} />}
              </div>
            </div>

            {/* <div className="gas__used">
              <h3 className="gas__title">Gas Used</h3>
              <div className="gas__item">
                <p className="gas__sub">Gas Limit Used •</p>
                {txnFull && (
                  <p className="gas__text">{fullGas.gasUsedInGwei}</p>
                )}
                {!txnFull && <BeatLoader color="#fff" size={5} />}
              </div>
              <div className="gas__item">
                <p className="gas__sub">Cumulative Gas Used •</p>
                {txnFull && (
                  <p className="gas__text">{fullGas.cumulativeGasUsedInGwei}</p>
                )}
                {!txnFull && <BeatLoader color="#fff" size={5} />}
              </div>
              <div className="gas__item">
                <p className="gas__sub">Effective Gas Used •</p>
                {txnFull && (
                  <p className="gas__text">
                    {fullGas.effectiveGasPriceInGwei} Gwei
                  </p>
                )}
                {!txnFull && <BeatLoader color="#fff" size={5} />}
              </div>
            </div> */}
          </div>
        </div>

        {/* <div className="pregas">
            {txnStatus === "Success" && (
              <div className="pregas__wrapper">
                <p className="pregas__sub">Max Gas Fee •</p>
                {maxGas && <p className="pregas__text">{maxGas}</p>} 
                <p className="pregas__text">Gas</p>
              </div>
            )}
          </div>

          {!contract && <p className="txn__text">Not a contract interaction</p>} */}
      </section>
    </>
  );
};

export default TransactionPage;
