import "./AboutPage.scss";

const AboutPage = () => {
  return (
    <section className="about">
      <div className="about__titles">
        <div className="about__top">
          <div className="about__circle"></div>
          <h1 className="about__title">About</h1>
          <div className="about__circle"></div>
        </div>

        <div className="about__subtitles">
          <h2 className="about__subtitle">By</h2>
          <h2 className="about__subtitle">Adam Gedge</h2>
        </div>
      </div>
      <div className="about__info">
        <h2 className="about__title">Tech Used</h2>

        <div className="about__tech">
          <div className="about__item">
            <p className="about__sub">Frontend •</p>
            <p className="about__text">React, Sass, BEM, Various Libraries</p>
          </div>

          <div className="about__item">
            <p className="about__sub">Backend •</p>
            <p className="about__text">Node.js, Express.js</p>
          </div>

          <div className="about__item">
            <p className="about__sub">API's •</p>
            <p className="about__text">Alchemy, Etherscan, Module, OpenAI</p>
          </div>

          <div className="about__item">
            <p className="about__sub">Blockchain •</p>
            <p className="about__text">Ethereum</p>
          </div>

          <div className="about__item">
            <p className="about__sub">Extra •</p>
            <p className="about__text">MUI Components, Dribble Animations</p>
          </div>
        </div>
      </div>

      <div className="about__info">
        <h2 className="about__title">Challenges</h2>

        <div className="about__tech">
          <div className="about__challenge">
            <p className="about__sub">Ethereum •</p>
            <p className="about__text">
              Navigating the Ethereum ecosystem presented a variety of complex
              scenarios and edge cases to address. As I delved into this
              project, I gained firsthand experience in tackling these
              challenges. Given the vastness and ever-evolving nature of the
              Ethereum landscape, it can be difficult to cover every possible
              scenario. Moving forward, my goal is to identify and address as
              many edge cases as possible, ensuring the seamless operation of my
              application.
            </p>
          </div>
          <div className="about__challenge">
            <p className="about__sub">Multiple APIs •</p>
            <p className="about__text">
              The industry's abundant API offerings proved to be both a blessing
              and a challenge. While having a plethora of options to choose
              from, I occasionally found myself overwhelmed by the quest for the
              ideal API. This experience taught me the importance of time
              management and the need to avoid getting entangled in minutiae.
              Focusing on creating a functional product and refining it
              iteratively became my priority.
            </p>
          </div>

          <div className="about__challenge">
            <p className="about__sub">Solidity Technicalities •</p>
            <p className="about__text">
              Entering this project, my knowledge of Solidity was fairly basic.
              As I progressed, I found myself diving deeper into new concepts,
              poring over documentation, and watching numerous tutorials. While
              this immersive learning experience has been invaluable and has
              left me eager to expand my Solidity expertise, it stole time that
              I could not afford to spend.
            </p>
          </div>
        </div>
      </div>

      <div className="about__info">
        <h2 className="about__title">The Future</h2>

        <div className="about__tech">
          <div className="about__term">
            <p className="about__sub">Immediate •</p>
            <p className="about__text">
              I'm looking forward to spending some not so deadline constrained
              time, refining the existing features and ensuring they perform
              optimally.
            </p>
          </div>

          <div className="about__term">
            <p className="about__sub">Short Term •</p>
            <p className="about__text">
              With Ethereum's vast potential, there are numerous additional
              features I'm eager to implement. My short-term goals include
              adding a database to store user searches and allowing users to
              save explanations of their favorite Ethereum data points. Another
              intriguing prospect is integrating MetaMask authentication.
            </p>
          </div>

          <div className="about__term">
            <p className="about__sub">Mid Term •</p>
            <p className="about__text">
              As OpenAI's LLM technology continues to evolve, I'm enthusiastic
              about staying updated and leveraging their APIs to introduce
              innovative functionality within the blockchain space. Combining
              the limitless possibilities of Ethereum with the advancements in
              OpenAI excites me, and I really look forward to exploring their
              synergy.
            </p>
          </div>

          <div className="about__term">
            <p className="about__sub">Long Term •</p>
            <p className="about__text">
              Eventually I would like to work with a UI/UX designer to improve
              upon where my design skills lack, to create an responsive design
              and to employ styling consistency. Aftet that, I'de like to deploy
              a paid business model. Following these improvements, I plan to
              introduce a paid business model. I believe there is a genuine need
              for this application, and as the crypto market regains momentum
              and blockchain technologies resurge, I intend to be ready to offer
              my solution to new entrants in the field!
            </p>
          </div>
        </div>
      </div>

      <div className="test">
        <div className="test__wrapper">
          <h2 className="test__title">Test Inputs</h2>

          <div className="test__info">
            <div className="test__item">
              <p className="test__sub">Txn Hash •</p>
              <p className="test__text">
                0xb17a498c597debc240e138dd76a06668b5ef98206c119c3f092844affb3bca2c
              </p>
            </div>
            <div className="test__item">
              <p className="test__sub">Txn Hash 2 •</p>
              <p className="test__text">
                0x3a28f456e4fa3a5bd6ca37d61a41f930dee838ce68fbfe2a11154a22f71ff8a2
              </p>
            </div>

            <div className="test__item">
              <p className="test__sub">Contract Address •</p>
              <p className="test__text">
                0xE7d3982E214F9DFD53d23a7f72851a7044072250
              </p>
            </div>
            <div className="test__item">
              <p className="test__sub">Contract Address 2 •</p>
              <p className="test__text">
                0x60E4d786628Fea6478F785A6d7e704777c86a7c6
              </p>
            </div>
            <div className="test__item">
              <p className="test__sub">Wallet Address Small •</p>
              <p className="test__text">
                0x6BC94f9111B7A9ad6A3fE688999333e9c3af77B4
              </p>
            </div>
            <div className="test__item">
              <p className="test__sub">Wallet Address Loaded •</p>
              <p className="test__text">
                0x26fCbD3AFEbbE28D0A8684F790C48368D21665b5
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutPage;
