import "./TransactionPage.scss";
import burst from "../../assets/images/burst.png";

import BounceLoader from "react-spinners/BounceLoader";
import BeatLoader from "react-spinners/BeatLoader";
import PuffLoader from "react-spinners/PuffLoader";

import InputDataDecoder from "ethereum-input-data-decoder";
import contractIcon from "../../assets/images/contract.svg";

import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

import { formatUnits, parseUnits } from "ethers";

// TODO:
// x. If there is no input data, then set it to checking instead of transfer.
// Currently it is set to transfer because the input data is not available. Meaning
// if the input data is still fetching, it shows transfer... which is wrong.

// x. There are cases where the gpt prompt is too long, either the source code alone is
// too long, or the combination of data makes it too long. Need to handle
// this case. I either need to check the length before sending it to the backend, or I
// need to handle situations where gpt fails.

// 3. There seems to be an issue where on first load, the generateInteraction endpoint is not called
// Needs further investigation.

// 4. Consider adding the ability to click for a simpler explanation.
// Something like a "click to explain (Advanced)" and a "click to explain (Simple)".

// x. Fix Analyse spelling on re-analysis button.

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
  const [isLegacyTransaction, setIsLegacyTransaction] = useState(false);
  const [value, setValue] = useState(0);
  const [isRerolling, setIsRerolling] = useState(false);
  const [exceedsLimit, setExceedsLimit] = useState(false);

  const fetchTransactionData = async () => {
    console.log("fetching transaction data");
    try {
      const basicResponse = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/alchemy/getTxnBasic/${transactionHash}`
      );

      setTxnBasic(basicResponse.data);

      const valueInEth = Number(
        parseFloat(formatUnits(basicResponse.data.value.hex, "ether")).toFixed(
          2
        )
      );

      setValue(valueInEth);

      const gasPriceInGwei = Number(
        parseFloat(
          formatUnits(basicResponse.data.gasPrice.hex, "gwei")
        ).toFixed(2)
      );
      const maxPriorityFeePerGasInGwei = basicResponse.data.maxPriorityFeePerGas
        ? Number(
            parseFloat(
              formatUnits(basicResponse.data.maxPriorityFeePerGas.hex, "gwei")
            ).toFixed(2)
          )
        : 0; // Default value when not available
      const maxFeePerGasInGwei = basicResponse.data.maxFeePerGas
        ? Number(
            parseFloat(
              formatUnits(basicResponse.data.maxFeePerGas.hex, "gwei")
            ).toFixed(2)
          )
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

      setIsLegacyTransaction(
        !basicResponse.data.maxPriorityFeePerGas ||
          !basicResponse.data.maxFeePerGas
      );

      if (basicResponse.data) {
        const fullResponse = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/alchemy/getTxnFull/${transactionHash}`
        );

        setTxnFull(fullResponse.data);

        const gasUsedInGwei = Number(
          parseFloat(formatUnits(fullResponse.data.gasUsed.hex, "wei")).toFixed(
            2
          )
        );

        const cumulativeGasUsedInGwei = Number(
          parseFloat(
            formatUnits(fullResponse.data.cumulativeGasUsed.hex, "wei")
          ).toFixed(2)
        );

        const effectiveGasPriceInGwei = Number(
          parseFloat(
            formatUnits(fullResponse.data.effectiveGasPrice.hex, "gwei")
          ).toFixed(2)
        );

        setFullGas({
          gasUsedInGwei,
          cumulativeGasUsedInGwei,
          effectiveGasPriceInGwei,
        });
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

  const getContract = async (promptIndex = null) => {
    if (!promptIndex) {
      promptIndex = Math.floor(Math.random() * 9);
    }

    setIsRerolling(true);

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

        console.log("DECODED INPUT", decodedInput);
        const stringedDecodedInput = JSON.stringify(decodedInput);

        setDecodedInput(decodedInput);

        console.log("STINGIFIED INPUT", stringedDecodedInput);

        const abiForGpt = data.result[0].ABI;

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

        if (allData.length > 50000) {
          setExceedsLimit(true);
        }

        console.log("ALL DATA", allData);

        try {
          const { data } = await axios.post(
            `${process.env.REACT_APP_BACKEND_URL}/api/openai/generateInteraction`,
            {
              allData,
              promptIndex,
            }
          );

          console.log("Generated Summary:", data.explanation);
          setTxnExplination(data.explanation);
          setIsRerolling(false);
        } catch (error) {
          console.error("Error generating interaction summary:", error);
        }

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
  }, [txnFull]);

  const handleReroll = () => {
    const promptIndex = Math.floor(Math.random() * 7);
    getContract(promptIndex);
  };

  const handleSimple = () => {
    getContract(8);
  };

  return (
    <>
      <section className="txn">
        <img src={burst} alt="graphic" className="txn__burst" />

        <div className="txn__titles">
          <div className="txn__top">
            <div className="txn__icon"></div>

            <h1 className="txn__title">Transaction</h1>

            <div className="txn__icon"></div>
          </div>

          <div className="txn__subtitles">
            <h2 className="txn__subtitle">Txn Hash</h2>
            <h2 className="txn__subtitle">{transactionHash}</h2>
          </div>
        </div>

        <div className="status">
          <div className="status__wrapper">
            <div className="status__item">
              <p className="status__sub">Status •</p>
              {isLoading && (
                <PuffLoader className="status__icon" color="#fff" size={20} />
              )}

              {!isLoading && txnStatus === "Pending" && (
                <>
                  <p className="status__text">{txnStatus}</p>
                  <BounceLoader
                    className="status__icon"
                    color="#fff"
                    size={15}
                  />
                </>
              )}
              {!isLoading && txnStatus !== "Pending" && (
                <p className="status__text">{txnStatus}</p>
              )}
            </div>

            <div className="status__item">
              <p className="status__sub">Method •</p>

              {!txnBasic && <BeatLoader color="#fff" size={5} />}
              {txnBasic && decodedInput && (
                <p className="status__text">{decodedInput.method}</p>
              )}
              {decodedInput === "0x" && (
                <p className="status__text">Transfer</p>
              )}

              {!decodedInput && <p className="status__text"></p>}
            </div>

            <div className="status__item">
              <p className="status__sub">Value •</p>
              {!txnBasic && <BeatLoader color="#fff" size={5} />}
              {txnBasic && <p className="status__text">{value} ETH</p>}
            </div>
          </div>
        </div>

        <div className="basic">
          <div className="basic__details">
            <div className="basic__item">
              <p className="basic__sub">Block Number •</p>
              {!txnBasic && <BeatLoader color="#fff" size={5} />}
              {txnBasic && !txnBasic.blockNumber ? (
                <BeatLoader color="#fff" size={5} />
              ) : (
                txnBasic && <p>{txnBasic.blockNumber}</p>
              )}
            </div>
            <div className="basic__item">
              <p className="basic__sub">Current Confirmations •</p>
              {!txnBasic && <BeatLoader color="#fff" size={5} />}

              {txnBasic && (
                <p className="basic__text">{txnBasic.confirmations}</p>
              )}
            </div>
            <div className="basic__item">
              <p className="basic__sub">Transaction Index •</p>
              {!txnBasic && <BeatLoader color="#fff" size={5} />}

              {txnBasic && !txnBasic.transactionIndex ? (
                <BeatLoader color="#fff" size={5} />
              ) : (
                txnBasic && <p>{txnBasic.transactionIndex}</p>
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
                <p className="basic__text basic__text--wallet">{txnBasic.to}</p>
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
              <div className="gas__legacy">
                <h3 className="gas__title">Gas Sent</h3>
                {isLegacyTransaction && (
                  <p className="gas__legacy-warn">
                    Legacy Transaction Detected
                  </p>
                )}
              </div>
              {!isLegacyTransaction && (
                <>
                  <div className="gas__item">
                    <p className="gas__sub">Max Gas Fee •</p>

                    {txnBasic && basicGas.maxFeePerGasInGwei && (
                      <p className="gas__text">
                        {basicGas.maxFeePerGasInGwei} Gwei
                      </p>
                    )}
                    {!txnBasic && <BeatLoader color="#fff" size={5} />}
                  </div>
                  <div className="gas__item">
                    <p className="gas__sub">Max Priority Fee •</p>
                    {txnBasic && basicGas.maxPriorityFeePerGasInGwei && (
                      <p className="gas__text">
                        {basicGas.maxPriorityFeePerGasInGwei} Gwei
                      </p>
                    )}
                    {!txnBasic && <BeatLoader color="#fff" size={5} />}
                  </div>
                </>
              )}
              {isLegacyTransaction && (
                <div className="gas__item">
                  <p className="gas__sub">Gas Fee (Pre EIP-1559) •</p>
                  {txnBasic && (
                    <p className="gas__text">{basicGas.gasPriceInGwei} Gwei</p>
                  )}
                  {!txnBasic && <BeatLoader color="#fff" size={5} />}
                </div>
              )}

              <div className="gas__item">
                <p className="gas__sub">Gas Limit •</p>
                {txnBasic && (
                  <p className="gas__text">{basicGas.gasLimitInGwei}</p>
                )}
                {!txnBasic && <BeatLoader color="#fff" size={5} />}
              </div>
            </div>

            <div className="gas__used">
              <h3 className="gas__title">Gas Used</h3>
              <div className="gas__item">
                <p className="gas__sub">Gas Limit Used •</p>
                {txnFull && (
                  <>
                    <p className="gas__text">{fullGas.gasUsedInGwei}</p>
                    <p className="gas__percent">
                      (
                      {(
                        (fullGas.gasUsedInGwei / basicGas.gasLimitInGwei) *
                        100
                      ).toFixed(2)}
                      %)
                    </p>
                  </>
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
            </div>
          </div>
        </div>

        {contract && (
          <div className="explain">
            <h2 className="explain__title">Explain</h2>

            <div className="explain__wrapper">
              {isRerolling && !exceedsLimit ? (
                <BeatLoader
                  className="explain__loader"
                  color="#fff"
                  size={7.5}
                />
              ) : (
                <>
                  {txnExplination && (
                    <>
                      <pre className="explain__response">
                        <code
                          className="explain__code"
                          dangerouslySetInnerHTML={{ __html: txnExplination }}
                        />
                      </pre>

                      <button
                        onClick={handleReroll}
                        className="explain__reroll"
                      >
                        Click To Re-Analyse
                      </button>

                      <button
                        onClick={handleSimple}
                        className="explain__reroll"
                      >
                        Click To Simplify
                      </button>
                    </>
                  )}
                </>
              )}

              {!txnExplination && !txnFull && (
                <p className="explain__wait">
                  Waiting for transaction to settle before attempting to
                  analyise.
                </p>
              )}

              {exceedsLimit && (
                <p className="explain__wait">
                  The combination of decoded input data, the contracts ABI and
                  its source code may be exceeding the character limitations of
                  the GPT-4 testing API. Please try a differet data point. We
                  will attempt to combat this in the future if the limit is not
                  raised soon!
                </p>
              )}
            </div>
          </div>
        )}
      </section>
    </>
  );
};

export default TransactionPage;
