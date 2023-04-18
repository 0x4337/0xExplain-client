import "./DisclaimerModule.scss";

const DisclaimerModule = ({ setIsDisclaimerAccepted }) => {
  //   const handleAccept = () => {
  //     setIsDisclaimerAccepted(true);
  //     localStorage.setItem("isDisclaimerAccepted", true);
  //   };

  //   const isLocalAccepted = localStorage.getItem("isDisclaimerAccepted");

  //   if (isLocalAccepted) {
  //     setIsDisclaimerAccepted(true);
  //   }

  function setItemWithExpiry(key, value, ttl) {
    const now = new Date();
    const item = {
      value: value,
      expiry: now.getTime() + ttl,
    };
    localStorage.setItem(key, JSON.stringify(item));
  }

  function getItemWithExpiry(key) {
    const itemStr = localStorage.getItem(key);

    if (!itemStr) {
      return null;
    }

    const item = JSON.parse(itemStr);
    const now = new Date();

    if (now.getTime() > item.expiry) {
      localStorage.removeItem(key);
      return null;
    }

    return item.value;
  }

  const handleAccept = () => {
    setIsDisclaimerAccepted(true);
    setItemWithExpiry("isDisclaimerAccepted", true, 15 * 60 * 1000); // Set to expire in 15 minutes
  };

  const isLocalAccepted = getItemWithExpiry("isDisclaimerAccepted");

  if (isLocalAccepted) {
    setIsDisclaimerAccepted(true);
  }

  return (
    <section className="disc">
      <div className="disc-delete">
        <div className="disc-delete__wrapper">
          <h1 className="disc-delete__title">Disclaimer: Render bootdown</h1>

          <p className="disc-delete__text">
            Please allow a few minutes for the backend to boot up. The server is
            hosted on Renders free tier which boots down after 30 minutes of
            inactivity. If you are seeing this message it may mean the server is
            down.
          </p>
        </div>

        <button
          onClick={handleAccept}
          className="disc-delete__button disc-delete__button--delete"
        >
          Accept
        </button>
      </div>
    </section>
  );
};

export default DisclaimerModule;
