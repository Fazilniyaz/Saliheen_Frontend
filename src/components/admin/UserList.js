import { Fragment, useEffect } from "react";
import { Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { deleteUser, getUsers } from "../../actions/userActions";
import { clearError, clearUserDeleted } from "../../slices/userSlice";
import Loader from "../layouts/Loader";
import { MDBDataTable } from "mdbreact";
import { toast } from "react-toastify";
import Sidebar from "./SideBar";

export default function UserList() {
  const {
    users = [],
    loading = true,
    error,
    isUserDeleted,
  } = useSelector((state) => state.userState);

  const dispatch = useDispatch();

  const setUsers = () => {
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
          label: "Email",
          field: "email",
          sort: "asc",
        },
        {
          label: "Role",
          field: "role",
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

    users.forEach((user) => {
      data.rows.push({
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        actions: (
          <Fragment>
            <Link
              to={`/admin/user/${user._id}`}
              className="btn btn-sm"
              style={{
                backgroundColor: "#be8c3c",
                color: "#000",
                marginRight: "5px",
              }}
            >
              <i className="fa fa-pencil"></i>
            </Link>
            <Button
              onClick={(e) => deleteHandler(e, user._id)}
              className="btn btn-sm"
              style={{ backgroundColor: "#a4692a", color: "#fff" }}
            >
              <i className="fa fa-trash"></i>
            </Button>
          </Fragment>
        ),
      });
    });

    return data;
  };

  const deleteHandler = (e, id) => {
    e.target.disabled = true;
    dispatch(deleteUser(id));
  };

  useEffect(() => {
    if (error) {
      toast(error, {
        position: "bottom-center",
        type: "error",
        onOpen: () => {
          dispatch(clearError());
        },
      });
      return;
    }
    if (isUserDeleted) {
      toast("User Deleted Successfully!", {
        type: "success",
        position: "bottom-center",
        onOpen: () => dispatch(clearUserDeleted()),
      });
      return;
    }

    dispatch(getUsers);
  }, [dispatch, error, isUserDeleted]);

  return (
    <div style={{ backgroundColor: "#000", minHeight: "100vh" }}>
      <style>{`
        .gradient-heading {
          background-image: repeating-linear-gradient(
            to right,
            #a2682a 0%,
            #be8c3c 8%,
            #be8c3c 18%,
            #d3b15f 27%,
            #faf0a0 35%,
            #ffffc2 40%,
            #faf0a0 50%,
            #d3b15f 58%,
            #be8c3c 67%,
            #b17b32 77%,
            #bb8332 83%,
            #d4a245 88%,
            #e1b453 93%,
            #a4692a 100%
          );
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          font-size: 28px;
          font-weight: bold;
          font-family: "Yantramanav", sans-serif;
          animation: MoveBackgroundPosition 6s ease-in-out infinite;
          text-align: center;
        }

        .custom-table table {
          color: white !important;
          background-color: #111 !important;
        }

        .custom-table .table-bordered th,
        .custom-table .table-bordered td {
          border-color: #444 !important;
        }

        .table-responsive {
          overflow-x: auto;
        }

        @media (max-width: 768px) {
          .gradient-heading {
            font-size: 20px;
          }
          .btn {
            padding: 4px 8px !important;
            font-size: 14px !important;
          }
        }
      `}</style>

      <div className="row">
        <div className="col-12 col-md-2">
          <Sidebar />
        </div>
        <div className="col-12 col-md-10 p-4">
          <h1 className="my-4 gradient-heading">User List</h1>

          {loading ? (
            <Loader />
          ) : (
            <div className="table-responsive bg-dark p-3 rounded shadow">
              <MDBDataTable
                data={setUsers()}
                bordered
                striped
                hover
                className="custom-table"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
