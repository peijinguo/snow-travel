import { Link } from "react-router";
import { useState } from "react";
import { useNavigate } from "react-router";

const featuredCollections = [
  {
    title: "海景雪場",
    description:
      "想把雪道與海港夜景排進同一天，這組精選整理了適合拍照、節奏舒服、也適合安排半日滑行的沿海雪場。",
    image:
      "https://image.kkday.com/v2/image/get/c_fit%2Cq_55%2Ct_webp%2Cw_960/s1.kkday.com/product_156102/20251217071646_kgqgV/jpg",
  },
  {
    title: "夜景雪場",
    description:
      "如果白天要安排移動、晚上還想補一段滑行，這裡收錄了夜滑氛圍佳、交通相對順手的城市周邊雪場。",
    image: "https://ppt.cc/fErqTx@.png",
  },
  {
    title: "新手入門",
    description:
      "從魔毯、緩坡到租借動線，我們把第一次滑雪最在意的資訊整理成一頁，幫你少走彎路、把時間留給練習。",
    image: "https://ppt.cc/fV0SIx@.jpg",
  },
  {
    title: "粉雪進階",
    description:
      "給已經滑過幾趟、開始在意雪況與地形變化的人。這區挑的都是值得為了雪質與路線再跑一趟的雪場。",
    image:
      "https://d2r4787i3zn8dn.cloudfront.net/site_images/images/bfd45a328d9d88b2044ba5ddf91e580de8d0adbe.jpg?1574817673",
  },
];

// 1. 新增下拉選單的城市資料
const cities = ["選取想去的城市", "小樽市", "旭川市", "當麻町", "新瀉縣", "增毛町", "上川町", "札幌市", "山形縣", "東川町"];

function Home() {
  // 2. 將初始值設為選單的第一個預設文字
  const [searchTerm, setSearchTerm] = useState("選取想去的城市");
  const navigate = useNavigate();

  const handleSearch = () => {
    // 3. 檢查是否有選取真正的城市（防呆預設提示
    if (searchTerm && searchTerm !== "選取想去的城市") {
    navigate(`/product?search=${encodeURIComponent(searchTerm)}`);
    }
  };

  return (
    <>
      <div className="container">
        <div className="row flex-md-row-reverse flex-column">
          <div className="col-md-6">
            <img
              src="https://ppt.cc/fEkAjx@.png"
              alt="日本地圖"
              className="img-fluid"
            />
          </div>
          <div className="col-md-6 d-flex flex-column justify-content-center mt-md-0 mt-3 text-start">
            <h2 className="fw-bold">關於雪季的理想生活</h2>
            <h5 className="fw-normal text-muted mt-2 lh-base">
              雪旅選場專門整理日本雪場的實際滑行感受、票價與行程靈感。
              不論你想找海景雪道、城市夜滑，還是適合新手起步的緩坡，
              都能先在這裡縮小選擇，再把時間留給真正值得去的那一座。
            </h5>

            <div className="input-group mb-0 mt-4 home-hero-group">
              <select
                className="form-select rounded-0"
                aria-label="選擇雪場地區"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              >
                {cities.map((city) => (
                  <option 
                    key={city} 
                    value={city} 
                    disabled={city === "選取想去的城市"} // 讓預設提示無法被重複選取
                  >
                    {city}
                  </option>
                ))}
              </select>
              <div className="input-group-append">
                <button
                  type="button"
                  className="btn btn-dark rounded-0"
                  onClick={handleSearch}
                  disabled={searchTerm === "選取想去的城市"} // 若沒選城市則將按鈕禁用
                >
                  開始挑雪場
                </button>
              </div>
            </div>
            <p className="small text-muted mt-3 mb-0">
              先從你最想去的城市開始找，例如「札幌市」、「旭川市」或「東川町」。
            </p>
          </div>
        </div>
        <div className="row mt-5 text-start">
          {featuredCollections.map((collection) => (
            <div className="col-md-6 mt-md-4" key={collection.title}>
              <div className="card border-0 mb-4 position-relative">
                <img
                  src={collection.image}
                  className="card-img-top rounded-0"
                  alt={collection.title}
                />
                <div className="card-body p-0">
                  <h4 className="mb-0 mt-4">{collection.title}</h4>
                  <div className="d-flex justify-content-between align-items-center mt-3">
                    <p className="card-text text-muted mb-0 w-75 lh-base">
                      {collection.description}
                    </p>
                    <Link
                      className="btn btn-outline-dark rounded-0 text-nowrap"
                      to={`/product?search=${encodeURIComponent(collection.title)}`}
                    >
                      查看清單
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-light py-7">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-5 text-center">
              <h3>先把想去的雪場收進清單，再慢慢排出你的雪季版本。</h3>
              <p className="text-muted lh-base">
                如果你已經有幾個地點在猶豫，不妨先從商品頁開始比較價格、特色與滑行節奏。
                當資訊整理得夠清楚，真正下決定就不需要靠猜。
              </p>
              <Link className="btn btn-dark mt-4 rounded-0" to="/product">
                瀏覽全部雪場
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
