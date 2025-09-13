import React, { useEffect, useState, useCallback, useMemo } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  Button,
  Grid,
  Header,
  Input,
  Dimmer,
  Loader,
} from "semantic-ui-react";
import "./categoryProducts.css";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { useContext } from "react";
import { CartContext } from "../cart/cartContext";

const CategoryProducts = () => {
  const { user = {} } = useSelector((state) => state.authState);
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
  const [loading, setLoading] = useState(true); // New: loading state

  const { addToLocalCart, localCart } = useContext(CartContext);

  // Memoized product type options
  const getTypeOptions = useCallback(
    (product) => {
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
    },
    [selectedType]
  );

  // Check if product is in cart
  const isProductInCart = useCallback(
    (productId) => {
      return localCart.some((item) => item?.productId === productId);
    },
    [localCart]
  );

  // Fetch products on category change
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true); // Start loading
      try {
        const { data } = await axios.get(
          `https://api.saliheenperfumes.com/api/v1/products?category=${category}`,
          { withCredentials: true }
        );
        setProducts(data.products || []);
      } catch (error) {
        console.error("Error fetching products:", error);
        toast.error("Failed to fetch products. Please try again later.");
        setProducts([]); // Ensure empty array on error
      } finally {
        setLoading(false); // Stop loading regardless of success/failure
      }
    };

    if (category) fetchProducts();
    else setLoading(false); // No category? Stop loading.
  }, [category]);

  // Fetch cart items if user logged in
  useEffect(() => {
    if (!user || !userId) return;

    const fetchCartItems = async () => {
      try {
        const { data } = await axios.get(
          `https://api.saliheenperfumes.com/api/v1/CartProductsOfSingleUser/${userId}`,
          { withCredentials: true }
        );
        setCartItems(data.cartItems || []);
      } catch (error) {
        console.error("Error fetching cart items:", error);
      }
    };

    fetchCartItems();
  }, [user, userId]);

  // Handlers
  const handleTypeChange = useCallback((productId, type) => {
    setSelectedType((prev) => ({ ...prev, [productId]: type }));
    setSelectedQuantity((prev) => ({ ...prev, [productId]: null }));
    setSelectedPrice((prev) => ({ ...prev, [productId]: 0 }));
    setSelectedBottles((prev) => ({ ...prev, [productId]: 1 }));
  }, []);

  const handleQuantityChange = useCallback((productId, quantity, price) => {
    setSelectedQuantity((prev) => ({ ...prev, [productId]: quantity }));
    setSelectedPrice((prev) => ({ ...prev, [productId]: price }));
    setSelectedBottles((prev) => ({
      ...prev,
      [productId]: prev[productId] || 1,
    }));
  }, []);

  const handleBottlesChange = useCallback((productId, value) => {
    let bottles = parseInt(value, 10);
    if (isNaN(bottles) || bottles < 1) bottles = 1;
    setSelectedBottles((prev) => ({ ...prev, [productId]: bottles }));
  }, []);

  const handleAddToCart = useCallback(
    (productId, productName, product, quantity, productImage) => {
      const type = selectedType[productId] || product.type.toLowerCase();
      const price = selectedPrice[productId];
      const noOfBottles = selectedBottles[productId] || 1;
      const finalPrice = price * noOfBottles;

      const cartItem = {
        productId,
        itemName: productName,
        quantity: parseInt(quantity, 10),
        noOfBottles: parseInt(noOfBottles, 10),
        finalPrice,
        stock: product.stock,
        type,
        productImage,
        createdAt: new Date(),
      };

      addToLocalCart(cartItem);
      toast.success("Added to local cart. Login to save permanently.");
    },
    [selectedType, selectedPrice, selectedBottles, addToLocalCart]
  );

  // Memoized product cards
  const productCards = useMemo(() => {
    return products.map((product) => {
      const quantities = getTypeOptions(product);
      const isInCart = isProductInCart(product._id);

      return (
        <Grid.Column key={product._id} className="product-column">
          <Card className="product-card" fluid>
            <div className="product-image-wrapper">
              <img
                src={product.images[0]?.image || "/placeholder.jpg"}
                alt={product.name}
                className="product-image"
              />
            </div>
            <Card.Content className="card-content">
              <Card.Header className="product-title">
                {product.name}
              </Card.Header>
              <div className="product-options">
                {/* Type Selection */}
                <div className="option-group">
                  <label className="option-label">Type:</label>
                  <div className="button-group">
                    <Button
                      className={`type-btn ${
                        selectedType[product._id] === "attar" ? "active" : ""
                      }`}
                      onClick={() => handleTypeChange(product._id, "attar")}
                    >
                      Attar
                    </Button>
                    <Button
                      className={`type-btn ${
                        selectedType[product._id] === "perfume" ? "active" : ""
                      }`}
                      onClick={() => handleTypeChange(product._id, "perfume")}
                    >
                      Perfume
                    </Button>
                  </div>
                </div>

                {/* Quantity Selection */}
                <div className="option-group">
                  <label className="option-label">Quantity:</label>
                  <div className="button-group quantity-buttons">
                    {quantities.map((q) => (
                      <Button
                        key={q.value}
                        className={`quantity-btn ${
                          selectedQuantity[product._id] === q.value
                            ? "active"
                            : ""
                        }`}
                        onClick={() =>
                          handleQuantityChange(product._id, q.value, q.price)
                        }
                      >
                        {q.value}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Bottles Input */}
                <div className="option-group">
                  <label className="option-label">No. of Bottles:</label>
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
                    className="bottle-input"
                  />
                </div>

                {/* Price Display */}
                <div className="price-display">
                  {selectedPrice[product._id] ? (
                    <span>
                      Price: ₹{selectedPrice[product._id]} x{" "}
                      {selectedBottles[product._id] || 1} = ₹
                      {selectedPrice[product._id] *
                        (selectedBottles[product._id] || 1)}
                    </span>
                  ) : (
                    <span>Select type & quantity to see price</span>
                  )}
                </div>
              </div>

              {/* Add to Cart Button */}
              <Button
                className="cart-button"
                fluid
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
                  } else if (isInCart) {
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
                {isInCart ? "Go to Cart" : "Add to Cart"}
              </Button>
            </Card.Content>
          </Card>
        </Grid.Column>
      );
    });
  }, [
    products,
    selectedType,
    selectedQuantity,
    selectedPrice,
    selectedBottles,
    handleTypeChange,
    handleQuantityChange,
    isProductInCart,
    handleAddToCart,
    getTypeOptions,
    navigate,
  ]);

  // Show loader while fetching
  if (loading) {
    return (
      <div
        className="category-products-container"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "70vh",
        }}
      >
        <Dimmer active inverted>
          <Loader size="huge" className="golden-loader">
            Loading Products...
          </Loader>
        </Dimmer>
      </div>
    );
  }

  // Show "No products" message if products array is empty
  if (!products || products.length === 0) {
    return (
      <div
        className="category-products-container"
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "70vh",
          textAlign: "center",
        }}
      >
        <Header as="h2" className="no-products-heading">
          🛍️ No products in this section now
        </Header>
        <p className="no-products-text">
          Try again after some time. New fragrances are being crafted with love!
        </p>
      </div>
    );
  }

  return (
    <div className="category-products-container">
      <Header as="h1" textAlign="center" className="category-heading">
        {category}
      </Header>
      <Grid columns={3} stackable className="products-grid">
        <Grid.Row>{productCards}</Grid.Row>
      </Grid>
    </div>
  );
};

export default CategoryProducts;
