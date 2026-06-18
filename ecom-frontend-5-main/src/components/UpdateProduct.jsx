import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../axios";

const categories = [
  "Laptop",
  "Headphone",
  "Mobile",
  "Electronics",
  "Toys",
  "Fashion",
];

const UpdateProduct = () => {
  const { id } = useParams();
  const [image, setImage] = useState();
  const [imagePreview, setImagePreview] = useState("");
  const [updateProduct, setUpdateProduct] = useState({
    id: null,
    name: "",
    description: "",
    brand: "",
    price: "",
    category: "",
    releaseDate: "",
    productAvailable: false,
    stockQuantity: "",
  });

  useEffect(() => {
    let previewUrl = "";

    const fetchProduct = async () => {
      try {
        const response = await API.get(`/product/${id}`);
        const responseImage = await API.get(`/product/${id}/image`, {
          responseType: "blob",
        });
        const imageFile = new File(
          [responseImage.data],
          response.data.imageName,
          { type: responseImage.data.type }
        );

        previewUrl = URL.createObjectURL(imageFile);
        setImage(imageFile);
        setImagePreview(previewUrl);
        setUpdateProduct(response.data);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    fetchProduct();

    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [id]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("imageFile", image);
    formData.append(
      "product",
      new Blob([JSON.stringify(updateProduct)], { type: "application/json" })
    );

    try {
      await API.put(`/product/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Product updated successfully");
    } catch (error) {
      console.error("Error updating product:", error);
      alert("Failed to update product. Please try again.");
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setUpdateProduct((current) => ({ ...current, [name]: value }));
  };

  const handleImageChange = (event) => {
    const nextImage = event.target.files[0];
    if (!nextImage) {
      return;
    }

    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
    setImage(nextImage);
    setImagePreview(URL.createObjectURL(nextImage));
  };

  return (
    <section className="product-form-page">
      <div className="form-shell update-form-shell">
        <div className="page-heading">
          <span className="heading-icon" aria-hidden="true">
            <i className="bi bi-pencil-fill" />
          </span>
          <div>
            <h1>Update product</h1>
            <p>Keep the listing accurate, current, and ready to shop.</p>
          </div>
        </div>

        <form className="row g-3 product-form" onSubmit={handleSubmit}>
          <div className="col-md-6">
            <label className="form-label" htmlFor="name">
              Product name
            </label>
            <input
              type="text"
              className="form-control"
              value={updateProduct.name}
              onChange={handleChange}
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
              value={updateProduct.brand}
              onChange={handleChange}
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
              name="description"
              onChange={handleChange}
              value={updateProduct.description}
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
              onChange={handleChange}
              value={updateProduct.price}
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
              value={updateProduct.category}
              onChange={handleChange}
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
              onChange={handleChange}
              value={updateProduct.stockQuantity}
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
              value={updateProduct.releaseDate || ""}
              name="releaseDate"
              onChange={handleChange}
              id="releaseDate"
              required
            />
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="imageUrl">
              Replace image
            </label>
            <input
              className="form-control"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              name="imageUrl"
              id="imageUrl"
            />
          </div>
          <div className="col-12">
            <div className="image-preview">
              {imagePreview ? (
                <img src={imagePreview} alt={updateProduct.name} />
              ) : (
                <span>Image preview</span>
              )}
            </div>
          </div>
          <div className="col-12">
            <div className="form-check form-switch availability-toggle">
              <input
                className="form-check-input"
                type="checkbox"
                role="switch"
                name="productAvailable"
                id="productAvailable"
                checked={Boolean(updateProduct.productAvailable)}
                onChange={(event) =>
                  setUpdateProduct((current) => ({
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
              <i className="bi bi-check2-circle" aria-hidden="true" />
              Save changes
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default UpdateProduct;
