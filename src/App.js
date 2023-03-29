import "./App.scss";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import HomePage from "./pages/HomePage/HomePage";
import ContractPage from "./pages/ContractPage/ContractPage";
import AboutPage from "./pages/AboutPage/AboutPage";
import Cursor from "./components/Cursor/Cursor";

const App = () => {
  const ETHERSCAN_API_KEY = process.env.REACT_APP_ETHERSCAN_API_KEY;

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
        <Route path="/contract/:contractAddress" element={<ContractPage />} />
      </Routes>
      {/* </div> */}
      <Footer />
    </BrowserRouter>
  );
};

export default App;
