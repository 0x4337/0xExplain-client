import "./HomePage.scss";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log(event.target.address.value);

    navigate(`/contract/${event.target.address.value}`);
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
                name="address"
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
