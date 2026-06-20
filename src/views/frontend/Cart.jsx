import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router";
import {
  createAsyncDelCart,
  createAsyncUpdateCart,
} from "../../slice/cartSlice";
import { currency } from "../../utils/filter";

function Cart() {
  const carts = useSelector((state) => state.cart.carts);
  const { total } = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  const handleRemoveCart = (e, cartItem) => {
    e.preventDefault();
    dispatch(createAsyncDelCart(cartItem.id));
  };

  const handleUpdateCart = (cartId, productId, qty) => {
    dispatch(
      createAsyncUpdateCart({
        cartId,
        productId,
        qty: Number(qty),
      }),
    );
  };

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div
          className="col-md-6 bg-white py-5"
          style={{
            minHeight: "75vh",
          }}
        >
          <div className="d-flex justify-content-between">
            <h2 className="mt-2">購物車清單</h2>
          </div>

          {carts.length === 0 ? (
            <div className="text-center py-7">
              <p className="h4 mb-3">目前還沒有加入任何雪場</p>
              <p className="text-muted mb-4">
                可以先到雪場行程頁看看不同城市與滑行風格，再把感興趣的目的地放進購物車比較。
              </p>
              <Link to="/product" className="btn btn-dark rounded-0 px-5">
                去挑雪場
              </Link>
            </div>
          ) : (
            <>
              {carts.map((cartItem) => (
                <div className="d-flex mt-4 bg-light" key={cartItem.id}>
                  <img
                    src={cartItem.product.imageUrl}
                    alt={cartItem.product.title}
                    style={{
                      width: "160px",
                      aspectRatio: "4/3",
                      objectFit: "cover",
                      flexShrink: 0,
                    }}
                  />
                  <div className="w-100 p-3 position-relative text-start">
                    <a
                      href="#"
                      className="position-absolute"
                      style={{
                        top: "16px",
                        right: "16px",
                      }}
                      onClick={(e) => handleRemoveCart(e, cartItem)}
                    >
                      <i className="far fa-trash-alt"></i>
                    </a>
                    <p className="mb-0 fw-bold">{cartItem.product.title}</p>
                    <p className="mb-1 text-muted" style={{ fontSize: "14px" }}>
                      {cartItem.product.description}
                    </p>
                    <div className="d-flex justify-content-between align-items-center w-100">
                      <div className="input-group w-50 align-items-center">
                        <div className="input-group-prepend pe-1">
                          <button
                            type="button"
                            className="btn btn-link p-0 border-0"
                            disabled={cartItem.qty <= 1}
                            onClick={() => {
                                handleUpdateCart(
                                  cartItem.id,
                                  cartItem.product_id,
                                  cartItem.qty - 1,
                                )
                            }}
                          >
                            <i className="fas fa-minus"></i>
                          </button>
                        </div>
                        <input
                          type="text"
                          className="form-control border-0 text-center my-auto shadow-none bg-light px-0"
                          placeholder=""
                          aria-label="購物車數量"
                          aria-describedby="button-addon1"
                          value={cartItem.qty}
                        />
                        <div className="input-group-append ps-1">
                          <button
                            type="button"
                            className="btn btn-link p-0 border-0"
                            onClick={() => {
                              handleUpdateCart(
                                cartItem.id,
                                cartItem.product_id,
                                cartItem.qty + 1,
                              );
                            }}
                          >
                            <i className="fas fa-plus"></i>
                          </button>
                        </div>
                      </div>
                      <p className="mb-0 ms-auto">{currency(cartItem.total)}</p>
                    </div>
                  </div>
                </div>
              ))}

              <div className="d-flex justify-content-between mt-4">
                <p className="mb-0 h4 fw-bold">總計</p>
                <p className="mb-0 h4 fw-bold">{currency(total)}</p>
              </div>
              <Link
                to="/checkout"
                className="btn btn-dark d-block rounded-0 mt-5 py-3 "
              >
                結帳
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
export default Cart;
