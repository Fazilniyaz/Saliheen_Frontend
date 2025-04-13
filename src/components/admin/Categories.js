import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import axios from "axios";
import Sidebar from "./SideBar";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [editingCategory, setEditingCategory] = useState(null);
  const [editCategoryName, setEditCategoryName] = useState("");

  const dispatch = useDispatch();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data } = await axios.get(
        "https://api.saliheenperfumes.com/api/v1/user/category",
        { withCredentials: true }
      );
      setCategories(data.categories);
    } catch (error) {
      toast.error("Failed to fetch categories");
    }
  };

  const createCategory = async () => {
    try {
      if (!newCategory.trim()) {
        toast.error("Category name cannot be empty");
        return;
      }
      const { data } = await axios.post(
        "https://api.saliheenperfumes.com/api/v1/admin/category",
        {
          name: newCategory.trim(),
        },
        { withCredentials: true }
      );
      toast.success(data.message);
      setNewCategory("");
      fetchCategories();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create category");
    }
  };

  const saveEditCategory = async () => {
    try {
      const { data } = await axios.put(
        `https://api.saliheenperfumes.com/api/v1/admin/category/${editingCategory._id}`,
        { name: editCategoryName.trim() },
        { withCredentials: true }
      );
      toast.success(data.message);
      setEditingCategory(null);
      setEditCategoryName("");
      fetchCategories();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update category");
    }
  };

  const toggleCategoryStatus = async (id, isActive) => {
    try {
      const endpoint = isActive
        ? `https://api.saliheenperfumes.com/api/v1/admin/category/disable/${id}`
        : `https://api.saliheenperfumes.com/api/v1/admin/category/enable/${id}`;
      const { data } = await axios.patch(
        endpoint,
        {},
        { withCredentials: true }
      );
      toast.success(data.message);
      fetchCategories();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update status");
    }
  };

  return (
    <div
      style={{ backgroundColor: "#000", minHeight: "100vh", color: "white" }}
    >
      <style>{`
        .headings {
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

        .container {
          padding: 30px;
        }

        .form-control {
          background-color: #222;
          color: white;
          border: 1px solid #be8c3c;
        }

        .form-control:focus {
          background-color: #222;
          color: white;
          border-color: #d4a245;
          box-shadow: 0 0 0 0.2rem rgba(222, 180, 95, 0.25);
        }

        .btn-primary {
          background-color: #be8c3c;
          border-color: #a2682a;
        }

        .btn-primary:hover {
          background-color: #d4a245;
          border-color: #be8c3c;
        }

        .btn-warning {
          background-color: #e4b644;
          border-color: #c7982e;
          color: black;
        }

        .btn-warning:hover {
          background-color: #ffd863;
          color: black;
        }

        .btn-danger {
          background-color: #b93131;
          border-color: #9b1c1c;
        }

        .btn-success {
          background-color: #4caf50;
          border-color: #388e3c;
        }

        .table {
          color: white;
          background-color: #111;
        }

        .table th, .table td {
          border-color: #444 !important;
        }

        @media (max-width: 768px) {
          .headings {
            font-size: 20px;
          }

          .btn {
            padding: 4px 8px !important;
            font-size: 14px !important;
          }

          .form-group {
            margin-bottom: 1.5rem;
          }
        }
      `}</style>

      <div className="d-flex">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <div className="container">
          <h1 className="my-4 headings">Manage Categories</h1>

          {/* Create New Category */}
          <div className="form-group mb-4">
            <label htmlFor="newCategory">New Category:</label>
            <input
              type="text"
              id="newCategory"
              className="form-control"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
            />
            <button className="btn btn-primary mt-2" onClick={createCategory}>
              Add Category
            </button>
          </div>

          {/* Display Categories */}
          <div className="table-responsive">
            <table className="table table-striped table-bordered">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((category, index) => (
                  <tr key={category._id}>
                    <td>{index + 1}</td>
                    <td>
                      {editingCategory?._id === category._id ? (
                        <input
                          type="text"
                          className="form-control"
                          value={editCategoryName}
                          onChange={(e) => setEditCategoryName(e.target.value)}
                        />
                      ) : (
                        category.name
                      )}
                    </td>
                    <td>{category.isActive ? "Active" : "Inactive"}</td>
                    <td>
                      {editingCategory?._id === category._id ? (
                        <button
                          className="btn btn-success"
                          onClick={saveEditCategory}
                        >
                          Save
                        </button>
                      ) : (
                        <button
                          className="btn btn-warning"
                          onClick={() => {
                            setEditingCategory(category);
                            setEditCategoryName(category.name);
                          }}
                        >
                          Edit
                        </button>
                      )}
                      <button
                        className={`btn ${
                          category.isActive ? "btn-danger" : "btn-success"
                        } mx-2`}
                        onClick={() =>
                          toggleCategoryStatus(category._id, category.isActive)
                        }
                      >
                        {category.isActive ? "Disable" : "Enable"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
