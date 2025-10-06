import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Button, Header, Input } from "semantic-ui-react";
import "./categoryProducts.css";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { useContext } from "react";
import { CartContext } from "../cart/cartContext";
import { ThreeDots } from "react-loader-spinner"; // Import the spinner

const CategoryProducts = () => {
  const { user = "" } = useSelector((state) => state.authState);
  const userId = user._id;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { category } = useParams();
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [selectedType, setSelectedType] = useState({});
  const [selectedQuantity, setSelectedQuantity] = useState({});
  const [selectedPrice, setSelectedPrice] = useState({});
  const [selectedBottles, setSelectedBottles] = useState({});
  const [noItems, setNoItems] = useState(false);
  const [loading, setLoading] = useState(false);
  const { addToLocalCart } = useContext(CartContext);
  const { localCart } = useContext(CartContext);

  const handleAddToCart = (
    productId,
    productName,
    product,
    quantity,
    productImage
  ) => {
    const type = selectedType[productId] || product.type.toLowerCase();
    const price = selectedPrice[productId];
    const noOfBottles = selectedBottles[productId] || 1;
    const finalPrice = price * noOfBottles;

    const cartItem = {
      productId,
      itemName: productName,
      quantity: parseInt(quantity),
      noOfBottles: parseInt(noOfBottles),
      finalPrice,
      stock: product.stock,
      type,
      productImage,
      createdAt: new Date(),
    };

    addToLocalCart(cartItem);
    toast.success("Added to local cart. Login to save permanently.");
  };

  const isProductInCart = (productId) => {
    return localCart.some((item) => item?.productId === productId);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(
          `https://api.saliheenperfumes.com/api/v1/products?category=${category}`,
          { withCredentials: true }
        );
        setProducts(data.products);
        if (data.products.length === 0) {
          setNoItems(true);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        toast.error("Failed to fetch products. Please try again later.");
      }
    };
    fetchProducts();
  }, [category]);

  useEffect(() => {
    if (user) {
      const fetchCartItems = async () => {
        try {
          const { data } = await axios.get(
            `https://api.saliheenperfumes.com/api/v1/CartProductsOfSingleUser/${userId}`,
            { withCredentials: true }
          );
          setCartItems(data.cartItems);
        } catch (error) {
          console.error("Error fetching cart items:", error);
        }
      };
      fetchCartItems();
    }
  }, [user, userId]);

  const handleTypeChange = (productId, type) => {
    setSelectedType((prev) => ({ ...prev, [productId]: type }));
    setSelectedQuantity((prev) => ({ ...prev, [productId]: null }));
    setSelectedPrice((prev) => ({ ...prev, [productId]: 0 }));
    setSelectedBottles((prev) => ({ ...prev, [productId]: 1 }));
  };

  const handleQuantityChange = (productId, quantity, price) => {
    setSelectedQuantity((prev) => ({ ...prev, [productId]: quantity }));
    setSelectedPrice((prev) => ({ ...prev, [productId]: price }));
    setSelectedBottles((prev) => ({
      ...prev,
      [productId]: prev[productId] || 1,
    }));
  };

  const handleBottlesChange = (productId, value) => {
    let bottles = parseInt(value, 10);
    if (isNaN(bottles) || bottles < 1) bottles = 1;
    setSelectedBottles((prev) => ({ ...prev, [productId]: bottles }));
  };

  const getTypeOptions = (product) => {
    const type = selectedType[product._id] || product.type.toLowerCase();

    if (type === "attar") {
      return [
        { value: "3ml", price: product.price3mlAttar },
        { value: "6ml", price: product.price6mlAttar },
        { value: "12ml", price: product.price12mlAttar },
        { value: "24ml", price: product.price24mlAttar },
      ];
    } else if (type === "perfume") {
      return [
        { value: "20ml", price: product.price20mlPerfume },
        { value: "50ml", price: product.price50mlPerfume },
        { value: "100ml", price: product.price100mlPerfume },
      ];
    }

    return [];
  };

  if (noItems) {
    return (
      <div
        className="no-items-container"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "50vh",
          width: "100%",
        }}
      >
        <h2 as="h2" textAlign="center" className="no-items-heading">
          No items found in this category. Try again later
        </h2>
      </div>
    );
  }

  // Show a beautiful golden loader while fetching data
  if (loading) {
    return (
      <div
        className="loading-container"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "50vh",
          width: "100%",
        }}
      >
        <ThreeDots
          height="80"
          width="80"
          radius="9"
          color="#FFD700" // Golden color
          ariaLabel="three-dots-loading"
          wrapperStyle={{}}
          wrapperClassName=""
          visible={true}
        />
      </div>
    );
  }

  return (
    <div className="category-products-container">
      <Header as="h1" textAlign="center" className="category-heading">
        {category}
      </Header>

      <div className="products-grid">
        {products.map((product) => {
          const quantities = getTypeOptions(product);

          return (
            <Card key={product._id} className="product-card">
              <div className="product-image-wrapper">
                <img
                  src={product.images[0]?.image || "/placeholder.jpg"}
                  alt={product.name}
                  className="product-image"
                />
              </div>
              <Card.Content className="card-content">
                <Card.Header className="product-title decorate">
                  {product.name}
                </Card.Header>

                <div className="product-options">
                  <div className="option-group">
                    <label className="option-label decorate">Type:</label>
                    <div className="button-group">
                      <Button
                        className={`type-btn ${
                          selectedType[product._id] === "attar" ? "active" : ""
                        } `}
                        onClick={() => handleTypeChange(product._id, "attar")}
                      >
                        Attar
                      </Button>
                      <Button
                        className={`type-btn ${
                          selectedType[product._id] === "perfume"
                            ? "active"
                            : ""
                        } `}
                        onClick={() => handleTypeChange(product._id, "perfume")}
                      >
                        Perfume
                      </Button>
                    </div>
                  </div>

                  <div className="option-group">
                    <label className="option-label decorate">Quantity:</label>
                    <div className="button-group">
                      {quantities.map((quantity) => (
                        <Button
                          key={quantity.value}
                          className={`quantity-btn ${
                            selectedQuantity[product._id] === quantity.value
                              ? "active"
                              : ""
                          }`}
                          onClick={() =>
                            handleQuantityChange(
                              product._id,
                              quantity.value,
                              quantity.price
                            )
                          }
                        >
                          {quantity.value}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div className="option-group">
                    <label className="option-label decorate">
                      No. of Bottles:
                    </label>
                    <div className="bottle-input">
                      <Input
                        type="number"
                        min={1}
                        placeholder="1"
                        value={
                          selectedBottles[product._id] === undefined
                            ? ""
                            : selectedBottles[product._id]
                        }
                        onChange={(e) => {
                          const val = e.target.value;
                          if (val === "") {
                            setSelectedBottles((prev) => ({
                              ...prev,
                              [product._id]: undefined,
                            }));
                          } else {
                            const bottles = Math.max(1, parseInt(val, 10) || 1);
                            setSelectedBottles((prev) => ({
                              ...prev,
                              [product._id]: bottles,
                            }));
                          }
                        }}
                      />
                    </div>
                  </div>

                  <div className="price-display decorate">
                    {selectedPrice[product._id]
                      ? `Price: ₹${selectedPrice[product._id]} × ${
                          selectedBottles[product._id] || 1
                        } = ₹${
                          selectedPrice[product._id] *
                          (selectedBottles[product._id] || 1)
                        }`
                      : "Select type & quantity"}
                  </div>
                </div>

                <Button
                  fluid
                  className="cart-button"
                  disabled={
                    !selectedType[product._id] ||
                    !selectedQuantity[product._id] ||
                    !selectedPrice[product._id] ||
                    !selectedBottles[product._id] ||
                    selectedBottles[product._id] < 1
                  }
                  onClick={() => {
                    if (!selectedType[product._id]) {
                      toast.error("Please select a type first!");
                    } else if (!selectedQuantity[product._id]) {
                      toast.error("Please select a quantity first!");
                    } else if (
                      !selectedBottles[product._id] ||
                      selectedBottles[product._id] < 1
                    ) {
                      toast.error("Please enter a valid number of bottles!");
                    } else if (isProductInCart(product._id)) {
                      navigate("/cart");
                    } else {
                      handleAddToCart(
                        product._id,
                        product.name,
                        product,
                        selectedQuantity[product._id],
                        product?.images[0]?.image || "/placeholder.jpg"
                      );
                    }
                  }}
                >
                  {isProductInCart(product._id) ? "Go to Cart" : "Add to Cart"}
                </Button>
              </Card.Content>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryProducts;
