import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router";
import { createAsyncGetCart } from "../slice/cartSlice";

function Header() {
  const carts = useSelector((state) => state.cart.carts) || [];
  const wishList = useSelector((state) => state.wishList.wishList);
  const dispatch = useDispatch();

  const wishListCount = Object.values(wishList).filter(Boolean).length;

  const [isHeartBounce, setIsHeartBounce] = useState(false);
  const prevWishListCountRef = useRef(wishListCount);

  const [isCartBounce, setIsCartBounce] = useState(false);

  useEffect(() => {
    dispatch(createAsyncGetCart());
  }, [dispatch]);

  useEffect(() => {
    if (wishListCount > prevWishListCountRef.current) {
      setIsHeartBounce(true);

      const timer = setTimeout(() => {
        setIsHeartBounce(false);
      }, 400);

      return () => clearTimeout(timer);
    }
    prevWishListCountRef.current = wishListCount;
  }, [wishListCount]);

  useEffect(() => {
    if (carts.length > 0) {
      setIsCartBounce(false);

      const triggerTimer = setTimeout(() => {
        setIsCartBounce(true);
      }, 10);

      const clearTimer = setTimeout(() => {
        setIsCartBounce(false);
      }, 410);

      return () => {
        clearTimeout(triggerTimer);
        clearTimeout(clearTimer);
      };
    }
  }, [carts]);

  return (
    <div className="bg-white sticky-top">
      <div className="container">
        <nav className="navbar px-0 navbar-expand-lg navbar-light bg-white">
          <Link
            className="navbar-brand position-absolute header-brand"
            to="/"
            style={{
              left: "50%",
              transform: "translate(-50%, -50%)",
              top: "50%",
            }}
          >
            雪旅選場
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div
            className="collapse navbar-collapse bg-white custom-header-md-open"
            id="navbarNav"
          >
            <ul className="navbar-nav">
              <li className="nav-item active">
                <Link className="nav-link ps-0" to="/product">
                  雪場行程
                </Link>
              </li>
            </ul>
          </div>
          <div className="d-flex header-icons">
            <Link
              to="/login"
              className="position-relative me-5"
              aria-label="後台管理登入"
            >
              <i className="bi bi-person fs-4 mt-1"></i>
            </Link>
            <Link
              to="/wishlist"
              className="position-relative me-5"
              aria-label="前往精選雪場"
            >
              <i
                className={`bi bi-heart fs-5 mt-1 me-2 d-inline-block ${isHeartBounce ? "heart-bounce" : ""}`}
              ></i>
              {wishListCount > 0 && (
                <span
                  className="position-absolute translate-middle badge rounded-pill bg-danger"
                  style={{
                    top: "10%", // 數值越大越往下 (可以換成 px，例如 top: "2px")
                    left: "90%", // 數值越小越往左
                  }}
                >
                  {wishListCount}
                </span>
              )}
            </Link>
            <Link
              to="/cart"
              className="position-relative"
              aria-label="前往購物車"
            >
              <i
                className={`bi bi-cart fs-5 mt-1 d-inline-block ${isCartBounce ? "cart-bounce" : ""}`}
              ></i>
              {carts?.length > 0 && (
                <span
                  className="position-absolute translate-middle badge rounded-pill bg-danger"
                  style={{
                    top: "10%", // 數值越大越往下 (可以換成 px，例如 top: "2px")
                    left: "90%", // 數值越小越往左
                  }}
                >
                  {carts.length}
                </span>
              )}
            </Link>
          </div>
        </nav>
      </div>
    </div>
  );
}

export default Header;
