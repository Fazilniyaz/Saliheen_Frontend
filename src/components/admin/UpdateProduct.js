import { Fragment, useEffect, useState } from "react";
import Sidebar from "./SideBar";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getProduct, updateProduct } from "../../actions/productActions";
import { clearError, clearProductUpdated } from "../../slices/productSlice";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function UpdateProduct() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [price3mlAttar, setPrice3mlAttar] = useState("");
  const [price6mlAttar, setPrice6mlAttar] = useState("");
  const [price12mlAttar, setPrice12mlAttar] = useState("");
  const [price24mlAttar, setPrice24mlAttar] = useState("");
  const [price20mlPerfume, setPrice20mlPerfume] = useState("");
  const [price50mlPerfume, setPrice50mlPerfume] = useState("");
  const [price100mlPerfume, setPrice100mlPerfume] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [stock, setStock] = useState(0);
  const [node, setNode] = useState("");
  const [color, setColor] = useState("");
  const [type, setType] = useState("");
  const [images, setImages] = useState([]);
  const [imagesCleared, setImagesCleared] = useState(false);
  const [imagesPreview, setImagesPreview] = useState([]);

  const { loading, isProductUpdated, error, product } = useSelector(
    (state) => state.productState
  );
  const { id: productId } = useParams();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onImagesChange = (e) => {
    const files = Array.from(e.target.files);

    files.forEach((file) => {
      const reader = new FileReader();

      reader.onload = () => {
        if (reader.readyState === 2) {
          setImagesPreview((oldArray) => [...oldArray, reader.result]);
          setImages((oldArray) => [...oldArray, file]);
        }
      };

      reader.readAsDataURL(file);
    });
  };

  const submitHandler = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("price", price);
    formData.append("price3mlAttar", price3mlAttar);
    formData.append("price6mlAttar", price6mlAttar);
    formData.append("price12mlAttar", price12mlAttar);
    formData.append("price24mlAttar", price24mlAttar);
    formData.append("price20mlPerfume", price20mlPerfume);
    formData.append("price50mlPerfume", price50mlPerfume);
    formData.append("price100mlPerfume", price100mlPerfume);
    formData.append("description", description);
    formData.append("category", category);
    formData.append("stock", stock);
    formData.append("node", node);
    formData.append("color", color);
    formData.append("type", type);
    images.forEach((image) => {
      formData.append("images", image);
    });
    formData.append("imagesCleared", imagesCleared);

    dispatch(updateProduct(productId, formData));
  };

  const clearImagesHandler = () => {
    setImages([]);
    setImagesPreview([]);
    setImagesCleared(true);
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get(
          "https://saliheenperfumes-zd2i.onrender.com/api/v1/admin/category",
          { withCredentials: true }
        );
        if (data.success) {
          setCategories(data.categories);
        } else {
          toast.error("Failed to fetch categories.");
        }
      } catch (error) {
        toast.error("Error fetching categories.");
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    if (isProductUpdated) {
      toast("Product Updated Successfully!", {
        type: "success",
        position: "bottom-center",
        onOpen: () => dispatch(clearProductUpdated()),
      });
      setImages([]);
      return;
    }

    if (error) {
      toast(error, {
        position: "bottom-center",
        type: "error",
        onOpen: () => {
          dispatch(clearError());
        },
      });
      return;
    }

    dispatch(getProduct(productId));
  }, [isProductUpdated, error, dispatch, productId]);

  useEffect(() => {
    if (product && product._id) {
      setName(product.name);
      setPrice(product.price);
      setPrice3mlAttar(product.price3mlAttar);
      setPrice6mlAttar(product.price6mlAttar);
      setPrice12mlAttar(product.price12mlAttar);
      setPrice24mlAttar(product.price24mlAttar);
      setPrice20mlPerfume(product.price20mlPerfume);
      setPrice50mlPerfume(product.price50mlPerfume);
      setPrice100mlPerfume(product.price100mlPerfume);
      setStock(product.stock);
      setDescription(product.description);
      setCategory(product.category);
      setNode(product.node);
      setColor(product.color);
      setType(product.type);

      let images = [];
      product.images.forEach((image) => {
        images.push(image.image);
      });
      setImagesPreview(images);
    }
  }, [product]);

  return (
    <div className="admin-page-wrapper">
      <Sidebar />

      <div className="admin-page-content">
        {/* ── Page Header ── */}
        <div className="page-header">
          <div>
            <h1 className="page-title">
              <i className="fas fa-edit"></i>
              Update Product
            </h1>
            <p className="page-subtitle">Edit and save changes to the product</p>
          </div>
        </div>

        {/* ── Form Card ── */}
        <div className="np-form-shell">
          <form onSubmit={submitHandler} encType="multipart/form-data">

            {/* ── Section: Basic Info ── */}
            <div className="np-section">
              <div className="np-section-label">
                <i className="fas fa-tag"></i> Basic Info
              </div>
              <div className="np-grid-2">
                <div className="np-field">
                  <label className="np-label" htmlFor="name_field">Product Name</label>
                  <input
                    type="text"
                    id="name_field"
                    className="np-input"
                    placeholder="e.g. Velvet Musk"
                    onChange={(e) => setName(e.target.value)}
                    value={name}
                  />
                </div>
                <div className="np-field">
                  <label className="np-label" htmlFor="type_field">Type</label>
                  <input
                    type="text"
                    id="type_field"
                    className="np-input"
                    placeholder="e.g. Attar / Perfume"
                    onChange={(e) => setType(e.target.value)}
                    value={type}
                  />
                </div>
                <div className="np-field">
                  <label className="np-label" htmlFor="category_field">Category</label>
                  <select
                    id="category_field"
                    className="np-input np-select"
                    onChange={(e) => setCategory(e.target.value)}
                    value={category}
                  >
                    <option value="">Select category…</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.name}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="np-field">
                  <label className="np-label" htmlFor="stock_field">Stock</label>
                  <input
                    type="number"
                    id="stock_field"
                    className="np-input"
                    placeholder="0"
                    onChange={(e) => setStock(Number(e.target.value))}
                    value={stock}
                    min="0"
                  />
                </div>
              </div>
            </div>

            {/* ── Section: Extra Details ── */}
            <div className="np-section">
              <div className="np-section-label">
                <i className="fas fa-sliders-h"></i> Extra Details
              </div>
              <div className="np-grid-2">
                <div className="np-field">
                  <label className="np-label" htmlFor="price_field">Base Price</label>
                  <div className="np-input-prefix-wrap">
                    <span className="np-prefix">₹</span>
                    <input
                      type="text"
                      id="price_field"
                      className="np-input np-input-has-prefix"
                      placeholder="0.00"
                      onChange={(e) => setPrice(e.target.value)}
                      value={price}
                    />
                  </div>
                </div>
                <div className="np-field">
                  <label className="np-label" htmlFor="node_field">Node</label>
                  <input
                    type="text"
                    id="node_field"
                    className="np-input"
                    placeholder="e.g. Woody / Floral"
                    onChange={(e) => setNode(e.target.value)}
                    value={node}
                  />
                </div>
                <div className="np-field">
                  <label className="np-label" htmlFor="color_field">Color</label>
                  <input
                    type="text"
                    id="color_field"
                    className="np-input"
                    placeholder="e.g. Amber"
                    onChange={(e) => setColor(e.target.value)}
                    value={color}
                  />
                </div>
              </div>
            </div>

            {/* ── Section: Description ── */}
            <div className="np-section">
              <div className="np-section-label">
                <i className="fas fa-align-left"></i> Description
              </div>
              <div className="np-field">
                <textarea
                  className="np-input np-textarea"
                  id="description_field"
                  rows="5"
                  placeholder="Describe the product — notes, longevity, occasion…"
                  onChange={(e) => setDescription(e.target.value)}
                  value={description}
                />
              </div>
            </div>

            {/* ── Section: Attar Prices ── */}
            <div className="np-section">
              <div className="np-section-label">
                <i className="fas fa-flask"></i> Attar Prices
              </div>
              <div className="np-grid-4">
                {[
                  { label: "3 ml", val: price3mlAttar, set: setPrice3mlAttar },
                  { label: "6 ml", val: price6mlAttar, set: setPrice6mlAttar },
                  { label: "12 ml", val: price12mlAttar, set: setPrice12mlAttar },
                  { label: "24 ml", val: price24mlAttar, set: setPrice24mlAttar },
                ].map(({ label, val, set }) => (
                  <div className="np-field" key={label}>
                    <label className="np-label">{label}</label>
                    <div className="np-input-prefix-wrap">
                      <span className="np-prefix">₹</span>
                      <input
                        type="text"
                        className="np-input np-input-has-prefix"
                        placeholder="0.00"
                        onChange={(e) => set(e.target.value)}
                        value={val}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Section: Perfume Prices ── */}
            <div className="np-section">
              <div className="np-section-label">
                <i className="fas fa-spray-can"></i> Perfume Prices
              </div>
              <div className="np-grid-4">
                {[
                  { label: "20 ml", val: price20mlPerfume, set: setPrice20mlPerfume },
                  { label: "50 ml", val: price50mlPerfume, set: setPrice50mlPerfume },
                  { label: "100 ml", val: price100mlPerfume, set: setPrice100mlPerfume },
                ].map(({ label, val, set }) => (
                  <div className="np-field" key={label}>
                    <label className="np-label">{label}</label>
                    <div className="np-input-prefix-wrap">
                      <span className="np-prefix">₹</span>
                      <input
                        type="text"
                        className="np-input np-input-has-prefix"
                        placeholder="0.00"
                        onChange={(e) => set(e.target.value)}
                        value={val}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Section: Images ── */}
            <div className="np-section">
              <div className="np-section-label">
                <i className="fas fa-images"></i> Product Images
              </div>
              <div className="np-field">
                <label className="np-file-label" htmlFor="customFile">
                  <i className="fas fa-cloud-upload-alt"></i>
                  <span>Click to upload images</span>
                  <span className="np-file-hint">PNG, JPG, WEBP supported</span>
                  <input
                    type="file"
                    name="product_images"
                    id="customFile"
                    multiple
                    onChange={onImagesChange}
                    style={{ display: "none" }}
                  />
                </label>

                {imagesPreview.length > 0 && (
                  <>
                    <div className="np-preview-grid">
                      {imagesPreview.map((image, idx) => (
                        <div className="np-preview-item" key={idx}>
                          <img src={image} alt={`Preview ${idx + 1}`} />
                        </div>
                      ))}
                    </div>
                    <button
                      type="button"
                      className="np-btn-clear-images"
                      onClick={clearImagesHandler}
                    >
                      <i className="fas fa-trash"></i> Clear All Images
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* ── Submit ── */}
            <div className="np-form-footer">
              <button
                type="button"
                className="np-btn-cancel"
                onClick={() => navigate("/admin/products")}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="np-btn-submit"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="np-spinner"></span>
                    Updating…
                  </>
                ) : (
                  <>
                    <i className="fas fa-save"></i>
                    Update Product
                  </>
                )}
              </button>
            </div>

          </form>
        </div>
      </div>

      {/* ── Inline styles scoped to UpdateProduct ── */}
      <style>{`
        /* ── Form shell ── */
        .np-form-shell {
          margin: 24px 28px 48px;
          background: var(--black-2);
          border: 1px solid var(--black-4);
          border-radius: var(--radius-lg);
          overflow: hidden;
        }

        /* ── Sections ── */
        .np-section {
          padding: 24px 28px;
          border-bottom: 1px solid var(--black-4);
        }
        .np-section:last-of-type { border-bottom: none; }

        .np-section-label {
          font-size: 0.68rem;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--gray-3);
          margin-bottom: 18px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .np-section-label i { color: var(--gray-2); font-size: 0.75rem; }

        /* ── Grid layouts ── */
        .np-grid-2 {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
        }
        .np-grid-4 {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
        }
        @media (max-width: 900px) {
          .np-grid-4 { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 600px) {
          .np-grid-2 { grid-template-columns: 1fr; }
          .np-grid-4 { grid-template-columns: repeat(2, 1fr); }
          .np-form-shell { margin: 16px; }
        }

        /* ── Field ── */
        .np-field { display: flex; flex-direction: column; gap: 6px; }

        /* ── Label ── */
        .np-label {
          font-size: 0.75rem;
          font-weight: 600;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: var(--gray-4);
        }

        /* ── Input / Select / Textarea ── */
        .np-input {
          width: 100%;
          background: var(--black-3);
          border: 1px solid var(--black-4);
          border-radius: var(--radius-sm);
          color: var(--white-dim);
          font-family: var(--font-body);
          font-size: 0.9rem;
          padding: 10px 14px;
          outline: none;
          transition: border-color 0.15s ease, background 0.15s ease;
          -webkit-appearance: none;
        }
        .np-input::placeholder { color: var(--gray-3); }
        .np-input:focus {
          border-color: var(--gray-2);
          background: var(--black-4);
        }

        .np-select {
          cursor: pointer;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%236b6b6b' d='M6 8L1 3h10z'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 12px center;
          padding-right: 36px;
        }
        .np-select option {
          background: var(--black-3);
          color: var(--white-dim);
        }

        .np-textarea {
          resize: vertical;
          min-height: 120px;
          line-height: 1.6;
        }

        /* ── Prefix input (₹) ── */
        .np-input-prefix-wrap {
          position: relative;
          display: flex;
          align-items: center;
        }
        .np-prefix {
          position: absolute;
          left: 12px;
          font-size: 0.85rem;
          color: var(--gray-3);
          font-family: var(--font-mono);
          pointer-events: none;
          z-index: 1;
        }
        .np-input-has-prefix { padding-left: 28px; }

        /* ── File upload ── */
        .np-file-label {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 32px 24px;
          background: var(--black-3);
          border: 1px dashed var(--gray-2);
          border-radius: var(--radius-md);
          cursor: pointer;
          transition: border-color 0.15s ease, background 0.15s ease;
          text-align: center;
        }
        .np-file-label:hover {
          border-color: var(--gray-4);
          background: var(--black-4);
        }
        .np-file-label i {
          font-size: 1.8rem;
          color: var(--gray-3);
        }
        .np-file-label span {
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--gray-4);
        }
        .np-file-hint {
          font-size: 0.72rem !important;
          font-weight: 400 !important;
          color: var(--gray-3) !important;
          font-family: var(--font-mono);
        }

        /* ── Image preview grid ── */
        .np-preview-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 16px;
        }
        .np-preview-item {
          width: 80px;
          height: 80px;
          border-radius: var(--radius-sm);
          border: 1px solid var(--black-4);
          overflow: hidden;
          background: var(--black-3);
          flex-shrink: 0;
        }
        .np-preview-item img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        /* ── Clear images button ── */
        .np-btn-clear-images {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          margin-top: 12px;
          padding: 7px 14px;
          background: transparent;
          border: 1px solid var(--gray-1);
          border-radius: var(--radius-sm);
          color: var(--gray-3);
          font-family: var(--font-body);
          font-size: 0.75rem;
          font-weight: 600;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.15s ease;
        }
        .np-btn-clear-images:hover {
          border-color: #c0392b;
          color: #e74c3c;
          background: rgba(231, 76, 60, 0.06);
        }

        /* ── Footer buttons ── */
        .np-form-footer {
          display: flex;
          justify-content: flex-end;
          align-items: center;
          gap: 12px;
          padding: 20px 28px;
          background: var(--black-3);
          border-top: 1px solid var(--black-4);
        }

        .np-btn-cancel {
          padding: 10px 20px;
          background: transparent;
          border: 1px solid var(--gray-1);
          border-radius: var(--radius-sm);
          color: var(--gray-4);
          font-family: var(--font-body);
          font-size: 0.82rem;
          font-weight: 600;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.15s ease;
        }
        .np-btn-cancel:hover {
          border-color: var(--gray-3);
          color: var(--pure-white);
          background: var(--black-4);
        }

        .np-btn-submit {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 24px;
          background: var(--pure-white);
          border: none;
          border-radius: var(--radius-sm);
          color: var(--black);
          font-family: var(--font-body);
          font-size: 0.82rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.15s ease;
        }
        .np-btn-submit:hover:not(:disabled) {
          background: var(--gray-5);
        }
        .np-btn-submit:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        /* ── Spinner ── */
        .np-spinner {
          width: 14px;
          height: 14px;
          border: 2px solid var(--black-4);
          border-top-color: var(--black);
          border-radius: 50%;
          animation: np-spin 0.6s linear infinite;
          flex-shrink: 0;
        }
        @keyframes np-spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}