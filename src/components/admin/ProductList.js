import { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { Fragment } from "react";
import AdminLoader from "./AdminLoader";
import { MDBDataTable } from "mdbreact";
import Sidebar from "./SideBar";
import {
  deleteProduct,
  disableProduct,
  enableProduct,
  getAdminProducts,
} from "../../actions/productActions";
import { clearProductDeleted } from "../../slices/productSlice";
import { clearError } from "../../slices/productsSlice";
import "./Dashboard.css";

export default function ProductList() {
  const {
    products = [],
    loading = true,
    error,
  } = useSelector((state) => state.productsState);
  const { isProductDeleted, error: productError } = useSelector(
    (state) => state.productState
  );
  const dispatch = useDispatch();

  const enableHandler = useCallback((e, id) => {
    e.currentTarget.disabled = true;
    dispatch(enableProduct(id));
  }, [dispatch]);

  const disableHandler = useCallback((e, id) => {
    e.currentTarget.disabled = true;
    dispatch(disableProduct(id));
  }, [dispatch]);

  const deleteHandler = useCallback((e, id) => {
    e.currentTarget.disabled = true;
    dispatch(deleteProduct(id));
  }, [dispatch]);

  const tableData = {
    columns: [
      { label: "ID", field: "id", sort: "asc" },
      { label: "Name", field: "name", sort: "asc" },
      { label: "Type", field: "type", sort: "asc" },
      { label: "Stock", field: "stock", sort: "asc" },
      { label: "Status", field: "status", sort: "asc" },
      { label: "Actions", field: "actions", sort: "disabled" },
    ],
    rows: products.map((product) => ({
      id: product._id,
      name: product.name,
      type: product.type,
      stock: (
        <span className={`stock-badge ${product.stock === 0 ? "zero" : product.stock < 5 ? "low" : "ok"}`}>
          {product.stock}
        </span>
      ),
      status: (
        <span className={`status-pill ${product.disabled ? "disabled" : "active"}`}>
          {product.disabled ? "Disabled" : "Active"}
        </span>
      ),
      actions: (
        <Fragment>
          <Link to={`/admin/product/${product._id}`} className="tbl-btn tbl-btn-edit">
            <i className="fa fa-pencil"></i> Edit
          </Link>
          <button onClick={(e) => deleteHandler(e, product._id)} className="tbl-btn tbl-btn-delete">
            <i className="fa fa-trash"></i> Delete
          </button>
          {product.disabled ? (
            <button onClick={(e) => enableHandler(e, product._id)} className="tbl-btn tbl-btn-enable">
              <i className="fa fa-check"></i> Enable
            </button>
          ) : (
            <button onClick={(e) => disableHandler(e, product._id)} className="tbl-btn tbl-btn-disable">
              <i className="fa fa-ban"></i> Disable
            </button>
          )}
        </Fragment>
      ),
    })),
  };

  useEffect(() => {
    if (error || productError) {
      toast(error || productError, {
        position: "bottom-center",
        type: "error",
        onOpen: () => dispatch(clearError()),
      });
      return;
    }
    if (isProductDeleted) {
      toast("Product deleted successfully", {
        type: "success",
        position: "bottom-center",
        onOpen: () => dispatch(clearProductDeleted()),
      });
      return;
    }
    dispatch(getAdminProducts);
  }, [dispatch, error, isProductDeleted, productError]);

  return (
    <div className="admin-page-wrapper">
      <Sidebar />
      <div className="admin-page-content">

        {/* Header */}
        <div className="page-header">
          <div>
            <h1 className="page-title">
              <i className="fa fa-shopping-basket"></i>
              Products
            </h1>
            <p className="page-subtitle">
              <span className="count-badge">
                <span className="num">{products.length}</span> total
              </span>
            </p>
          </div>
          <Link to="/admin/products/create" className="btn-primary-action">
            <i className="fa fa-plus"></i> Add Product
          </Link>
        </div>

        {/* Desktop Table */}
        <div className="table-card d-lg-block d-none">
          {loading ? (
            <AdminLoader />
          ) : (
            <MDBDataTable
              data={tableData}
              bordered={false}
              striped={false}
              hover
              className="admin-table"
              responsive
              entries={10}
              entriesOptions={[5, 10, 20, 50]}
              noBottomColumns
            />
          )}
        </div>

        {/* Mobile Cards */}
        <div className="d-lg-none">
          {loading ? (
            <AdminLoader />
          ) : (
            <div className="mobile-cards-container">
              {products.map((product) => (
                <div key={product._id} className="mobile-product-card">
                  <div className="mpc-header">
                    <div>
                      <div className="mpc-name">{product.name}</div>
                      <div className="mpc-id">{product._id}</div>
                    </div>
                    <span className={`status-pill ${product.disabled ? "disabled" : "active"}`}>
                      {product.disabled ? "Disabled" : "Active"}
                    </span>
                  </div>
                  <div className="mpc-meta">
                    <span className="meta-tag">{product.type}</span>
                    <span className={`meta-tag ${product.stock === 0 ? "out" : ""}`}>
                      Stock: {product.stock}
                    </span>
                  </div>
                  <div className="mpc-actions">
                    <Link to={`/admin/product/${product._id}`} className="tbl-btn tbl-btn-edit">
                      <i className="fa fa-pencil"></i> Edit
                    </Link>
                    <button onClick={(e) => deleteHandler(e, product._id)} className="tbl-btn tbl-btn-delete">
                      <i className="fa fa-trash"></i>
                    </button>
                    {product.disabled ? (
                      <button onClick={(e) => enableHandler(e, product._id)} className="tbl-btn tbl-btn-enable">
                        Enable
                      </button>
                    ) : (
                      <button onClick={(e) => disableHandler(e, product._id)} className="tbl-btn tbl-btn-disable">
                        Disable
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}