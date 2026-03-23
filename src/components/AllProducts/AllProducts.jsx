import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Card, Button, Header, Icon, Input, Dropdown } from "semantic-ui-react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { CartContext } from "../cart/cartContext";
import { ThreeDots } from "react-loader-spinner";
import "../category/categoryProducts.css";
import "./AllProducts.css";

const API_BASE = "https://saliheenperfumes-zd2i.onrender.com/api/v1";

const AllProducts = () => {
  const { user = {} } = useSelector((state) => state.authState);
  const userId = user._id;
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterPriceSort, setFilterPriceSort] = useState(""); // '' | 'low' | 'high'
  const [selectedType, setSelectedType] = useState({});
  const [selectedQuantity, setSelectedQuantity] = useState({});
  const [selectedPrice, setSelectedPrice] = useState({});
  const [selectedBottles, setSelectedBottles] = useState({});
  const [loading, setLoading] = useState(true);
  const [noItems, setNoItems] = useState(false);
  const { addToLocalCart, localCart } = useContext(CartContext);

  const handleAddToCart = (
    productId,
    productName,
    product,
    quantity,
    productImage
  ) => {
    const type = selectedType[productId] || product.type?.toLowerCase();
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
    return localCart?.some((item) => item?.productId === productId) ?? false;
  };

  useEffect(() => {
    const fetchAllProducts = async () => {
      setLoading(true);
      try {
        const all = [];
        let page = 1;
        let hasMore = true;
        while (hasMore) {
          const { data } = await axios.get(
            `${API_BASE}/products?page=${page}`,
            { withCredentials: true }
          );
          const list = data.products || [];
          all.push(...list);
          const total = data.count ?? all.length;
          const perPage = data.resPerPage || list.length || 1;
          const totalPages = Math.max(1, Math.ceil(total / perPage));
          hasMore = list.length > 0 && page < totalPages;
          page += 1;
        }
        setProducts(all);
        setNoItems(all.length === 0);
      } catch (error) {
        console.error("Error fetching products:", error);
        toast.error("Failed to fetch products. Please try again later.");
        setNoItems(true);
      } finally {
        setLoading(false);
      }
    };
    fetchAllProducts();
  }, []);

  const categories = React.useMemo(() => {
    const set = new Set();
    products.forEach((p) => {
      const c = p.category;
      if (c) set.add(typeof c === "string" ? c : c.name || c);
    });
    return Array.from(set).sort();
  }, [products]);

  useEffect(() => {
    let list = [...products];
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      list = list.filter((p) =>
        (p.name || "").toLowerCase().includes(q)
      );
    }
    if (filterCategory) {
      list = list.filter((p) => {
        const c = p.category;
        const cat = typeof c === "string" ? c : c?.name ?? "";
        return cat === filterCategory;
      });
    }
    if (filterType) {
      const type = filterType.toLowerCase();
      list = list.filter(
        (p) => (p.type || "").toLowerCase() === type
      );
    }
    if (filterPriceSort === "low" || filterPriceSort === "high") {
      list = [...list].sort((a, b) => {
        const priceA =
          Number(a.price3mlAttar) ||
          Number(a.price20mlPerfume) ||
          Number(a.price) ||
          0;
        const priceB =
          Number(b.price3mlAttar) ||
          Number(b.price20mlPerfume) ||
          Number(b.price) ||
          0;
        return filterPriceSort === "low" ? priceA - priceB : priceB - priceA;
      });
    }
    setFilteredProducts(list);
  }, [products, searchQuery, filterCategory, filterType, filterPriceSort]);

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
      [productId]: prev[productId] ?? 1,
    }));
  };

  const handleBottlesChange = (productId, delta) => {
    const current = selectedBottles[productId] ?? 1;
    const next = Math.max(1, current + delta);
    setSelectedBottles((prev) => ({ ...prev, [productId]: next }));
  };

  const getTypeOptions = (product) => {
    const type = selectedType[product._id] || (product.type || "").toLowerCase();
    if (type === "attar") {
      return [
        { value: "3ml", price: product.price3mlAttar },
        { value: "6ml", price: product.price6mlAttar },
        { value: "12ml", price: product.price12mlAttar },
        { value: "24ml", price: product.price24mlAttar },
      ].filter((x) => x.price != null && x.price !== "");
    }
    if (type === "perfume") {
      return [
        { value: "20ml", price: product.price20mlPerfume },
        { value: "50ml", price: product.price50mlPerfume },
        { value: "100ml", price: product.price100mlPerfume },
      ].filter((x) => x.price != null && x.price !== "");
    }
    return [];
  };

  const categoryOptions = [
    { key: "all", value: "", text: "All categories" },
    ...categories.map((c) => ({ key: c, value: c, text: c })),
  ];

  const typeOptions = [
    { key: "all", value: "", text: "All types" },
    { key: "attar", value: "attar", text: "Attar" },
    { key: "perfume", value: "perfume", text: "Perfume" },
  ];

  const priceSortOptions = [
    { key: "none", value: "", text: "Default" },
    { key: "low", value: "low", text: "Price: Low to High" },
    { key: "high", value: "high", text: "Price: High to Low" },
  ];

  if (loading) {
    return (
      <div className="all-products-loading">
        <ThreeDots
          height={80}
          width={80}
          radius={9}
          color="#1a1a1a"
          ariaLabel="three-dots-loading"
          visible
        />
      </div>
    );
  }

  if (noItems && products.length === 0) {
    return (
      <div className="all-products-no-items">
        <h2 className="all-products-no-items-heading">
          No products found. Try again later.
        </h2>
      </div>
    );
  }

  return (
    <div className="all-products-page category-products-container">
      <Header as="h1" textAlign="center" className="category-heading">
        All Products
      </Header>

      <div className="all-products-toolbar">
        <div className="all-products-search-wrap">
          <Input
            icon="search"
            iconPosition="left"
            placeholder="Search by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="all-products-search-input"
          />
        </div>
        <div className="all-products-filters">
          <Dropdown
            placeholder="Category"
            selection
            options={categoryOptions}
            value={filterCategory}
            onChange={(_, { value }) => setFilterCategory(value)}
            className="all-products-dropdown"
          />
          {/* <Dropdown
            placeholder="Type"
            selection
            options={typeOptions}
            value={filterType}
            onChange={(_, { value }) => setFilterType(value)}
            className="all-products-dropdown"
          /> */}
          <Dropdown
            placeholder="Sort"
            selection
            options={priceSortOptions}
            value={filterPriceSort}
            onChange={(_, { value }) => setFilterPriceSort(value)}
            className="all-products-dropdown all-products-dropdown--sort"
          />
        </div>
        <div className="all-products-count">
          Showing {filteredProducts.length} of {products.length} products
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="all-products-no-results">
          <p>No products match your search or filters.</p>
          <Button
            onClick={() => {
              setSearchQuery("");
              setFilterCategory("");
              setFilterType("");
              setFilterPriceSort("");
            }}
            className="all-products-clear-btn"
          >
            Clear filters
          </Button>
        </div>
      ) : (
        <div className="products-grid">
          {filteredProducts.map((product) => {
            const quantities = getTypeOptions(product);
            return (
              <Card key={product._id} className="product-card">
                <div className="product-image-wrapper">
                  <img
                    src={product.images?.[0]?.image || "/placeholder.jpg"}
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
                          className={`type-btn ${selectedType[product._id] === "attar" ? "active" : ""
                            }`}
                          onClick={() => handleTypeChange(product._id, "attar")}
                        >
                          Attar
                        </Button>
                        <Button
                          className={`type-btn ${selectedType[product._id] === "perfume"
                            ? "active"
                            : ""
                            }`}
                          onClick={() =>
                            handleTypeChange(product._id, "perfume")
                          }
                        >
                          Perfume
                        </Button>
                      </div>
                    </div>

                    <div className="option-group">
                      <label className="option-label decorate">Quantity:</label>
                      <div className="button-group">
                        {quantities.map((q) => (
                          <Button
                            key={q.value}
                            className={`quantity-btn ${selectedQuantity[product._id] === q.value
                              ? "active"
                              : ""
                              }`}
                            onClick={() =>
                              handleQuantityChange(
                                product._id,
                                q.value,
                                q.price
                              )
                            }
                          >
                            {q.value}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div className="option-group option-group--bottles">
                      <label className="option-label">Bottles</label>
                      <div className="bottle-stepper">
                        <button
                          type="button"
                          className="bottle-stepper-btn bottle-stepper-btn--minus"
                          aria-label="Decrease bottles"
                          onClick={() => handleBottlesChange(product._id, -1)}
                        >
                          <Icon name="minus" />
                        </button>
                        <span className="bottle-stepper-value">
                          {selectedBottles[product._id] ?? 1}
                        </span>
                        <button
                          type="button"
                          className="bottle-stepper-btn bottle-stepper-btn--plus"
                          aria-label="Increase bottles"
                          onClick={() => handleBottlesChange(product._id, 1)}
                        >
                          <Icon name="plus" />
                        </button>
                      </div>
                    </div>

                    <div className="price-display decorate">
                      {selectedPrice[product._id]
                        ? `Price: ₹${selectedPrice[product._id]} × ${selectedBottles[product._id] || 1
                        } = ₹${selectedPrice[product._id] *
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
                      !selectedPrice[product._id]
                    }
                    onClick={() => {
                      if (!selectedType[product._id]) {
                        toast.error("Please select a type first!");
                      } else if (!selectedQuantity[product._id]) {
                        toast.error("Please select a quantity first!");
                      } else if (
                        !(selectedBottles[product._id] ?? 1) ||
                        (selectedBottles[product._id] ?? 1) < 1
                      ) {
                        toast.error("Please select at least 1 bottle.");
                      } else if (isProductInCart(product._id)) {
                        navigate("/cart");
                      } else {
                        handleAddToCart(
                          product._id,
                          product.name,
                          product,
                          selectedQuantity[product._id],
                          product?.images?.[0]?.image || "/placeholder.jpg"
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
      )}
    </div>
  );
};

export default AllProducts;
