import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Button, Grid, Header, Input } from "semantic-ui-react";
import "./categoryProducts.css";
import { useSelector } from "react-redux";
import { addCartItemInDB } from "../../actions/cartActions";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { useContext } from "react";
import { CartContext } from "../cart/cartContext";

// import { CartProvider } from "../cart/cartContext";

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
  const [selectedBottles, setSelectedBottles] = useState({}); // NEW

  const { addToLocalCart } = useContext(CartContext);
  const { localCart } = useContext(CartContext);

  // console.log(localCart);
  // console.log("products", products);

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
      noOfBottles,
      createdAt: new Date(),
    };

    addToLocalCart(cartItem);
    toast.success("Added to local cart. Login to save permanently.");
  };

  const isProductInCart = (productId) => {
    return (
      // cartItems.some((item) => item?.productId._id === productId) ||
      localCart.some((item) => item?.productId === productId)
    );
  };

  // Fetch products based on category
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get(
          `https://api.saliheenperfumes.com/api/v1/products?category=${category}`,
          { withCredentials: true }
        );
        setProducts(data.products);
      } catch (error) {
        console.error("Error fetching products:", error);
        toast.error("Failed to fetch products. Please try again later.");
      }
    };
    fetchProducts();
  }, [category]);

  // Fetch cart items for the logged-in user
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

  // Handle type selection (attar or perfume)
  const handleTypeChange = (productId, type) => {
    setSelectedType((prev) => ({ ...prev, [productId]: type }));
    // Reset quantity, price, and bottles when type changes
    setSelectedQuantity((prev) => ({ ...prev, [productId]: null }));
    setSelectedPrice((prev) => ({ ...prev, [productId]: 0 }));
    setSelectedBottles((prev) => ({ ...prev, [productId]: 1 }));
  };

  // Handle quantity selection
  const handleQuantityChange = (productId, quantity, price) => {
    setSelectedQuantity((prev) => ({ ...prev, [productId]: quantity }));
    setSelectedPrice((prev) => ({ ...prev, [productId]: price }));
    // Keep bottles as is or default to 1
    setSelectedBottles((prev) => ({
      ...prev,
      [productId]: prev[productId] || 1,
    }));
  };

  // Handle bottles selection
  const handleBottlesChange = (productId, value) => {
    let bottles = parseInt(value, 10);
    if (isNaN(bottles) || bottles < 1) bottles = 1;
    setSelectedBottles((prev) => ({ ...prev, [productId]: bottles }));
  };

  // Get available quantities and prices based on product type
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

  return (
    <div
      className="category-products-container"
      style={{ backgroundColor: "#000", color: "#fff" }}
    >
      <Header
        as="h1"
        textAlign="center"
        style={{ margin: "20px 0", color: "whitesmoke" }}
      >
        {category}
      </Header>
      <Grid columns={3} stackable>
        <Grid.Row>
          {products.map((product) => {
            const quantities = getTypeOptions(product);

            return (
              <Grid.Column key={product._id}>
                <Card
                  fluid
                  style={{
                    backgroundColor: "black",
                    color: "#fff",
                    width: "min-content",
                    margin: "10px",
                  }}
                >
                  <img
                    src={product.images[0]?.image || "/placeholder.jpg"}
                    alt={product.name}
                    className="product-image"
                    style={{
                      height: "200px",
                      objectFit: "cover",
                      width: "100%",
                    }}
                  />
                  <Card.Content>
                    <Card.Header
                      style={{ color: "whitesmoke", textAlign: "center" }}
                    >
                      {product.name}
                    </Card.Header>
                    {/* <Card.Description>{product.description}</Card.Description> */}
                    <div className="product-options">
                      <div>
                        <label style={{ color: "whitesmoke" }}>Type:</label>
                        <div
                          style={{
                            display: "flex",
                            gap: "5px",
                            marginBottom: "10px",
                          }}
                        >
                          <Button
                            style={{
                              backgroundColor:
                                selectedType[product._id] === "attar"
                                  ? "whitesmoke"
                                  : "#1c1c1c",
                              color:
                                selectedType[product._id] === "attar"
                                  ? "#000"
                                  : "whitesmoke",
                              border:
                                selectedType[product._id] === "attar"
                                  ? "1px solid whitesmoke"
                                  : "1px solid whitesmoke",
                            }}
                            onClick={() =>
                              handleTypeChange(product._id, "attar")
                            }
                          >
                            Attar
                          </Button>
                          <Button
                            style={{
                              backgroundColor:
                                selectedType[product._id] === "perfume"
                                  ? "whitesmoke"
                                  : "#1c1c1c",
                              color:
                                selectedType[product._id] === "perfume"
                                  ? "#000"
                                  : "whitesmoke",
                              border:
                                selectedType[product._id] === "perfume"
                                  ? "1px solid whitesmoke"
                                  : "1px solid whitesmoke",
                            }}
                            onClick={() =>
                              handleTypeChange(product._id, "perfume")
                            }
                          >
                            Perfume
                          </Button>
                        </div>
                      </div>
                      <div>
                        <label style={{ color: "whitesmoke" }}>Quantity:</label>
                        <div
                          style={{
                            display: "flex",
                            gap: "5px",
                            flexWrap: "wrap",
                            color: "whitesmoke",
                          }}
                        >
                          {quantities.map((quantity) => (
                            <Button
                              key={quantity.value}
                              style={{
                                backgroundColor:
                                  selectedQuantity[product._id] ===
                                  quantity.value
                                    ? "whitesmoke"
                                    : "#1c1c1c",
                                color:
                                  selectedQuantity[product._id] ===
                                  quantity.value
                                    ? "#000"
                                    : "whitesmoke",
                                border:
                                  selectedQuantity[product._id] ===
                                  quantity.value
                                    ? "1px solid whitesmoke"
                                    : "1px solid whitesmoke",
                              }}
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
                      <div style={{ marginTop: "10px" }}>
                        <label style={{ color: "whitesmoke" }}>
                          No. of Bottles:
                        </label>
                        <Input
                          type="number"
                          min={1}
                          placeholder="Enter bottles"
                          value={
                            selectedBottles[product._id] === undefined
                              ? ""
                              : selectedBottles[product._id]
                          }
                          onChange={(e) => {
                            const val = e.target.value;
                            // Allow empty input
                            if (val === "") {
                              setSelectedBottles((prev) => ({
                                ...prev,
                                [product._id]: undefined,
                              }));
                            } else {
                              const bottles = Math.max(
                                1,
                                parseInt(val, 10) || 1
                              );
                              setSelectedBottles((prev) => ({
                                ...prev,
                                [product._id]: bottles,
                              }));
                            }
                          }}
                          style={{
                            width: "80px",
                            marginLeft: "10px",
                            background: "#222",
                            color: "#fff",
                          }}
                          input={{
                            style: {
                              background: "#222",
                              color: "#fff",
                              border: "1px solid #fff",
                            },
                          }}
                        />
                      </div>
                      <div>
                        <div style={{ color: "whitesmoke", marginTop: "10px" }}>
                          {selectedPrice[product._id]
                            ? `Price : ₹${selectedPrice[product._id]} x ${
                                selectedBottles[product._id] || 1
                              } = ₹${
                                selectedPrice[product._id] *
                                (selectedBottles[product._id] || 1)
                              }`
                            : "Select a type and quantity to see the price"}
                        </div>
                      </div>
                    </div>
                    <Button
                      color="yellow"
                      fluid
                      style={{
                        marginTop: "10px",
                        backgroundColor: "whitesmoke",
                        color: "#000",
                      }}
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
                          toast.error(
                            "Please enter a valid number of bottles!"
                          );
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
                      {isProductInCart(product._id)
                        ? "Go to Cart"
                        : "Add to Cart"}
                    </Button>
                  </Card.Content>
                </Card>
              </Grid.Column>
            );
          })}
        </Grid.Row>
      </Grid>
    </div>
  );
};

export default CategoryProducts;
