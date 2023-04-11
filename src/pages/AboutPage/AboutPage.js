import "./AboutPage.scss";

const AboutPage = () => {
  return (
    <section className="about">
      <h1 className="about__title">Coming Soon...</h1>;
      <h2 className="about__title">Test inputs</h2>
      <p className="about__text">
        Txn Hash:
        0xab5e33614b45e1209e0cda66d018693b6752d6f443c7aaa1b4f255fe2dc8681f
      </p>
      <p className="about__text">
        Txn Hash (better):
        0xb17a498c597debc240e138dd76a06668b5ef98206c119c3f092844affb3bca2c
      </p>
      <p className="about__text">
        Contract Address: 0x34d85c9cdeb23fa97cb08333b511ac86e1c4e258
      </p>
      <p className="about__text">
        Wallet Address (Small): 0x6BC94f9111B7A9ad6A3fE688999333e9c3af77B4
      </p>
      <p className="about__text">
        Wallet Address (Loaded): 0x26fCbD3AFEbbE28D0A8684F790C48368D21665b5
      </p>
    </section>
  );
};

export default AboutPage;
