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
    // Fetch categories dynamically
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get(
          "https://api.saliheenperfumes.com/api/v1/admin/category",
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
              <h1 className="mb-4">Update Product</h1>

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
                <label htmlFor="price_field">Price</label>
                <input
                  type="text"
                  id="price_field"
                  className="form-control"
                  onChange={(e) => setPrice(e.target.value)}
                  value={price}
                />
              </div>

              {/* Price 3ml Attar */}
              <div className="form-group">
                <label htmlFor="price3mlAttar_field">Price 3ml Attar</label>
                <input
                  type="text"
                  id="price3mlAttar_field"
                  className="form-control"
                  onChange={(e) => setPrice3mlAttar(e.target.value)}
                  value={price3mlAttar}
                />
              </div>

              {/* Price 6ml Attar */}
              <div className="form-group">
                <label htmlFor="price6mlAttar_field">Price 6ml Attar</label>
                <input
                  type="text"
                  id="price6mlAttar_field"
                  className="form-control"
                  onChange={(e) => setPrice6mlAttar(e.target.value)}
                  value={price6mlAttar}
                />
              </div>

              {/* Price 12ml Attar */}
              <div className="form-group">
                <label htmlFor="price12mlAttar_field">Price 12ml Attar</label>
                <input
                  type="text"
                  id="price12mlAttar_field"
                  className="form-control"
                  onChange={(e) => setPrice12mlAttar(e.target.value)}
                  value={price12mlAttar}
                />
              </div>

              {/* Price 24ml Attar */}
              <div className="form-group">
                <label htmlFor="price24mlAttar_field">Price 24ml Attar</label>
                <input
                  type="text"
                  id="price24mlAttar_field"
                  className="form-control"
                  onChange={(e) => setPrice24mlAttar(e.target.value)}
                  value={price24mlAttar}
                />
              </div>

              {/* Price 20ml Perfume */}
              <div className="form-group">
                <label htmlFor="price20mlPerfume_field">
                  Price 20ml Perfume
                </label>
                <input
                  type="text"
                  id="price20mlPerfume_field"
                  className="form-control"
                  onChange={(e) => setPrice20mlPerfume(e.target.value)}
                  value={price20mlPerfume}
                />
              </div>

              {/* Price 50ml Perfume */}
              <div className="form-group">
                <label htmlFor="price50mlPerfume_field">
                  Price 50ml Perfume
                </label>
                <input
                  type="text"
                  id="price50mlPerfume_field"
                  className="form-control"
                  onChange={(e) => setPrice50mlPerfume(e.target.value)}
                  value={price50mlPerfume}
                />
              </div>

              {/* Price 100ml Perfume */}
              <div className="form-group">
                <label htmlFor="price100mlPerfume_field">
                  Price 100ml Perfume
                </label>
                <input
                  type="text"
                  id="price100mlPerfume_field"
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
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="form-control"
                  id="category_field"
                >
                  <option value="">Select</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.name}>
                      {category.name}
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
                  onChange={(e) => setStock(Number(e.target.value))}
                  value={stock}
                />
              </div>

              {/* Node */}
              <div className="form-group">
                <label htmlFor="node_field">Node</label>
                <input
                  type="text"
                  id="node_field"
                  className="form-control"
                  onChange={(e) => setNode(e.target.value)}
                  value={node}
                />
              </div>

              {/* Color */}
              <div className="form-group">
                <label htmlFor="color_field">Color</label>
                <input
                  type="text"
                  id="color_field"
                  className="form-control"
                  onChange={(e) => setColor(e.target.value)}
                  value={color}
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
                {imagesPreview.length > 0 && (
                  <span
                    onClick={clearImagesHandler}
                    className="mr-2"
                    style={{ cursor: "pointer" }}
                  >
                    <i className="fa fa-trash"></i>
                  </span>
                )}
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
                UPDATE
              </button>
            </form>
          </div>
        </Fragment>
      </div>
    </div>
  );
}
