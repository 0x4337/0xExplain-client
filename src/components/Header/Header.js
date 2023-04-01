import "./Header.scss";
import { Link } from "react-router-dom";

// TODO:
// 1. Style the header better
// 2. Make the header fixed

const Header = () => {
  return (
    <header className="header">
      <div className="header__div">
        <Link to="/" className="header__link">
          Home
        </Link>
      </div>
      <div className="header__div">
        <Link to="/about" className="header__link">
          About
        </Link>
      </div>
    </header>
  );
};

export default Header;
