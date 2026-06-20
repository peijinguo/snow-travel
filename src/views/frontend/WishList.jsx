import { useDispatch, useSelector } from "react-redux";
import { toggleWishList } from "../../slice/wishListSlice";
import { Link } from "react-router";
import { currency } from "../../utils/filter";
import { createAsyncAddCart } from "../../slice/cartSlice";
import { RotatingLines } from "react-loader-spinner";
import { useState } from "react";

function WishList() {
  const dispatch = useDispatch();

  const wishList = useSelector((state) => state.wishList.wishList) || [];
  const [loadingCartId, setLoadingCartId] = useState(null);

  const handleAddCart = (e, product, qty = 1) => {
    e.preventDefault();
    setLoadingCartId(product.id);

    dispatch(
      createAsyncAddCart({
        id: product.id,
        qty,
      }),
    )
      .unwrap()
      .finally(() => {
        setLoadingCartId(null);
      });
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
            <h2 className="mt-2">精選雪場</h2>
          </div>

          {wishList.length === 0 ? (
            <div className="text-center py-7 ">
              <p className="h4 mb-3">目前精選雪場清單裡沒有商品喔！</p>
              <p className="text-muted mb-4">
                可以先到雪場行程頁看看不同城市與滑行風格，再把感興趣的目的地放進精選雪場。
              </p>
              <Link to="/product" className="btn btn-dark rounded-0 px-5">
                去挑雪場
              </Link>
            </div>
          ) : (
            <>
              {wishList.map((wishlistItem, index) => {
                // 自動相容兩種資料結構
                const product = wishlistItem?.product || wishlistItem;
                const itemKey = product?.id || index;

                return (
                  <div className="d-flex mt-4 bg-light" key={itemKey}>
                    <img
                      src={
                        product?.imageUrl ||
                        "https://placehold.co/160x120?text=No+Image"
                      }
                      alt={product?.title || "商品圖片"}
                      style={{
                        width: "160px", // 同步購物車的 160px
                        aspectRatio: "4/3", // 同步購物車的 4:3 比例
                        objectFit: "cover",
                        flexShrink: 0,
                      }}
                    />
                    <div className="w-100 p-3 position-relative text-start">
                      {/* 移除按鈕同步購物車樣式 */}
                      <a
                        href="#"
                        className="position-absolute"
                        style={{
                          top: "16px",
                          right: "16px",
                        }}
                        onClick={(e) => {
                          e.preventDefault();
                          dispatch(toggleWishList(product));
                        }}
                      >
                        <i className="far fa-trash-alt"></i>
                      </a>

                      <p className="mb-0 fw-bold">
                        {product?.title || "未命名商品"}
                      </p>
                      <p
                        className="mb-1 text-muted"
                        style={{ fontSize: "14px" }}
                      >
                        {product?.description || "暫無商品描述"}
                      </p>
                      <div className="d-flex justify-content-between mt-2">
                        <p className="mb-0 text-dark">
                          {currency(product.price)}
                        </p>
                        <button
                          type="button"
                          className="btn btn-outline-dark btn-sm rounded-0 d-flex align-items-center justify-content-center"
                          style={{
                            width: "140px", // 關鍵：固定寬度，這樣轉圈跟文字時外框尺寸就會完全一模一樣！
                            height: "36px", // 關鍵：固定高度，確保 btn-sm 內部元件切換時高度不跳動
                          }}
                          onClick={(e) => handleAddCart(e, product)}
                        >
                          {loadingCartId === product.id ? (
                            <RotatingLines
                              color="grey"
                              width={16}
                              height={16}
                            />
                          ) : (
                            <>
                              <i className="fas fa-shopping-cart me-1"></i>
                              加入購物車
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* 底部總計與按鈕區域：同步購物車排版 */}
              <div className="d-flex justify-content-between mt-4">
                <p className="mb-0 h4 fw-bold">最愛商品件數</p>
                <p className="mb-0 h4 fw-bold">{wishList.length} 件</p>
              </div>
              <div className="d-flex flex-column-reverse flex-md-row mt-4 justify-content-between align-items-md-center align-items-end w-100 checkout-action-row">
                <Link to="/product" className="text-dark mt-md-0 mt-3">
                  <i className="fas fa-chevron-left me-2"></i>
                  去挑雪場
                </Link>
                <Link
                  to="/checkout"
                  className="btn btn-dark mt-4 py-3 px-7 rounded-0"
                >
                  結帳
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default WishList;
