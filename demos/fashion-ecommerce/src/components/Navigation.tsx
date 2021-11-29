import Logo from "../res/logo.svg";
import IconMenu from "../res/icon-menu.svg";
import IconBasket from "../res/icon-basket.svg";
import IconSearch from "../res/icon-search.svg";
import IconUser from "../res/icon-user.svg";
import "./Navigation.css";

const Navigation = () => {
  return (
    <div className="Navigation">
      <div className="Navigation__inner">
        <div className="Navigation__left">
          <div>Women</div>
          <div>Men</div>
          <div>Kids</div>
        </div>
        <div className="Navigation__logo">
          <img src={Logo} alt="logo" />
        </div>
        <div className="Navigation__right">
          <img className="Navigation__right--desktop" src={IconSearch} alt="icon" />
          <img className="Navigation__right--desktop" src={IconUser} alt="icon" />
          <img className="Navigation__right--desktop" src={IconBasket} alt="icon" />
          <img className="Navigation__right--mobile" src={IconMenu} alt="icon" />
        </div>
      </div>
    </div>
  )
}

export default Navigation;