import { Fragment, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { deleteUser, getUsers } from "../../actions/userActions";
import { clearError, clearUserDeleted } from "../../slices/userSlice";
import Loader from "../layouts/Loader";
import { MDBDataTable } from "mdbreact";
import { toast } from "react-toastify";
import Sidebar from "./SideBar";
import "./Dashboard.css";

export default function UserList() {
  const {
    users = [],
    loading = true,
    error,
    isUserDeleted,
  } = useSelector((state) => state.userState);
  const dispatch = useDispatch();

  const deleteHandler = useCallback((e, id) => {
    e.currentTarget.disabled = true;
    dispatch(deleteUser(id));
  }, [dispatch]);

  const tableData = {
    columns: [
      { label: "ID", field: "id", sort: "asc" },
      { label: "Name", field: "name", sort: "asc" },
      { label: "Email", field: "email", sort: "asc" },
      { label: "Role", field: "role", sort: "asc" },
      { label: "Actions", field: "actions", sort: "disabled" },
    ],
    rows: users.map((user) => ({
      id: user._id,
      name: user.name,
      email: user.email,
      role: (
        <span className={`role-badge ${user.role === "admin" ? "admin" : "user"}`}>
          {user.role}
        </span>
      ),
      actions: (
        <Fragment>
          <Link to={`/admin/user/${user._id}`} className="tbl-btn tbl-btn-edit">
            <i className="fa fa-pencil"></i> Edit
          </Link>
          <button
            onClick={(e) => deleteHandler(e, user._id)}
            className="tbl-btn tbl-btn-delete"
          >
            <i className="fa fa-trash"></i> Delete
          </button>
        </Fragment>
      ),
    })),
  };

  useEffect(() => {
    if (error) {
      toast(error, {
        position: "bottom-center",
        type: "error",
        onOpen: () => dispatch(clearError()),
      });
      return;
    }
    if (isUserDeleted) {
      toast("User deleted successfully", {
        type: "success",
        position: "bottom-center",
        onOpen: () => dispatch(clearUserDeleted()),
      });
      return;
    }
    dispatch(getUsers);
  }, [dispatch, error, isUserDeleted]);

  return (
    <div className="admin-page-wrapper">
      <Sidebar />
      <div className="admin-page-content">

        {/* Header */}
        <div className="page-header">
          <div>
            <h1 className="page-title">
              <i className="fa fa-users"></i>
              Users
            </h1>
            <p className="page-subtitle">
              <span className="count-badge">
                <span className="num">{users.length}</span> registered
              </span>
            </p>
          </div>
        </div>

        {/* Table */}
        <div className="table-card">
          {loading ? (
            <Loader />
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

      </div>
    </div>
  );
}