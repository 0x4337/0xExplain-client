import "./TransactionPage.scss";
import burst from "../../assets/images/burst.png";
import galaxystar from "../../assets/images/galaxystar.mp4";
import ethereumIcon from "../../assets/images/ethereum-icon.svg";
import ethereumIcon2 from "../../assets/images/ethereum-icon-2.svg";
import BounceLoader from "react-spinners/BounceLoader";
import successTick from "../../assets/images/success-tick.svg";

import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const TransactionPage = ({ ETHERSCAN_API_KEY }) => {
  const { transactionHash } = useParams();
  const [txnBasic, setTxnBasic] = useState(null);
  const [txnFull, setTxnFull] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // TRANSACTION STATUS STATE
  const [isTxnSuccess, setIsTxnSuccess] = useState(false);
  const [isTxnPending, setIsTxnPending] = useState(false);
  const [isTxnFailed, setIsTxnFailed] = useState(false);
  const [isTxnUnknown, setIsTxnUnknown] = useState(false);

  // state for polling the data for both txnBasic and txnFull
  // state for static use

  // TODO:
  // Set interval to check if the transaction is successful, pending, or failed.
  // If the transaction is successful, pending, or failed, set the txnStatus state to the appropriate status.

  const getTxnBasic = async () => {
    const { data } = await axios.get(
      `http://localhost:8080/api/alchemy/getTxnBasic/${transactionHash}`
    );
    console.log(data);

    setTxnBasic(data);
  };

  const getTxnFull = async () => {
    const { data } = await axios.get(
      `http://localhost:8080/api/alchemy/getTxnFull/${transactionHash}`
    );
    console.log(data);

    setTxnFull("HEY", data);
  };

  const getTxnStatus = () => {
    // if (txnFull.status === 1) {
    //   setIsTxnSuccess(true);
    // } else if (txnFull.status === 0) {
    //   setIsTxnFailed(true);
    // } else if (!txnFull && txnBasic.confirmations === 0) {
    //   setIsTxnPending(true);
    // }

    setIsTxnUnknown(false);
    setIsTxnPending(false);
    setIsTxnSuccess(false);
    setIsTxnFailed(false);

    if (!txnBasic && !txnFull) {
      setIsTxnUnknown(true);
    } else if (!txnFull && txnBasic) {
      setIsTxnPending(true);
    } else if (txnFull.status === 1) {
      setIsTxnSuccess(true);
    } else if (txnFull.status === 0) {
      setIsTxnFailed(true);
    } else {
      setIsTxnUnknown(true);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
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

  // TODO:
  // Use getTxnBasic to check if the transaction exists. If the response is null, the transaction is not found.
  // For a pending transaction, use getTxnBasic again. If the response is not null and confirmations === 0, the transaction is pending.
  // For a successful transaction, use getTxnFull. If the status is 1, the transaction is successful.
  // For a failed transaction, use getTxnFull. If the status is 0, the transaction has failed.

  let maxGas = null;
  if (txnBasic) {
    maxGas = txnBasic.maxFeePerGas.hex;
  }
  return (
    <>
      <section className="txn">
        <img src={burst} alt="burst graphic" className="txn__burst" />

        <div className="txn__titles">
          <div className="txn__top">
            <img src={ethereumIcon} alt="ethereum icon" className="txn__icon" />

            <h1 className="txn__title">Transaction</h1>
            <img src={ethereumIcon} alt="ethereum icon" className="txn__icon" />
          </div>

          <div className="txn__subtitles">
            <h2 className="txn__subtitle">Txn Hash</h2>
            <h2 className="txn__subtitle">{transactionHash}</h2>
          </div>
        </div>

        <div className="pre">
          <div className="status">
            {isTxnSuccess && (
              <div className="status__wrapper">
                <p className="status__sub">Status •</p>
                <p className="status__text">Successful</p>
                {/* <img
                  src={successTick}
                  alt="tick icon"
                  className="status__icon status__icon--tick"
                /> */}
                <BounceLoader className="status__icon" color="#fff" size={20} />
              </div>
            )}
            {isTxnPending && (
              <div className="status__wrapper">
                <p className="status__sub">Status •</p>
                <p className="status__text">Pending</p>
                <BounceLoader className="status__icon" color="#fff" size={20} />
              </div>
            )}
            {isTxnFailed && (
              <div className="status__wrapper">
                <p className="status__sub">Status •</p>
                <p className="status__text">Failed</p>
                <BounceLoader className="status__icon" color="#fff" size={20} />
              </div>
            )}
            {!isTxnPending && isTxnUnknown && (
              <div className="status__wrapper">
                <p className="status__sub">Status •</p>
                <p className="status__text">Unknown</p>
                <BounceLoader className="status__icon" color="#fff" size={20} />
              </div>
            )}
          </div>

          {/* 

                        <div className="info__item">
                <p className="info__sub">Swarm Source •</p>
                <p className="info__text">{contractInfo.swarmSource}</p>
              </div>
           */}

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
