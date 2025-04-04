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
              className="btn btn-primary"
              style={{ margin: "10px" }}
            >
              <i className="fa fa-pencil"></i>
            </Link>
            <Button
              onClick={(e) => deleteHandler(e, product._id)}
              className="btn btn-danger py-1 px-2 ml-2"
              style={{ margin: "10px" }}
            >
              <i className="fa fa-trash"></i>
            </Button>
            {product.disabled ? (
              <Button
                onClick={(e) => enableHandler(e, product._id)}
                className="btn btn-success py-1 px-2 ml-2"
                style={{ margin: "10px auto" }}
              >
                Enable
              </Button>
            ) : (
              <Button
                onClick={(e) => disableHandler(e, product._id)}
                className="btn btn-warning py-1 px-2 ml-2"
                style={{ margin: "10px" }}
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
    <div className="row">
      <div className="col-12 col-md-2">
        <Sidebar />
      </div>
      <div className="col-12 col-md-10">
        <h1
          className="my-4 headings"
          style={{
            backgroundImage:
              "repeating-linear-gradient(to right, #a2682a 0%, #be8c3c 8%, #be8c3c 18%, #d3b15f 27%, #faf0a0 35%, #ffffc2 40%, #faf0a0 50%, #d3b15f 58%, #be8c3c 67%, #b17b32 77%, #bb8332 83%, #d4a245 88%, #e1b453 93%, #a4692a 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            fontSize: "2rem",
            fontWeight: "bold",
            fontFamily: "Yantramanav",
            filter: "drop-shadow(0 0 1px rgba(255, 200, 0, .3))",
            animation: "MoveBackgroundPosition 6s ease-in-out infinite",
          }}
        >
          Product List
        </h1>
        <Fragment>
          {loading ? (
            <Loader />
          ) : (
            <MDBDataTable
              data={setProducts()}
              bordered
              striped
              hover
              className="px-6"
              style={{
                backgroundColor: "#000",
                color: "#fff",
                borderRadius: "10px",
                padding: "20px",
              }}
            />
          )}
        </Fragment>
      </div>
    </div>
  );
}
