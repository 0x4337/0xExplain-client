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
    <div className="collection">
      {imageUrl && (
        <img
          src={imageUrl}
          alt={`${name} collection image`}
          className="collection__image"
        />
      )}

      {!imageUrl && (
        <img
          src="https://imgs.search.brave.com/dyX7t6k17BCt7L_nboxXxE9tEiXdz0VPkcxtrngEp-Y/rs:fit:512:512:1/g:ce/aHR0cHM6Ly9pLnBp/bmltZy5jb20vb3Jp/Z2luYWxzLzhmLzYx/LzRkLzhmNjE0ZDY2/MDdjZjFkMjIzMmIw/ODVkNTMzMmE0MGU1/LnBuZw"
          alt="default collection image"
          className="collection__image"
        />
      )}

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
              {Number(monthlyAveragePrice).toFixed(2)} ETH
            </p>
          </div>

          <div className="collection__item">
            <p className="collection__sub">Floor Price •</p>
            <p className="collection__text">
              {Number(floorPrice).toFixed(2)} ETH
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NftCollection;
