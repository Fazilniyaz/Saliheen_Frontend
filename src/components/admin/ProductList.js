import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";
import { Fragment } from "react";
import Loader from "../../components/layouts/Loader";
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
import "./ProductList.css";

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

  const setProducts = () => {
    const data = {
      columns: [
        {
          label: "ID",
          field: "id",
          sort: "asc",
        },
        {
          label: "Name",
          field: "name",
          sort: "asc",
        },
        {
          label: "Type",
          field: "type",
          sort: "asc",
        },
        {
          label: "Stock",
          field: "stock",
          sort: "asc",
        },
        {
          label: "Actions",
          field: "actions",
          sort: "asc",
        },
      ],
      rows: [],
    };

    products.forEach((product) => {
      data.rows.push({
        id: product._id,
        name: product.name,
        type: product.type,
        stock: product.stock,
        actions: (
          <Fragment>
            <Link
              to={`/admin/product/${product._id}`}
              className="btn btn-primary btn-sm me-2 mb-2"
            >
              <i className="fa fa-pencil"></i>
            </Link>
            <Button
              onClick={(e) => deleteHandler(e, product._id)}
              className="btn btn-danger btn-sm me-2 mb-2"
            >
              <i className="fa fa-trash"></i>
            </Button>
            {product.disabled ? (
              <Button
                onClick={(e) => enableHandler(e, product._id)}
                className="btn btn-success btn-sm mb-2"
              >
                Enable
              </Button>
            ) : (
              <Button
                onClick={(e) => disableHandler(e, product._id)}
                className="btn btn-warning btn-sm mb-2"
              >
                Disable
              </Button>
            )}
          </Fragment>
        ),
      });
    });

    return data;
  };

  const enableHandler = (e, id) => {
    e.target.disabled = true;
    dispatch(enableProduct(id));
  };

  const disableHandler = (e, id) => {
    e.target.disabled = true;
    dispatch(disableProduct(id));
  };

  const deleteHandler = (e, id) => {
    e.target.disabled = true;
    dispatch(deleteProduct(id));
  };

  useEffect(() => {
    if (error || productError) {
      toast(error || productError, {
        position: "bottom-center",
        type: "error",
        onOpen: () => {
          dispatch(clearError());
        },
      });
      return;
    }

    if (isProductDeleted) {
      toast("Product Deleted Successfully!", {
        type: "success",
        position: "bottom-center",
        onOpen: () => dispatch(clearProductDeleted()),
      });
      return;
    }

    dispatch(getAdminProducts);
  }, [dispatch, error, isProductDeleted]);

  return (
    <div className="product-list-wrapper">
      <Sidebar />

      <div className="product-list-content">
        <div className="container-fluid px-3 px-lg-4 py-4">
          {/* Header */}
          <div className="row mb-4">
            <div className="col-12">
              <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center">
                <h1 className="page-title gold-gradient-text mb-3 mb-md-0">
                  <i className="fa fa-shopping-basket me-2"></i>
                  Product List
                </h1>
                <Link
                  to="/admin/products/create"
                  className="btn btn-gold d-flex align-items-center"
                >
                  <i className="fa fa-plus me-2"></i>
                  Add New Product
                </Link>
              </div>
            </div>
          </div>

          {/* Products Count Badge */}
          <div className="row mb-3">
            <div className="col-12">
              <div className="products-count-badge">
                <i className="fa fa-boxes me-2"></i>
                Total Products: <span className="count">{products.length}</span>
              </div>
            </div>
          </div>

          {/* Desktop Table View */}
          <div className="row d-none d-lg-block">
            <div className="col-12">
              <div className="table-card">
                {loading ? (
                  <Loader />
                ) : (
                  <MDBDataTable
                    data={setProducts()}
                    bordered
                    striped
                    hover
                    className="product-table"
                    responsive
                    entries={10}
                    entriesOptions={[5, 10, 20, 50]}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Mobile Card View */}
          <div className="row d-lg-none">
            <div className="col-12">
              {loading ? (
                <Loader />
              ) : (
                <div className="mobile-products-container">
                  {products.map((product) => (
                    <div key={product._id} className="product-card-mobile">
                      <div className="card-header-mobile">
                        <div className="product-info-mobile">
                          <h5 className="product-name-mobile">
                            {product.name}
                          </h5>
                          <div className="product-meta-mobile">
                            <span className="badge bg-secondary me-2">
                              <i className="fa fa-tag me-1"></i>
                              {product.type}
                            </span>
                            <span
                              className={`badge ${
                                product.stock > 0 ? "bg-success" : "bg-danger"
                              }`}
                            >
                              <i className="fa fa-cubes me-1"></i>
                              Stock: {product.stock}
                            </span>
                          </div>
                        </div>
                        <div
                          className={`status-badge ${
                            product.disabled ? "disabled" : "active"
                          }`}
                        >
                          {product.disabled ? "Disabled" : "Active"}
                        </div>
                      </div>

                      <div className="card-body-mobile">
                        <div className="product-id-mobile">
                          <strong>ID:</strong> {product._id}
                        </div>
                      </div>

                      <div className="card-actions-mobile">
                        <Link
                          to={`/admin/product/${product._id}`}
                          className="btn btn-primary btn-sm flex-fill"
                        >
                          <i className="fa fa-pencil me-1"></i>
                          Edit
                        </Link>
                        <Button
                          onClick={(e) => deleteHandler(e, product._id)}
                          className="btn btn-danger btn-sm flex-fill"
                        >
                          <i className="fa fa-trash me-1"></i>
                          Delete
                        </Button>
                        {product.disabled ? (
                          <Button
                            onClick={(e) => enableHandler(e, product._id)}
                            className="btn btn-success btn-sm flex-fill"
                          >
                            <i className="fa fa-check me-1"></i>
                            Enable
                          </Button>
                        ) : (
                          <Button
                            onClick={(e) => disableHandler(e, product._id)}
                            className="btn btn-warning btn-sm flex-fill"
                          >
                            <i className="fa fa-ban me-1"></i>
                            Disable
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
