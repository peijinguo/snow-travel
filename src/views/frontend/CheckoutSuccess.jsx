import { Link, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { currency } from "../../utils/filter";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

function CheckoutSuccess() {
  const { watch } = useForm({
    mode: "onChange",
  });

  const { orderId } = useParams();
  const [order, setOrder] = useState(null); // 存儲訂單資料
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  const getOrder = async (id) => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${API_BASE}/api/${API_PATH}/order/${id}`,
      );
      if (res.data.success) {
        // 前台單一訂單 API 回傳的是單一物件 { order: { ... } }
        setOrder(res.data.order);
      } else {
        console.error("找不到該訂單");
      }
    } catch (error) {
      console.error("取得訂單失敗", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (orderId) {
      getOrder(orderId);
    }
  }, [orderId, dispatch]);

  if (loading) return <div className="container mt-5">載入中...</div>;
  if (!order) return <div className="container mt-5">找不到訂單資訊</div>;

  const total = order.total || 0;

  return (
    <div className="container">
      <div
        style={{
          minHeight: "400px",
          backgroundSize: "cover",
          backgroundImage:
            "url(https://ppt.cc/fnPRwx@.jpg)",
          backgroundPosition: "center center",
        }}
      ></div>
      <div className="mt-5 mb-7 text-start">
        <div className="row">
          <div className="col-md-6">
            <h2>訂單已成立！</h2>
            <p>
              感謝您的訂購！我們已收到您的訂單需求，工作人員將盡快為您處理。
            </p>
            <Link to="/" className="btn btn-outline-dark me-2 rounded-0 mb-4">
              返回首頁
            </Link>
          </div>
          <div className="col-md-6">
            <div className="card rounded-0 py-4">
              <div className="card-header border-bottom-0 bg-white px-4 py-0">
                <h2>訂單明細</h2>
              </div>
              <div className="card-body px-4 py-0">
                <ul className="list-group list-group-flush">
                  {Object.values(order.products).map((productItem) => (
                    <li className="list-group-item px-0" key={productItem.id}>
                      <div className="d-flex mt-2 order-row-item">
                        <img
                          src={productItem.product.imageUrl}
                          alt={productItem.product.title}
                          className="me-2"
                          style={{
                            width: "60px",
                            height: "60px",
                            objectFit: "cover",
                          }}
                        />
                        <div className="w-100 d-flex flex-column">
                          <div className="d-flex justify-content-between fw-bold">
                            <h5>{productItem.product.title}</h5>
                            <p className="mb-0">{productItem.qty}</p>
                          </div>
                          <div className="d-flex justify-content-between mt-auto">
                            <p className="text-muted mb-0">
                              <small>
                                {currency(productItem.product.price)}
                              </small>
                            </p>
                            <p className="mb-0">
                              {currency(productItem.total)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}

                  <li className="list-group-item px-0 pb-0">
                    <table className="table text-muted">
                      <tbody>
                        <tr>
                          <th
                            scope="row"
                            className="border-0 px-0 pt-0 font-weight-normal"
                          >
                            付款狀態
                          </th>
                          <td className="text-end border-0 px-0 pt-0">
                            已付款
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <div className="d-flex justify-content-between mt-2">
                      <p className="mb-0 h4 fw-bold">總計</p>
                      <p className="mb-0 h4 fw-bold">{currency(total)}</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CheckoutSuccess;
