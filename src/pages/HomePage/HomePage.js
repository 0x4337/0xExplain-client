import "./HomePage.scss";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import face from "../../assets/images/face_biometrics.mp4";

const HomePage = ({ ETHERSCAN_API_KEY }) => {
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    const address = event.target.input.value;

    const { data } = await axios.get(
      `https://api.etherscan.io/api?module=contract&action=getsourcecode&address=${address}&apikey=${ETHERSCAN_API_KEY}`
    );

    if (address.length > 42) {
      navigate(`/transaction/${address}`);
    } else if (!data.result[0].SourceCode) {
      navigate(`/wallet/${address}`);
    } else {
      navigate(`/contract/${address}`);
    }
  };

  return (
    <main className="hero">
      <div className="face">
        <video className="face__video" autoPlay loop muted>
          <source src={face} type="video/mp4" />
        </video>
      </div>

      <section className="hero__wrapper">
        <div className="hero__titles">
          <h1 className="hero__title">0xExplain</h1>
          <p className="hero__sidetitle">Powered By GPT-4</p>
        </div>
        <p className="hero__subtitle">
          Discover, Explore and Explain <span>Ethereum</span> Data.
        </p>

        <section className="input">
          <div className="input__wrapper">
            <form onSubmit={handleSubmit} className="input__form">
              <input
                autoComplete="off"
                placeholder="address"
                name="input"
                type="text"
                className="input__input"
              />
              <button type="submit" className="input__submit">
                Submit
              </button>
            </form>
          </div>
        </section>
      </section>
    </main>
  );
};

export default HomePage;
