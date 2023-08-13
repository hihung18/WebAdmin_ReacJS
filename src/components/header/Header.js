import React from "react";
import { Link, useNavigate } from "react-router-dom";
const Header = () => {
  const [userDetail, setUserDetail] = React.useState(
    JSON.parse(localStorage.getItem("auth"))
  );
  
  const Signout = () => {
    try {
      localStorage.removeItem("auth");
      setUserDetail({});
      window.location.reload();
      console.log("signout success!");
      console.log(userDetail);
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <>
      <header className="header-upper py-3">
        <div className="container-xxl">
          <div className="row">
            <div className="col-2 shop ">
              <h4 className="shop-name">
                <Link className="shop-name" to={"/"}>
                  <div className="lezada button type3">LEZADA</div>
                </Link>
              </h4>
            </div>
            <div className="col-1 nav-option">
              <div className="btn-cont">
                <a href="/products" className="btn">
                  Products
                  <span className="line-1"></span>
                  <span className="line-2"></span>
                  <span className="line-3"></span>
                  <span className="line-4"></span>
                </a>
              </div>
            </div>

            <div className="col-1 nav-option">
              <div className="btn-cont">
                <a href="/users" className="btn">
                  Users
                  <span className="line-1"></span>
                  <span className="line-2"></span>
                  <span className="line-3"></span>
                  <span className="line-4"></span>
                </a>
              </div>
            </div>

            <div className="col-1 nav-option">
              <div className="btn-cont">
                <a href="/orders" className="btn">
                  Orders
                  <span className="line-1"></span>
                  <span className="line-2"></span>
                  <span className="line-3"></span>
                  <span className="line-4"></span>
                </a>
              </div>
            </div>

            <div className="col-1 btn-auth">
              {!userDetail ? (
                <Link className="button type2" as={Link} to="/login">
                  Login
                </Link>
              ) : (
                <Link
                  className="button type2"
                  as={Link}
                  to="/"
                  onClick={Signout}
                >
                  Signout
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
