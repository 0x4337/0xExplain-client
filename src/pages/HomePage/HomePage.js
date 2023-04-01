import "./HomePage.scss";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

const HomePage = ({ ETHERSCAN_API_KEY }) => {
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    const address = event.target.input.value;

    const { data } = await axios.get(
      `https://api.etherscan.io/api?module=contract&action=getsourcecode&address=${address}&apikey=${ETHERSCAN_API_KEY}`
    );

    // TODO:
    // 1. Before it navigates to each page, add a insert a loading screen
    // 2. Use delays to simulate a long load time and loop through pretend loading statuses such as "identifying input type", "input type found" etc...
    // 3. Finally navigate to the respective page
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
      <section className="hero__wrapper">
        <div className="hero__titles">
          <h1 className="hero__title">0xExplain</h1>
          <p className="hero__sidetitle">Powered By GPT-4</p>
        </div>
        <p className="hero__subtitle">
          Discover, Exploit and Secure <span>Ethereum</span> Smart Contracts.
        </p>

        <section className="input">
          <div className="input__wrapper">
            <form onSubmit={handleSubmit} className="input__form">
              <input
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
