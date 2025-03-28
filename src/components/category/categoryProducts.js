import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Button, Grid, Header } from "semantic-ui-react";
import "./categoryProducts.css";
import { useSelector } from "react-redux";
import { addCartItemInDB } from "../../actions/cartActions";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

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
    // Reset quantity and price when type changes
    setSelectedQuantity((prev) => ({ ...prev, [productId]: null }));
    setSelectedPrice((prev) => ({ ...prev, [productId]: 0 }));
  };

  // Handle quantity selection
  const handleQuantityChange = (productId, quantity, price) => {
    setSelectedQuantity((prev) => ({ ...prev, [productId]: quantity }));
    setSelectedPrice((prev) => ({ ...prev, [productId]: price }));
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

  // Handle adding product to cart
  const handleAddToCart = (productId, productName, product, quantity) => {
    const type = selectedType[productId] || product.type.toLowerCase();
    const price = selectedPrice[productId];

    if (!user) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Login first to add products to cart!",
      });
      navigate("/login");
    } else {
      dispatch(
        addCartItemInDB(
          productId,
          parseInt(quantity),
          type,
          user._id,
          productName,
          price
        )
      );
      toast("Cart Item Added!", {
        type: "success",
        position: "bottom-center",
      });
    }
  };

  // Check if a product is already in the cart
  const isProductInCart = (productId) => {
    return cartItems.some((item) => item?.productId._id === productId);
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
                <Card fluid style={{ backgroundColor: "black", color: "#fff" }}>
                  <img
                    src={product.images[0]?.image || "/placeholder.jpg"}
                    alt={product.name}
                    className="product-image"
                    style={{ height: "200px", objectFit: "cover" }}
                  />
                  <Card.Content>
                    <Card.Header style={{ color: "whitesmoke" }}>
                      {product.name}
                    </Card.Header>
                    <Card.Description>{product.description}</Card.Description>
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
                      <div>
                        <label style={{ color: "whitesmoke" }}>Price:</label>
                        <div style={{ color: "whitesmoke", marginTop: "10px" }}>
                          ${selectedPrice[product._id] || 0}
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
                      onClick={() =>
                        isProductInCart(product._id)
                          ? navigate("/cart")
                          : handleAddToCart(
                              product._id,
                              product.name,
                              product,
                              selectedQuantity[product._id]
                            )
                      }
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
