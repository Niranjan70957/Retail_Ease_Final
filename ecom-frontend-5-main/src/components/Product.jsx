import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AppContext from "../Context/Context";
import API from "../axios";

const formatPrice = (price) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);

const Product = () => {
  const { id } = useParams();
  const { addToCart, removeFromCart, refreshData } = useContext(AppContext);
  const [product, setProduct] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    let active = true;
    let objectUrl = "";

    const fetchProduct = async () => {
      try {
        const response = await API.get(`/product/${id}`);
        if (active) {
          setProduct(response.data);
        }

        if (response.data.imageName) {
          const imageResponse = await API.get(`/product/${id}/image`, {
            responseType: "blob",
          });
          objectUrl = URL.createObjectURL(imageResponse.data);
          if (active) {
            setImageUrl(objectUrl);
          }
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    fetchProduct();

    return () => {
      active = false;
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [id]);

  const deleteProduct = async () => {
    try {
      await API.delete(`/product/${id}`);
      removeFromCart(Number(id));
      await refreshData();
      navigate("/");
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const handleAddToCart = () => {
    addToCart(product);
  };

  if (!product) {
    return (
      <div className="loading-state">
        <div>
          <span className="spinner-border" aria-hidden="true" />
          <span className="visually-hidden">Loading product</span>
        </div>
      </div>
    );
  }

  const releaseDate = product.releaseDate
    ? new Date(product.releaseDate).toLocaleDateString()
    : "Not specified";

  return (
    <section className="product-detail-page">
      <div className="product-detail">
        <div className="product-detail-media">
          {imageUrl ? (
            <img src={imageUrl} alt={product.name} />
          ) : (
            <span className="product-image-placeholder">
              <i className="bi bi-image" aria-hidden="true" />
            </span>
          )}
        </div>

        <div className="product-detail-content">
          <div className="detail-meta">
            <span className="category-badge">{product.category}</span>
            <span className="detail-date">
              <i className="bi bi-calendar3 me-2" aria-hidden="true" />
              Listed {releaseDate}
            </span>
          </div>

          <h1>{product.name}</h1>
          <div className="detail-brand">{product.brand}</div>
          <p className="detail-description">{product.description}</p>

          <div className="detail-purchase">
            <span className="detail-price">{formatPrice(product.price)}</span>
            <button
              className="primary-action"
              type="button"
              onClick={handleAddToCart}
              disabled={!product.productAvailable}
            >
              <i className="bi bi-bag-plus-fill" aria-hidden="true" />
              {product.productAvailable ? "Add to cart" : "Out of stock"}
            </button>
          </div>

          <p className="stock-copy">
            Available quantity: <strong>{product.stockQuantity}</strong>
          </p>

          <div className="detail-admin-actions">
            <button
              className="secondary-action"
              type="button"
              onClick={() => navigate(`/product/update/${id}`)}
            >
              <i className="bi bi-pencil-square" aria-hidden="true" />
              Update product
            </button>
            <button
              className="danger-action"
              type="button"
              onClick={deleteProduct}
            >
              <i className="bi bi-trash3-fill" aria-hidden="true" />
              Delete
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Product;
