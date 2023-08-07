import classes from './Navbar.module.css';
import logo from '../assets/logo.png';
import { useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();

  return (
    <div className={classes.navbar}>
      <div
        onClick={() => {
          navigate('/');
        }}
        className={classes.logo}
      >
        <img src={logo} alt="AniVerse" />
      </div>
      <form className={classes.searchBlock}>
        <input
          type="text"
          placeholder="Search for anime..."
          className={classes.searchBar}
        />
        <button className={classes.searchButton}>
          <i className="fa-solid fa-magnifying-glass"></i>
        </button>
      </form>
    </div>
  );
}

export default Navbar;
