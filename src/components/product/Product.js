import React from "react";
import { Link } from "react-router-dom";

function Product({ product }) {
  return (
    <div className="col-12 col-sm-6 col-md-6 col-lg-3 my-3 d-flex justify-content-center">
      <div
        className="card p-2 p-sm-3 rounded"
        style={{ width: "100%", maxWidth: "280px", border: "1px solid #1a1a1a" }}
      >
        {/* Fixed Image Container */}
        <div
          className="image-container mx-auto"
          style={{
            width: "100%",
            height: "180px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            overflow: "hidden",
          }}
        >
          <img
            className="card-img-top"
            src={product.images[0].image}
            alt={product.name}
            style={{
              width: "auto",
              height: "auto",
              maxWidth: "100%",
              maxHeight: "100%",
              objectFit: "contain",
            }}
          />
        </div>

        <div className="card-body d-flex flex-column p-1 p-sm-2">
          {/* Product Name */}
          <h5 className="card-title mb-2">
            <Link
              to={`/product/${product._id}`}
              className="text-decoration-none"
            >
              <h6
                className="mb-0 text-center"
                style={{ fontSize: "clamp(14px, 4vw, 18px)" }}
              >
                {product.name}
              </h6>
            </Link>
          </h5>

          {/* Ratings */}
          <div className="ratings mt-auto mb-2">
            <div className="rating-outer">
              <div
                className="rating-inner"
                style={{
                  width: `${(product.ratings / 5) * 100}%`,
                }}
              ></div>
            </div>
            <span id="no_of_reviews" style={{ fontSize: "12px" }}>
              {product.numOfReviews} Reviews
            </span>
          </div>

          {/* Price */}
          <p className="card-text text-center mb-2 fw-bold">${product.price}</p>

          {/* Type Selection - Improved for mobile */}
          <div className="mb-2">
            <label className="form-label mb-1" style={{ fontSize: "14px" }}>
              Type:
            </label>
            <div className="d-flex gap-1">
              <button
                className="btn btn-outline-primary btn-sm flex-fill"
                style={{ fontSize: "12px", padding: "4px 8px" }}
              >
                Attar
              </button>
              <button
                className="btn btn-outline-primary btn-sm flex-fill"
                style={{ fontSize: "12px", padding: "4px 8px" }}
              >
                Perfume
              </button>
            </div>
          </div>

          {/* Quantity Selection - 2x2 Grid with better mobile handling */}
          <div className="mb-2">
            <label className="form-label mb-1" style={{ fontSize: "14px" }}>
              Quantity:
            </label>
            <div className="row g-1">
              <div className="col-6">
                <button
                  className="btn btn-outline-secondary w-100 btn-sm"
                  style={{ fontSize: "11px", padding: "4px 2px" }}
                >
                  20ml
                </button>
              </div>
              <div className="col-6">
                <button
                  className="btn btn-outline-secondary w-100 btn-sm"
                  style={{ fontSize: "11px", padding: "4px 2px" }}
                >
                  50ml
                </button>
              </div>
              <div className="col-6">
                <button
                  className="btn btn-outline-secondary w-100 btn-sm"
                  style={{ fontSize: "11px", padding: "4px 2px" }}
                >
                  100ml
                </button>
              </div>
              <div className="col-6">
                <button
                  className="btn btn-outline-secondary w-100 btn-sm"
                  style={{ fontSize: "11px", padding: "4px 2px" }}
                >
                  200ml
                </button>
              </div>
            </div>
          </div>

          {/* No. of Bottles - Improved for mobile */}
          <div className="mb-3">
            <label className="form-label mb-1" style={{ fontSize: "14px" }}>
              Bottles:
            </label>
            <input
              type="number"
              className="form-control form-control-sm"
              min="1"
              defaultValue="1"
              style={{ fontSize: "14px" }}
            />
          </div>

          {/* View Details Button */}
          <Link to={`/product/${product._id}`} className="text-decoration-none">
            <div
              id="view_btn"
              className="btn btn-primary btn-block w-100"
              style={{ fontSize: "14px", padding: "6px 12px" }}
            >
              View Details
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Product;
