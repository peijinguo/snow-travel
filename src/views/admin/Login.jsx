import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_BASE;

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const eventHandler = (e) => {
    const { name, value } = e.target;
    setFormData((preData) => ({
      ...preData,
      [name]: value,
    }));
  };

  const onSubmit = async (e) => {
    try {
      e.preventDefault();
      const response = await axios.post(`${API_BASE}/admin/signin`, formData);

      const { token, expired } = response.data;
      document.cookie = `hexToken=${token}; expired=${new Date(expired)};`;
      axios.defaults.headers.common["Authorization"] = token;

      // 登入成功, 取得Token存到cookie, Token放到header, 設定控制畫面的參數設定成true
      navigate("/admin/products");
    } catch (error) {
      console.log(error.response);
      alert("登入失敗：" + (error.response?.data?.message || "請檢查帳密"));
    }
  };

  return (
    <div className="container ">
      <div className="row justify-content-center">
        <div
          className="col-md-4 bg-white py-5"
          style={{
            minHeight: "75vh",
          }}
        >
          <div className="d-flex justify-content-center pb-3 mb-4">
            <h2 className="mt-2">後台管理</h2>
          </div>

          <form className="form-floating " onSubmit={(e) => onSubmit(e)}>
            <div className="form-floating mb-3">
              <input
                type="email"
                className="form-control"
                name="username"
                placeholder="name@example.com"
                value={formData.username}
                onChange={(e) => {
                  eventHandler(e);
                }}
              />
              <label htmlFor="username">Email address</label>
            </div>
            <div className="form-floating mb-4">
              <input
                type="password"
                className="form-control"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={(e) => {
                  eventHandler(e);
                }}
              />
              <label htmlFor="password">Password</label>
            </div>
            <button type="submit" className="btn btn-dark w-100 py-3 mt-2">
              登入
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
