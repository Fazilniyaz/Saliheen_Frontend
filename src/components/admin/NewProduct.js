import { Fragment, useEffect, useState } from "react";
import Sidebar from "./SideBar";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createNewProduct } from "../../actions/productActions";
import { clearError, clearProductCreated } from "../../slices/productSlice";
import { toast } from "react-toastify";
import axios from "axios";

export default function NewProduct() {
  const [name, setName] = useState("");
  // const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [price3mlAttar, setPrice3mlAttar] = useState("");
  const [price6mlAttar, setPrice6mlAttar] = useState("");
  const [price12mlAttar, setPrice12mlAttar] = useState("");
  const [price24mlAttar, setPrice24mlAttar] = useState("");
  const [price20mlPerfume, setPrice20mlPerfume] = useState("");
  const [price50mlPerfume, setPrice50mlPerfume] = useState("");
  const [price100mlPerfume, setPrice100mlPerfume] = useState("");
  const [categories, setCategories] = useState([]); // For fetched categories
  const [selectedCategory, setSelectedCategory] = useState(""); // For selected category
  const [stock, setStock] = useState(0);
  const [type, setType] = useState("");
  // const [collection, setCollection] = useState("");
  // const [brand, setBrand] = useState("");
  // const [gender, setGender] = useState("");
  // const [strapMaterial, setStrapMaterial] = useState("");
  // const [dialColor, setDialColor] = useState("");
  // const [productFunction, setProductFunction] = useState("");
  const [images, setImages] = useState([]);
  const [imagesPreview, setImagesPreview] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get("/api/v1/admin/category");
        if (data.success) {
          setCategories(
            data.categories.map((cat) => {
              if (cat.isActive == true) {
                return cat.name;
              }
            })
          ); // Extract category names
        }
      } catch (error) {
        toast("Failed to load categories", {
          type: "error",
          position: "bottom-center",
        });
      }
    };

    fetchCategories();
  }, []);

  const { loading, isProductCreated, error } = useSelector(
    (state) => state.productState
  );

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
    // formData.append("price", price);
    formData.append("price3mlAttar", price3mlAttar);
    formData.append("price6mlAttar", price6mlAttar);
    formData.append("price12mlAttar", price12mlAttar);
    formData.append("price24mlAttar", price24mlAttar);
    formData.append("price20mlPerfume", price20mlPerfume);
    formData.append("price50mlPerfume", price50mlPerfume);
    formData.append("price100mlPerfume", price100mlPerfume);
    formData.append("description", description);
    formData.append("category", selectedCategory);
    formData.append("stock", stock);
    formData.append("type", type);
    // formData.append("collection", collection);
    // formData.append("brand", brand);
    // formData.append("gender", gender);
    // formData.append("strapMaterial", strapMaterial);
    // formData.append("dialColor", dialColor);
    // formData.append("function", productFunction);
    images.forEach((image) => {
      formData.append("images", image);
    });

    dispatch(createNewProduct(formData));
  };

  useEffect(() => {
    if (isProductCreated) {
      toast("Product Created Successfully!", {
        type: "success",
        position: "bottom-center",
        onOpen: () => dispatch(clearProductCreated()),
      });
      navigate("/admin/products");
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
  }, [isProductCreated, error, dispatch]);

  return (
    <div className="row">
      <div className="col-12 col-md-2">
        <Sidebar />
      </div>
      <div className="col-12 col-md-10">
        <Fragment>
          <div className="wrapper my-5">
            <form
              onSubmit={submitHandler}
              className="shadow-lg"
              encType="multipart/form-data"
            >
              <h1 className="mb-4">New Product</h1>

              {/* Name */}
              <div className="form-group">
                <label htmlFor="name_field">Name</label>
                <input
                  type="text"
                  id="name_field"
                  className="form-control"
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                />
              </div>

              {/* Price */}
              <div className="form-group">
                <label htmlFor="price_field">Price-3ml-Attar</label>
                <input
                  type="text"
                  id="price_field"
                  className="form-control"
                  onChange={(e) => setPrice3mlAttar(e.target.value)}
                  value={price3mlAttar}
                />
              </div>
              <div className="form-group">
                <label htmlFor="price_field">Price-6ml-Attar</label>
                <input
                  type="text"
                  id="price_field"
                  className="form-control"
                  onChange={(e) => setPrice6mlAttar(e.target.value)}
                  value={price6mlAttar}
                />
              </div>
              <div className="form-group">
                <label htmlFor="price_field">Price-12ml-Attar</label>
                <input
                  type="text"
                  id="price_field"
                  className="form-control"
                  onChange={(e) => setPrice12mlAttar(e.target.value)}
                  value={price12mlAttar}
                />
              </div>
              <div className="form-group">
                <label htmlFor="price_field">Price-24ml-Attar</label>
                <input
                  type="text"
                  id="price_field"
                  className="form-control"
                  onChange={(e) => setPrice24mlAttar(e.target.value)}
                  value={price24mlAttar}
                />
              </div>
              <div className="form-group">
                <label htmlFor="price_field">Price-50ml-Perfume</label>
                <input
                  type="text"
                  id="price_field"
                  className="form-control"
                  onChange={(e) => setPrice50mlPerfume(e.target.value)}
                  value={price50mlPerfume}
                />
              </div>
              <div className="form-group">
                <label htmlFor="price_field">Price-20ml-Perfume</label>
                <input
                  type="text"
                  id="price_field"
                  className="form-control"
                  onChange={(e) => setPrice20mlPerfume(e.target.value)}
                  value={price20mlPerfume}
                />
              </div>
              <div className="form-group">
                <label htmlFor="price_field">Price-100ml-Perfume</label>
                <input
                  type="text"
                  id="price_field"
                  className="form-control"
                  onChange={(e) => setPrice100mlPerfume(e.target.value)}
                  value={price100mlPerfume}
                />
              </div>

              {/* Description */}
              <div className="form-group">
                <label htmlFor="description_field">Description</label>
                <textarea
                  className="form-control"
                  id="description_field"
                  rows="8"
                  onChange={(e) => setDescription(e.target.value)}
                  value={description}
                ></textarea>
              </div>

              {/* Category */}

              <div className="form-group">
                <label htmlFor="category_field">Category</label>
                <select
                  onChange={(e) => setSelectedCategory(e.target.value)} // Update selected category
                  className="form-control"
                  id="category_field"
                  value={selectedCategory}
                >
                  <option value="">Select</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Stock */}
              <div className="form-group">
                <label htmlFor="stock_field">Stock</label>
                <input
                  type="number"
                  id="stock_field"
                  className="form-control"
                  onChange={(e) => setStock(e.target.value)}
                  value={stock}
                />
              </div>

              {/* Type */}
              <div className="form-group">
                <label htmlFor="type_field">Type</label>
                <input
                  type="text"
                  id="type_field"
                  className="form-control"
                  onChange={(e) => setType(e.target.value)}
                  value={type}
                />
              </div>

              {/* Images */}
              <div className="form-group">
                <label>Images</label>
                <div className="custom-file">
                  <input
                    type="file"
                    name="product_images"
                    className="custom-file-input"
                    id="customFile"
                    multiple
                    onChange={onImagesChange}
                  />
                  <label className="custom-file-label" htmlFor="customFile">
                    Choose Images
                  </label>
                </div>
                {imagesPreview.map((image) => (
                  <img
                    className="mt-3 mr-2"
                    key={image}
                    src={image}
                    alt={`Image Preview`}
                    width="55"
                    height="52"
                  />
                ))}
              </div>

              <button
                id="login_button"
                type="submit"
                disabled={loading}
                className="btn btn-block py-3"
              >
                CREATE
              </button>
            </form>
          </div>
        </Fragment>
      </div>
    </div>
  );
}
