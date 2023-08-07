import classes from './NavbarHome.module.css';
import logo from '../assets/logo.png';
import { useNavigate } from 'react-router-dom';

function NavbarHome() {
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
    </div>
  );
}

export default NavbarHome;
