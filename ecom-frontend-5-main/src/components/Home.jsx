import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../axios";
import AppContext from "../Context/Context";
import unplugged from "../assets/unplugged.png";

const categories = [
  "All",
  "Laptop",
  "Headphone",
  "Mobile",
  "Electronics",
  "Toys",
  "Fashion",
];

const formatPrice = (price) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(price);

const Home = ({ selectedCategory, onSelectCategory }) => {
  const { data, isError, addToCart, refreshData } = useContext(AppContext);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  useEffect(() => {
    if (!data) {
      return undefined;
    }

    let active = true;
    const imageUrls = [];

    const loadProducts = async () => {
      const updatedProducts = await Promise.all(
        data.map(async (product) => {
          try {
            const response = await API.get(`/product/${product.id}/image`, {
              responseType: "blob",
            });
            const imageUrl = URL.createObjectURL(response.data);
            imageUrls.push(imageUrl);
            return { ...product, imageUrl };
          } catch (error) {
            console.error("Error fetching product image:", error);
            return { ...product, imageUrl: "" };
          }
        })
      );

      if (active) {
        setProducts(updatedProducts);
      }
    };

    loadProducts();

    return () => {
      active = false;
      imageUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [data]);

  const filteredProducts = selectedCategory
    ? products.filter((product) => product.category === selectedCategory)
    : products;

  const handleCategoryClick = (category) => {
    onSelectCategory(category === "All" ? "" : category);
  };

  if (isError) {
    return (
      <section className="catalog-section">
        <div className="error-state">
          <div>
            <img src={unplugged} alt="" />
            <h2>Store connection unavailable</h2>
            <p>Check that the product API is running and refresh the page.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <div className="home-page">
      <section className="store-hero">
        <div className="hero-copy">
          <p className="eyebrow">Fresh finds. Bright prices.</p>
          <h1>RetailEase</h1>
          <p>
            Discover everyday tech, fashion, toys, and essentials in one
            colorful collection.
          </p>
          <a className="hero-action" href="#catalog">
            Shop the collection
            <i className="bi bi-arrow-down" aria-hidden="true" />
          </a>
        </div>
        <div className="hero-art" aria-hidden="true">
          <span className="hero-tile">
            <i className="bi bi-headphones" />
          </span>
          <span className="hero-tile">
            <i className="bi bi-phone" />
          </span>
          <span className="hero-tile">
            <i className="bi bi-controller" />
          </span>
          <span className="hero-tile">
            <i className="bi bi-handbag-fill" />
          </span>
        </div>
      </section>

      <section className="catalog-section" id="catalog">
        <div className="catalog-heading">
          <div>
            <h2>{selectedCategory || "Explore all products"}</h2>
            <p>Useful picks, clear prices, and simple shopping.</p>
          </div>
          <span className="product-count">
            {filteredProducts.length}{" "}
            {filteredProducts.length === 1 ? "product" : "products"}
          </span>
        </div>

        <div className="category-strip" aria-label="Product categories">
          {categories.map((category) => {
            const value = category === "All" ? "" : category;
            return (
              <button
                key={category}
                className={`category-chip ${
                  selectedCategory === value ? "active" : ""
                }`}
                type="button"
                onClick={() => handleCategoryClick(category)}
              >
                {category}
              </button>
            );
          })}
        </div>

        {filteredProducts.length === 0 ? (
          <div className="empty-state">
            <div>
              <i className="bi bi-box-seam" aria-hidden="true" />
              <h3>No products here yet</h3>
              <p>Add a product or choose another category.</p>
            </div>
          </div>
        ) : (
          <div className="product-grid">
            {filteredProducts.map((product) => (
              <article
                className={`product-card ${
                  product.productAvailable ? "" : "unavailable"
                }`}
                key={product.id}
              >
                <Link
                  className="product-card-link"
                  to={`/product/${product.id}`}
                >
                  <div className="product-image-wrap">
                    {product.imageUrl ? (
                      <img
                        className="product-image"
                        src={product.imageUrl}
                        alt={product.name}
                      />
                    ) : (
                      <span className="product-image-placeholder">
                        <i className="bi bi-image" aria-hidden="true" />
                      </span>
                    )}
                    <span
                      className={`stock-badge ${
                        product.productAvailable ? "" : "out"
                      }`}
                    >
                      {product.productAvailable ? "In stock" : "Out of stock"}
                    </span>
                  </div>
                </Link>

                <div className="product-card-body">
                  <Link
                    className="product-card-link"
                    to={`/product/${product.id}`}
                  >
                    <span className="category-badge">{product.category}</span>
                    <p className="product-brand">{product.brand}</p>
                    <h3 className="product-name">{product.name}</h3>
                  </Link>
                  <div className="product-card-footer">
                    <span className="product-price-label">
                      {formatPrice(product.price)}
                    </span>
                    <button
                      className="add-cart-button"
                      type="button"
                      onClick={() => addToCart(product)}
                      disabled={!product.productAvailable}
                    >
                      <i className="bi bi-bag-plus-fill" aria-hidden="true" />
                      {product.productAvailable ? "Add" : "Unavailable"}
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
