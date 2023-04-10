import "./NftCollection.scss";

const NftCollection = ({
  name,
  count,
  imageUrl,
  contractAddress,
  monthlyAveragePrice,
  floorPrice,
}) => {
  return (
    // <div className="nft-collection">
    //   <img src={imageUrl} alt={`${name} collection`} />
    //   <h3>{name}</h3>
    //   <p>Contract Address: {contractAddress}</p>
    //   <p>Number of Tokens: {count}</p>
    //   <p>Monthly Average Price: {monthlyAveragePrice}</p>
    //   <p>Floor Price: {floorPrice}</p>
    // </div>

    <div className="collection">
      <img
        src={imageUrl}
        alt={`${name} collection image`}
        className="collection__image"
      />
      <div className="collection__info">
        {name && <h2 className="collection__title">{name}</h2>}
        {!name && <h2 className="collection__title">Unnamed Collection</h2>}

        <div className="collection__wrapper">
          <div className="collection__item">
            <p className="collection__sub">Number Of Tokens •</p>
            <p className="collection__text">{count}</p>
          </div>

          <div className="collection__item">
            <p className="collection__sub">Monthly Average Price •</p>
            <p className="collection__text">
              {Number(monthlyAveragePrice).toFixed(2)}
            </p>
          </div>

          <div className="collection__item">
            <p className="collection__sub">Floor Price •</p>
            <p className="collection__text">{Number(floorPrice).toFixed(2)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NftCollection;
