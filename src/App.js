import "./App.scss";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import HomePage from "./pages/HomePage/HomePage";
import ContractPage from "./pages/ContractPage/ContractPage";
import AboutPage from "./pages/AboutPage/AboutPage";
import TransactionPage from "./pages/TransactionPage/TransactionPage";
import WalletPage from "./pages/WalletPage/WalletPage";
import Cursor from "./components/Cursor/Cursor";

const App = () => {
  const ETHERSCAN_API_KEY = process.env.REACT_APP_ETHERSCAN_API_KEY;

  // console.log("ETHERSCAN_API_KEY: ", ETHERSCAN_API_KEY);

  return (
    <BrowserRouter>
      <Cursor />
      {/* <div className="border"> */}
      <Header />
      <Routes>
        <Route
          path="/"
          element={<HomePage ETHERSCAN_API_KEY={ETHERSCAN_API_KEY} />}
        />
        <Route
          path="/about"
          element={<AboutPage ETHERSCAN_API_KEY={ETHERSCAN_API_KEY} />}
        />
        <Route
          path="/contract/:contractAddress"
          element={<ContractPage ETHERSCAN_API_KEY={ETHERSCAN_API_KEY} />}
        />
        <Route
          path="/transaction/:transactionHash"
          element={<TransactionPage ETHERSCAN_API_KEY={ETHERSCAN_API_KEY} />}
        />
        <Route
          path="/wallet/:walletAddress"
          element={<WalletPage ETHERSCAN_API_KEY={ETHERSCAN_API_KEY} />}
        />
      </Routes>
      {/* </div> */}
      {/* <Footer /> */}
    </BrowserRouter>
  );
};

export default App;
