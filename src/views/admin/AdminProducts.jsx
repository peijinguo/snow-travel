import { useEffect, useState, useRef } from "react";
import axios from "axios";
import * as bootstrap from "bootstrap";
import "../../assets/style.css";
import AdminProductModal from "../../components/AdminProductModal";
import Pagination from "../../components/Pagination";
import { useNavigate } from "react-router";

const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

const INITIAL_TEMPLATE_DATA = {
  id: "",
  title: "",
  category: "",
  origin_price: "",
  price: "",
  unit: "",
  description: "",
  content: "",
  is_enabled: false,
  imageUrl: "",
  imagesUrl: [],
  equipment: "",
};

function AdminProducts() {
  const navigate = useNavigate();
  // const [isAuth, setIsAuth] = useState(false);

  const [products, setProducts] = useState([]);
  const [templateProduct, setTemplateProduct] = useState(INITIAL_TEMPLATE_DATA);
  const [modalType, setModalType] = useState("");
  const [pagination, setPagination] = useState({});
  const AdminProductModalRef = useRef(null);

  const getProducts = async (page = 1) => {
    try {
      const response = await axios.get(
        `${API_BASE}/api/${API_PATH}/admin/products?page=${page}`,
      );
      setProducts(response.data.products);
      setPagination(response.data.pagination);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("hexToken="))
      ?.split("=")[1];
    if (!token) {
      alert("請先登入！");
      navigate("/login"); // 👈 6. 沒有 Token 直接踢回登入頁
      return;
    }

    // 補上 axios 預設標頭
      axios.defaults.headers.common["Authorization"] = token;
    

    const checkLogin = async () => {
      try {
        await axios.post(`${API_BASE}/api/user/check`);
        // 驗證成功，直接撈取產品列表
        getProducts();
      } catch (error) {
        console.log(error);
        alert("登入狀態已過期，請重新登入！");
        navigate("/login"); // 驗證失敗也踢回登入頁
      }
    };

    AdminProductModalRef.current = new bootstrap.Modal(
      AdminProductModalRef.current,
      {
        keyboard: false,
      },
    );

    checkLogin();
  }, [navigate]); //將 navigate 加入依賴陣列中

  const openModal = (type, product) => {
    // console.log(product);
    setModalType(type);
    setTemplateProduct({
      ...INITIAL_TEMPLATE_DATA,
      ...product,
    });
    AdminProductModalRef.current.show();
  };

  const closeModal = () => {
    AdminProductModalRef.current.hide();
  };

  return (
    <>
      <div className="container mt-4">
          <h2>滑雪場列表（後台管理）</h2>
          <div className="text-end mt-4">
            <button
              type="button"
              className="btn btn-dark"
              onClick={() => openModal("create", INITIAL_TEMPLATE_DATA)}
            >
              建立新的產品
            </button>
          </div>

          <table className="table">
            <thead>
              <tr>
                <th scope="col">分類</th>
                <th scope="col">雪場名稱</th>
                <th scope="col">原價</th>
                <th scope="col">售價</th>
                <th scope="col">是否啟用</th>
                <th scope="col">編輯</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <th scope="row">{product.category}</th>
                  <td>{product.title}</td>
                  <td>{product.origin_price}</td>
                  <td>{product.price}</td>
                  <td className={`${product.is_enabled && "text-success"}`}>
                    {product.is_enabled ? "啟用" : "未啟用"}
                  </td>
                  <td>
                    <div
                      className="btn-group"
                      role="group"
                      aria-label="Basic example"
                    >
                      <button
                        type="button"
                        className="btn btn-outline-dark btn-sm"
                        onClick={() => openModal("edit", product)}
                      >
                        編輯
                      </button>
                      <button
                        type="button"
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => openModal("delete", product)}
                      >
                        刪除
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination pagination={pagination} onChangePage={getProducts} />
      </div>
      

      <AdminProductModal
        ref={AdminProductModalRef}
        modalType={modalType}
        templateProduct={templateProduct}
        getProducts={getProducts}
        closeModal={closeModal}
      />
    </>
  );
}

export default AdminProducts;
