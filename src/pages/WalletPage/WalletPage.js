import "./WalletPage.scss";
import axios from "axios";
import { useState, useEffect } from "react";
import sand from "../../assets/images/sand.gif";
import gradientBlur from "../../assets/images/gradientblur.jpg";
import NftCollection from "../../components/NftCollection/NftCollection";

import { useParams } from "react-router-dom";

const WalletPage = ({ ETHERSCAN_API_KEY }) => {
  const { walletAddress } = useParams();

  const [balance, setBalance] = useState(null);
  const [creationDate, setCreationDate] = useState(null);
  const [txnCount, setTxnCount] = useState(null);
  const [totalGasSpent, setTotalGasSpent] = useState(null);
  const [nftCollections, setNftCollections] = useState(null);
  const [nftStats, setNftStats] = useState(null);
  const [isDataFetched, setIsDataFetched] = useState(false);

  const getBalance = async () => {
    try {
      const { data } = await axios.get(
        `http://localhost:8080/api/alchemy/getBalance/${walletAddress}`
      );

      setBalance(data);
    } catch (error) {
      console.log(error);
    }
  };

  const getCreationDate = async () => {
    try {
      const { data } = await axios.get(
        `http://localhost:8080/api/alchemy/getCreationDate/${walletAddress}`
      );

      setCreationDate(data);
    } catch (error) {
      console.log(error);
    }
  };

  const getTxnCount = async () => {
    try {
      const { data } = await axios.get(
        `http://localhost:8080/api/alchemy/getTxnCount/${walletAddress}`
      );

      setTxnCount(data);
    } catch (error) {
      console.log(error);
    }
  };

  const getTotalGasSpent = async () => {
    try {
      const { data } = await axios.get(
        `https://api.etherscan.io/api?module=account&action=txlist&address=${walletAddress}&sort=asc&apikey=${ETHERSCAN_API_KEY}`
      );

      let totalGasSpent = 0;

      data.result.forEach((transaction) => {
        const gasUsed = transaction.gas;
        const gasPrice = transaction.gasPrice;

        totalGasSpent += Number(gasUsed * gasPrice);
      });

      // console.log(`Total gas spent: ${totalGasSpent} (in wei)`);
      // console.log(`Total gas spent: ${totalGasSpent / 1e18} (in ether)`);
      const totalGasSpentInEther = Number((totalGasSpent / 1e18).toFixed(2));

      setTotalGasSpent(totalGasSpentInEther);
    } catch (error) {
      console.log(error);
    }
  };

  const getNftStats = async (contractAddress) => {
    try {
      const { data } = await axios.get(
        `http://localhost:8080/api/module/getNftStats/${contractAddress}`
      );

      return {
        status: 1,
        collection: data.data.floorPrice.floorListing.collection,
        monthlyAveragePrice: data.data.monthlyAveragePrice,
        floorPrice: data.data.floorPrice.price,
      };
    } catch (error) {
      console.log(error);
    }
  };

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const getNftCollections = async () => {
    try {
      const { data } = await axios.get(
        `http://localhost:8080/api/alchemy/getNFTs/${walletAddress}`
      );

      const contractCounts = {};

      data.ownedNfts.forEach((nft) => {
        const contractAddress = nft.contract.address;
        if (contractCounts[contractAddress]) {
          contractCounts[contractAddress].count += 1;
        } else {
          contractCounts[contractAddress] = {
            count: 1,
            name: nft.contract.name,
            collectionImage: nft.contract.openSea.imageUrl,
            nft: nft,
          };
        }
      });

      setNftCollections(contractCounts);

      // const fetchStats = async () => {
      //   const stats = {};

      //   for (const contractAddress in contractCounts) {
      //     try {
      //       const nftStat = await getNftStats(contractAddress);
      //       stats[contractAddress] = nftStat;

      //       await delay(2500);
      //     } catch (error) {
      //       console.log(`Error fetching stats for ${contractAddress}:`, error);
      //     }
      //   }

      //   console.log(stats);
      //   setNftStats(stats);
      // };

      // fetchStats();

      const fetchStats = async (contractCounts) => {
        const collectionsWithStats = {};

        for (const contractAddress in contractCounts) {
          try {
            const nftStat = await getNftStats(contractAddress);

            if (nftStat) {
              contractCounts[contractAddress].monthlyAveragePrice =
                nftStat.monthlyAveragePrice;
              contractCounts[contractAddress].floorPrice = nftStat.floorPrice;

              // Add the collection with stats to the new object
              collectionsWithStats[contractAddress] =
                contractCounts[contractAddress];
            }

            await delay(500);
          } catch (error) {
            console.log(`Error fetching stats for ${contractAddress}:`, error);
          }
        }

        console.log(collectionsWithStats);
        setNftCollections(collectionsWithStats);
        setIsDataFetched(true);
      };

      // Call fetchStats function after setting the contractCounts
      fetchStats(contractCounts);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getBalance();
    getCreationDate();
    getTxnCount();
    getTotalGasSpent();
    getNftCollections();
  }, []);

  const renderNftCollections = () => {
    if (!isDataFetched) {
      return <p>Loading NFT collections and stats...</p>;
    }

    const collectionsArray = Object.entries(nftCollections).map(
      ([contractAddress, collection]) => {
        return (
          <NftCollection
            key={contractAddress}
            name={collection.name}
            count={collection.count}
            imageUrl={collection.collectionImage}
            contractAddress={contractAddress}
            monthlyAveragePrice={collection.monthlyAveragePrice}
            floorPrice={collection.floorPrice}
          />
        );
      }
    );

    return collectionsArray;
  };

  return (
    <section className="wallet">
      {/* <video className="wallet__graphic" loop autoPlay muted>
        <source src={aivoice} type="video/mp4" />
      </video> */}

      {/* <img src={burst} alt="graphic" className="wallet__burst" /> */}
      {/* <img src={burst2} alt="graphic" className="wallet__burst2" /> */}
      <img src={sand} alt="graphic" className="wallet__sand" />

      <div className="wallet__titles">
        <div className="wallet__top">
          {/* <img src={ethereumIcon} alt="ethereum icon" className="wallet__icon" /> */}

          <div className="wallet__icon"></div>

          <h1 className="wallet__title">Wallet</h1>
          {/* <img src={ethereumIcon} alt="ethereum icon" className="wallet__icon" /> */}
          <div className="wallet__icon"></div>
        </div>

        <div className="wallet__subtitles">
          <h2 className="wallet__subtitle">Wallet</h2>
          <h2 className="wallet__subtitle">{walletAddress}</h2>
        </div>
      </div>

      <div className="data">
        <h2 className="data__title">Wallet Details</h2>

        <div className="data__wrapper">
          {balance && (
            <div className="data__item">
              <p className="data__sub">ETH Balance •</p>
              <p className="data__text">Ξ{balance.balanceInETH}</p>
            </div>
          )}

          {balance && (
            <div className="data__item">
              <p className="data__sub">USD Balance •</p>
              <p className="data__text">
                {balance.balanceInUSD.toLocaleString("en-US", {
                  style: "currency",
                  currency: "USD",
                })}
              </p>
            </div>
          )}

          {creationDate && (
            <div className="data__item">
              <p className="data__sub">Creation Date •</p>
              <p className="data__text">{creationDate}</p>
            </div>
          )}

          {txnCount && (
            <div className="data__item">
              <p className="data__sub">Transaction Count •</p>
              <p className="data__text">{txnCount}</p>
            </div>
          )}

          {totalGasSpent && (
            <div className="data__item">
              <p className="data__sub">Total Gas Spent •</p>
              <p className="data__text">{totalGasSpent} ETH</p>
            </div>
          )}
        </div>
      </div>

      <div className="nft">
        <h2 className="nft__title">NFTs</h2>

        <div className="nft__wrapper">
          {/* <div className="nft__item">
            <img src={nftCollections.} alt="nft collection image" />
            <p className="nft__text">NFT Collection Name</p>
            <p className="nft__text">10x</p>
            <p className="nft__text">Average Sale: 12ETH</p>
            <p className="nft__text">Total USD value: $42,222</p>
          </div> */}

          {renderNftCollections()}
        </div>
      </div>

      <div className="more">
        <div className="more__wrapper">
          <div className="more__item">
            <p className="more__sub">More Data •</p>
            <p className="more__text">Coming Soon...</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WalletPage;
