import "./HomePage.scss";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

const HomePage = ({ ETHERSCAN_API_KEY }) => {
  const navigate = useNavigate();

  const [input, setInput] = useState("");

  const checkAddressType = async (address) => {
    const url = `https://api.etherscan.io/api?module=contract&action=getsourcecode&address=${address}&apikey=${ETHERSCAN_API_KEY}`;
    const response = await axios.get(url);
    console.log(response);
    if (response.data.status === "0") {
      return "wallet";
    } else if (response.data.status === "1") {
      return "contract";
    } else {
      return "unknown";
    }
  };

  console.log("ADDRESS");
  console.log(checkAddressType("0xc16a5fe67A167A00d92753ECDc3E44bbd8Bc0E63"));

  console.log("CONTRACT");
  console.log(checkAddressType("0xED5AF388653567Af2F388E6224dC7C4b3241C544"));

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log(event.target.input.value);

    const input = event.target.input.value;

    // if the input is greatet than 42 characters, it is a transaction hash
    // If its less than 42 characters I need to check if its either a contract address or a wallet address
    // In the else statement i need to use the use etherscan api to check if its a contract address or a wallet address

    if (!input || !input.startsWith("0x")) {
      return alert("Please enter a valid address, hash or transaction");
    } else if (input.length > 42) {
      navigate(`/transaction/${input}`);
    } else {
      navigate(`/contract/${input}`);
    }

    // TODO:
    // 1. Check if the input starts with 0x
    // 2. If the input starts with 0x but is not a valid address, hash or transaction, return an error
    // 3. Check if the input is either a contract address, transaction hash or wallet address
    // 4. Depending on the input, navigate to the correct page
    // 5. If the input is a contract address, navigate to /contract/:contractAddress
    // 6. If the input is a transaction hash, navigate to /transaction/:transactionHash
    // 7. If the input is a wallet address, navigate to /wallet/:walletAddress

    // navigate(`/contract/${input}`);
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
