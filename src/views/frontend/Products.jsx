import axios from "axios";
import { useEffect, useState } from "react";
import Pagination from "../../components/Pagination";
import { RotatingTriangles } from "react-loader-spinner";
import { useNavigate, useSearchParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { toggleWishList } from "../../slice/wishListSlice";
import { currency } from "../../utils/filter";

const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

const Products = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const [categories, setCategories] = useState([]);
  const [units, setUnits] = useState([]);
  const [currentCategory, setCurrentCategory] = useState("全部");
  const [isLoading, setIsLoading] = useState(true);

  const PAGE_SIZE = 6;

  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("search") || "";

  const dispatch = useDispatch();

  const wishList = useSelector((state) => state.wishList.wishList);

  const toggleWishListItem = (product) => {
    dispatch(toggleWishList(product));
  };

  useEffect(() => {
    const getAllProducts = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          `${API_BASE}/api/${API_PATH}/products/all`,
        );
        const productsData = response.data.products;
        setAllProducts(productsData);

        const categoriesData = [
          ...new Set(productsData.map((p) => p.category)),
        ];
        const unitsData = [...new Set(productsData.map((p) => p.unit))];
        setCategories(categoriesData);
        setUnits(unitsData);

        if (searchQuery) {
          const isCategory = categoriesData.includes(searchQuery);
          const isUnit = unitsData.includes(searchQuery);

          if (isCategory || isUnit) {
            setCurrentCategory(searchQuery);
          } else {
            setCurrentCategory("全部");
          }
        }
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    getAllProducts();
  }, [searchQuery]);

  useEffect(() => {
    if (searchQuery) {
      setCurrentCategory("全部");
      setCurrentPage(1);
    }
  }, [searchQuery]);

  const handleCategoryChange = (name) => {
    setCurrentCategory(name);
    setCurrentPage(1);

    if (searchQuery) {
      navigate("/product");
    }
  };

  const filteredProducts = allProducts.filter((product) => {
    if (currentCategory === "全部") {
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          product.title.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query)
        );
      }
      return true;
    }

    return (
      product.category === currentCategory || product.unit === currentCategory
    );
  });

  const displayProducts = filteredProducts.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  const totalPages = Math.ceil(filteredProducts.length / PAGE_SIZE);
  const customPagination = {
    current_page: currentPage,
    has_next: currentPage < totalPages,
    has_pre: currentPage > 1,
    total_pages: totalPages || 1,
  };

  const handleViewDetail = (e, id) => {
    e.preventDefault();
    navigate(`/product/${id}`);
  };

  return (
    <>
      <div className="container pt-3 pt-md-5 mt-md-5 mt-3 mb-7">
        <div className="row">
          <div className="col-md-4">
            <div
              className="accordion border border-bottom border-top-0 border-start-0 border-end-0 mb-3"
              id="accordionExample"
            >
              {/* 全部項目 */}
              <div className="card border-0">
                <div
                  className="card-header px-0 py-4 bg-white border border-bottom-0 border-top border-start-0 border-end-0 rounded-0"
                  id="headingzero"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapseZero"
                >
                  <div className="d-flex justify-content-between align-items-center pe-1">
                    <h4 className="mb-0">全部</h4>
                    <i className="bi bi-chevron-down"></i>
                  </div>
                </div>
                <div
                  id="collapseZero"
                  className="collapse"
                  aria-labelledby="headingzero"
                  data-bs-parent="#accordionExample"
                >
                  <div className="card-body py-0 text-start">
                    <ul className="list-unstyled ps-2">
                      <li>
                        <a
                          href="#"
                          className={`py-2 d-block ${currentCategory === "全部" ? "text-dark font-weight-bold active" : "text-muted"}`}
                          onClick={(e) => {
                            e.preventDefault();
                            handleCategoryChange("全部");
                          }}
                        >
                          全部商品
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* 特點分類 */}
                <div
                  className="card-header px-0 py-4 bg-white border border-bottom-0 border-top border-start-0 border-end-0 rounded-0"
                  id="headingOne"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapseOne"
                >
                  <div className="d-flex justify-content-between align-items-center pe-1">
                    <h4 className="mb-0">特點</h4>
                    <i className="bi bi-chevron-down"></i>
                  </div>
                </div>
                <div
                  id="collapseOne"
                  className={`collapse ${units.includes(currentCategory) ? "show" : ""}`}
                  aria-labelledby="headingOne"
                  data-bs-parent="#accordionExample"
                >
                  <div className="card-body py-0 text-start">
                    <ul className="list-unstyled ps-2">
                      {units.map((unit) => (
                        <li key={unit}>
                          <a
                            href="#"
                            className={`py-2 d-block ${currentCategory === unit ? "text-dark font-weight-bold active" : "text-muted"}`}
                            onClick={(e) => {
                              e.preventDefault();
                              handleCategoryChange(unit);
                            }}
                          >
                            {unit}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* 城市分類 */}
              <div className="card border-0">
                <div
                  className="card-header px-0 py-4 bg-white border border-bottom-0 border-top border-start-0 border-end-0 rounded-0"
                  id="headingTwo"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapseTwo"
                >
                  <div className="d-flex justify-content-between align-items-center pe-1">
                    <h4 className="mb-0">城市</h4>
                    <i className="bi bi-chevron-down"></i>
                  </div>
                </div>
                <div
                  id="collapseTwo"
                  className={`collapse ${categories.includes(currentCategory) ? "show" : ""}`}
                  aria-labelledby="headingTwo"
                  data-bs-parent="#accordionExample"
                >
                  <div className="card-body py-0 text-start">
                    <ul className="list-unstyled ps-2">
                      {categories.map((category) => (
                        <li key={category}>
                          <a
                            href="#"
                            className={`py-2 d-block ${currentCategory === category ? "text-dark font-weight-bold active" : "text-muted"}`}
                            onClick={(e) => {
                              e.preventDefault();
                              handleCategoryChange(category);
                            }}
                          >
                            {category}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-8">
            {isLoading ? (
              <div
                className="d-flex justify-content-center align-items-center"
                style={{ minHeight: "300px", width: "100%" }}
              >
                <RotatingTriangles />
              </div>
            ) : (
              <>
                <div className="row">
                  {displayProducts.map((product) => (
                    <div className="col-md-6" key={product.id}>
                      <div className="card border-0 shadow-none mb-4 position-relative">
                        <img
                          src={product.imageUrl}
                          className="card-img-top rounded-0"
                          alt={product.title}
                        />
                        <button
                          type="button"
                          className="btn border-0 text-dark position-absolute"
                          style={{
                            right: "16px",
                            top: "16px",
                            outline: "none",
                            backgroundColor: "transparent",
                            zIndex: 2,
                          }}
                          onClick={() => toggleWishListItem(product)}
                        >
                          <i
                            className={`${wishList.some(item => (item?.product?.id || item?.id) === product.id) ? "fas text-danger" : "far"} fa-heart`}
                          ></i>
                        </button>
                        <div className="card-body p-0 text-start">
                          <h4 className="mb-0 mt-3 text-start">
                            <a
                              href="#"
                              onClick={(e) => handleViewDetail(e, product.id)}
                            >
                              {product.title}
                            </a>
                          </h4>
                          <p className="card-text text-muted mb-0 mt-2 text-start">
                            {product.description}
                          </p>
                          <p className="card-text text-muted mb-0 mt-5 text-start">{currency(product.price)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <nav className="d-flex justify-content-center">
                  <Pagination
                    pagination={customPagination}
                    onChangePage={(page) => setCurrentPage(page)}
                  />
                </nav>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Products;
