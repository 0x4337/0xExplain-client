import "./App.scss";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import HomePage from "./pages/HomePage/HomePage";
import ContractPage from "./pages/ContractPage/ContractPage";
import Cursor from "./components/Cursor/Cursor";

const App = () => {
  return (
    <BrowserRouter>
      <Cursor />
      <div className="border">
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<ContractPage />} />
          <Route path="/contact:contractAddress" element={<HomePage />} />
        </Routes>
      </div>
      <Footer />
    </BrowserRouter>
  );
};

export default App;
