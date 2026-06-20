import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router";
import { createAsyncAddCart } from "../../slice/cartSlice";
import * as bootstrap from "bootstrap";
import { RotatingLines } from "react-loader-spinner";
import { currency } from "../../utils/filter";

const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

function SingleProduct() {
  const { id } = useParams();
  const [product, setProduct] = useState({});
  const [cartQty, setCartQty] = useState(1);
  const dispatch = useDispatch();
  const [loadingCartId, setLoadingCartId] = useState(null);
  const navigate = useNavigate();

  const [isAccordionOpen, setIsAccordionOpen] = useState(true);

  useEffect(() => {
    const getProduct = async (id) => {
      try {
        const response = await axios.get(
          `${API_BASE}/api/${API_PATH}/product/${id}`,
        );
        setProduct(response.data.product);
      } catch (error) {
        console.log(error.response);
      }
    };
    getProduct(id);
  }, [id]);

  const modalRef = useRef(null);
  const myModal = useRef(null);

  const openModal = () => {
    myModal.current.show();
  };
  const closeModal = (targetUrl) => {
    myModal.current.hide();

      setTimeout(() => {
        if (targetUrl) navigate(targetUrl);
      }, 400);
  };

  useEffect(() => {
    myModal.current = new bootstrap.Modal(modalRef.current);

    return () => {
      if (myModal.current) {
        myModal.current.dispose(); // 銷毀實例，防止記憶體殘留或黑底卡死
      }
    };
  }, []);

  const handleAddCart = (e, id, qty = 1) => {
    e.preventDefault();
    setLoadingCartId(id);
    dispatch(
      createAsyncAddCart({
        id,
        qty,
      }),
    )
      .unwrap()
      .then(() => {
        openModal();
      })
      .finally(() => {
        setLoadingCartId(null); // 結束轉圈圈
      });
  };

  const title = product.title || "雪場體驗";
  const description =
    product.description?.trim() ||
    `${title} 是一座值得安排進雪季清單的雪場，適合用半日到一日的節奏慢慢體驗。`;
  const content =
    product.content?.trim() ||
    `目前站內尚未補齊 ${title} 的長篇滑行札記，但已保留價格與基本資訊，適合先收藏、再依城市動線安排停留時間。`;

  const category = product.category || "日本雪區";
  return (
    <div className="container py-4">
      <div
        style={{
          minHeight: "400px",
          backgroundImage: `url(${product.imageUrl})`,
          backgroundPosition: "center center",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
        }}
        className="rounded-3"
      ></div>
      <div className="row justify-content-between mt-4 mb-7">
        <div className="col-md-7 text-start">
          <h2 className="mb-0">{title}</h2>
          <p className="fw-bold mt-2 mb-2">{currency(product.price)}</p>
          <p className="text-muted lh-base mb-3">{description}</p>
          <p className="lh-base mb-0">{content}</p>

          <div className="my-4">
            {product?.imagesUrl?.map((url, index) => (
              <img
                key={index}
                src={url}
                alt={`${title} 圖片 ${index + 1}`}
                className="img-fluid mt-4"
                style={{ width: "100%", objectFit: "cover" }}
              />
            ))}
          </div>

          {/* 折疊選單  */}
          <div
            className="accordion border border-bottom border-top-0 border-start-0 border-end-0 mb-3"
            id="accordionExample"
          >
            <div className="card border-0">
              <button
                className={`card-header py-4 bg-white border border-bottom-0 border-top border-start-0 border-end-0 text-start ${!isAccordionOpen ? "collapsed" : ""}`}
                type="button"
                onClick={() => setIsAccordionOpen(!isAccordionOpen)} // 點擊時切換狀態
              >
                <div className="d-flex justify-content-between align-items-center pe-1">
                  <h4 className="mb-0">雪場亮點</h4>
                  <i className={`fas ${isAccordionOpen ? "fa-minus" : "fa-plus"}`}></i>
                </div>
              </button>

              {/* 動態控制 show 類別 */}
              <div
                className={`collapse ${isAccordionOpen ? "show" : ""}`}
              >
                <div className="card-body pb-5">
                  {title}位於{category}，主打的是「{description}
                  」這樣的滑行印象。
                  如果你正在找一座能兼顧景色、雪況感受與停留效率的雪場，這頁整理的內容會很適合作為第一輪篩選依據。
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="input-group mb-3 border mt-3">
            <div className="input-group-prepend">
              <button
                className="btn btn-outline-dark rounded-0 border-0 py-3"
                type="button"
                id="button-addon1"
                disabled={cartQty <= 1}
                onClick={() => setCartQty((pre) => (pre === 1 ? 1 : pre - 1))}
              >
                <i className="fas fa-minus"></i>
              </button>
            </div>
            <input
              type="text"
              min="1"
              className="form-control border-0 text-center my-auto shadow-none"
              placeholder=""
              aria-label="Example text with button addon"
              aria-describedby="button-addon1"
              value={cartQty}
              onChange={(e) => setCartQty(Number(e.target.value))}
            />
            <div className="input-group-append">
              <button
                className="btn btn-outline-dark rounded-0 border-0 py-3"
                type="button"
                id="button-addon2"
                onClick={() => setCartQty((pre) => pre + 1)}
              >
                <i className="fas fa-plus"></i>
              </button>
            </div>
          </div>
          <button
            type="button"
            className="btn btn-dark w-100 d-flex justify-content-center align-items-center rounded-0 py-3 mt-3"
            onClick={(e) => handleAddCart(e, product.id, cartQty)}
          >
            {loadingCartId === product.id ? (
              <RotatingLines color="grey" width={100} height={30} />
            ) : (
              "加入購物車"
            )}
          </button>
        </div>
      </div>

      {/* modal */}
      <div ref={modalRef} className="modal fade" tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content rounded-0 border-0 shadow">
            <div className="modal-header border-0 pb-0">
              <button
                type="button"
                className="btn-close shadow-none"
                onClick={() => closeModal()}
              ></button>
            </div>
            <div className="modal-body d-flex flex-column align-items-center justify-content-center py-5">
              <div className="mb-3">
                <i className="fas fa-check-circle text-success fa-3x fa-bounce"></i>
              </div>
              <h5 className="modal-title fw-bold mb-2">已成功加入購物車！</h5>
              <div className="d-grid gap-2 w-100 px-4">
                <button
                  type="button"
                  className="btn btn-dark rounded-0 py-2"
                  onClick={() => closeModal("/cart")}
                >
                  前往購物車
                </button>
                <button
                  type="button"
                  className="btn btn-outline-dark rounded-0 py-2"
                  onClick={() => closeModal("/product")}
                >
                  去挑雪場
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SingleProduct;
