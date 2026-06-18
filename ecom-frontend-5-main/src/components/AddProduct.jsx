import { useState } from "react";
import API from "../axios";

const categories = [
  "Laptop",
  "Headphone",
  "Mobile",
  "Electronics",
  "Toys",
  "Fashion",
];

const AddProduct = () => {
  const [product, setProduct] = useState({
    name: "",
    brand: "",
    description: "",
    price: "",
    category: "",
    stockQuantity: "",
    releaseDate: "",
    productAvailable: false,
  });
  const [image, setImage] = useState(null);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setProduct((current) => ({ ...current, [name]: value }));
  };

  const submitHandler = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("imageFile", image);
    formData.append(
      "product",
      new Blob([JSON.stringify(product)], { type: "application/json" })
    );

    try {
      await API.post("/product", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Product added successfully");
    } catch (error) {
      console.error("Error adding product:", error);
      alert("Error adding product");
    }
  };

  return (
    <section className="product-form-page">
      <div className="form-shell">
        <div className="page-heading">
          <span className="heading-icon" aria-hidden="true">
            <i className="bi bi-plus-lg" />
          </span>
          <div>
            <h1>Add a product</h1>
            <p>Create a colorful new listing for the storefront.</p>
          </div>
        </div>

        <form className="row g-3 product-form" onSubmit={submitHandler}>
          <div className="col-md-6">
            <label className="form-label" htmlFor="name">
              Product name
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="Wireless headphones"
              onChange={handleInputChange}
              value={product.name}
              name="name"
              id="name"
              required
            />
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="brand">
              Brand
            </label>
            <input
              type="text"
              name="brand"
              className="form-control"
              placeholder="Brand name"
              value={product.brand}
              onChange={handleInputChange}
              id="brand"
              required
            />
          </div>
          <div className="col-12">
            <label className="form-label" htmlFor="description">
              Description
            </label>
            <textarea
              className="form-control"
              placeholder="Describe the product, its features, and condition"
              value={product.description}
              name="description"
              onChange={handleInputChange}
              id="description"
              required
            />
          </div>
          <div className="col-md-4">
            <label className="form-label" htmlFor="price">
              Price
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              className="form-control"
              placeholder="99.00"
              onChange={handleInputChange}
              value={product.price}
              name="price"
              id="price"
              required
            />
          </div>
          <div className="col-md-4">
            <label className="form-label" htmlFor="category">
              Category
            </label>
            <select
              className="form-select"
              value={product.category}
              onChange={handleInputChange}
              name="category"
              id="category"
              required
            >
              <option value="">Select category</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-4">
            <label className="form-label" htmlFor="stockQuantity">
              Stock quantity
            </label>
            <input
              type="number"
              min="0"
              className="form-control"
              placeholder="10"
              onChange={handleInputChange}
              value={product.stockQuantity}
              name="stockQuantity"
              id="stockQuantity"
              required
            />
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="releaseDate">
              Release date
            </label>
            <input
              type="date"
              className="form-control"
              value={product.releaseDate}
              name="releaseDate"
              onChange={handleInputChange}
              id="releaseDate"
              required
            />
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="image">
              Product image
            </label>
            <input
              className="form-control"
              type="file"
              accept="image/*"
              onChange={(event) => setImage(event.target.files[0])}
              id="image"
              required
            />
          </div>
          <div className="col-12">
            <div className="form-check form-switch availability-toggle">
              <input
                className="form-check-input"
                type="checkbox"
                role="switch"
                name="productAvailable"
                id="productAvailable"
                checked={product.productAvailable}
                onChange={(event) =>
                  setProduct((current) => ({
                    ...current,
                    productAvailable: event.target.checked,
                  }))
                }
              />
              <label className="form-check-label ms-2" htmlFor="productAvailable">
                Product is available for purchase
              </label>
            </div>
          </div>
          <div className="col-12 form-submit-row">
            <button type="submit" className="primary-action">
              <i className="bi bi-cloud-arrow-up-fill" aria-hidden="true" />
              Publish product
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default AddProduct;
