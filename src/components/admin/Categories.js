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
        "https://saliheenperfumes-zd2i.onrender.com/api/v1/user/category",
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
        "https://saliheenperfumes-zd2i.onrender.com/api/v1/admin/category",
        { name: newCategory.trim() },
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
        `https://saliheenperfumes-zd2i.onrender.com/api/v1/admin/category/${editingCategory._id}`,
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
        ? `https://saliheenperfumes-zd2i.onrender.com/api/v1/admin/category/disable/${id}`
        : `https://saliheenperfumes-zd2i.onrender.com/api/v1/admin/category/enable/${id}`;
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
    <div className="categories-wrapper">
      <div className="categories-container">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <main className="categories-main-content">
          <div className="categories-content-wrapper">
            <h1 className="categories-heading text-center mb-4">
              Manage Categories
            </h1>

            {/* Create New Category */}
            <div className="mb-4">
              <label htmlFor="newCategory" className="form-label">
                New Category:
              </label>
              <div className="d-flex">
                <input
                  type="text"
                  id="newCategory"
                  className="form-control me-2"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="Enter category name"
                />
                <button className="btn btn-primary" onClick={createCategory}>
                  Add
                </button>
              </div>
            </div>

            {/* Categories Table */}
            <div className="categories-table-card">
              <div className="table-responsive">
                <table className="table table-striped table-hover">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Name</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="text-center py-4 text-muted">
                          No categories found.
                        </td>
                      </tr>
                    ) : (
                      categories.map((category, index) => (
                        <tr key={category._id}>
                          <td>{index + 1}</td>
                          <td>
                            {editingCategory?._id === category._id ? (
                              <input
                                type="text"
                                className="form-control form-control-sm"
                                value={editCategoryName}
                                onChange={(e) =>
                                  setEditCategoryName(e.target.value)
                                }
                                autoFocus
                              />
                            ) : (
                              category.name
                            )}
                          </td>
                          <td>
                            <span
                              className={`badge ${category.isActive
                                ? "bg-success"
                                : "bg-warning text-dark"
                                }`}
                            >
                              {category.isActive ? "Active" : "Inactive"}
                            </span>
                          </td>
                          <td>
                            {editingCategory?._id === category._id ? (
                              <button
                                className="btn btn-success btn-sm"
                                onClick={saveEditCategory}
                              >
                                Save
                              </button>
                            ) : (
                              <button
                                className="btn btn-warning btn-sm me-2"
                                onClick={() => {
                                  setEditingCategory(category);
                                  setEditCategoryName(category.name);
                                }}
                              >
                                Edit
                              </button>
                            )}
                            <button
                              className={`btn ${category.isActive ? "btn-danger" : "btn-success"
                                } btn-sm`}
                              onClick={() =>
                                toggleCategoryStatus(
                                  category._id,
                                  category.isActive
                                )
                              }
                            >
                              {category.isActive ? "Disable" : "Enable"}
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>

      <style jsx>{`
        .categories-wrapper {
          background-color: #000;
          min-height: 100vh;
          color: white;
        }

        .categories-container {
          display: flex;
          width: 100%;
        }

        .categories-main-content {
          flex: 1;
          padding-left: 0;
          transition: padding-left 0.3s ease;
        }

        @media (min-width: 768px) {
          .categories-main-content {
            padding-left: 280px;
          }
        }

        .categories-content-wrapper {
          padding: 1.5rem;
        }

        .categories-heading {
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
          font-size: 2rem;
          font-weight: bold;
          font-family: "Yantramanav", sans-serif;
          animation: MoveBackgroundPosition 6s ease-in-out infinite;
          margin-bottom: 1.5rem;
        }

        .categories-table-card {
          background: #111;
          border-radius: 10px;
          padding: 1.2rem;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4);
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
          box-shadow: 0 0 0 0.2rem rgba(212, 162, 69, 0.25);
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
        }

        .table th,
        .table td {
          border-color: #444 !important;
          vertical-align: middle;
        }

        .table-hover tbody tr:hover {
          background-color: rgba(212, 175, 55, 0.07) !important;
        }

        /* Responsive */
        @media (max-width: 767.98px) {
          .categories-content-wrapper {
            padding: 1rem;
          }

          .categories-heading {
            font-size: 1.5rem;
          }

          .form-control,
          .btn {
            font-size: 0.875rem;
          }

          .table td,
          .table th {
            padding: 0.5rem;
          }
        }

        @media (max-width: 575.98px) {
          .d-flex > *:not(:last-child) {
            margin-right: 0.25rem !important;
          }

          .me-2 {
            margin-right: 0.25rem !important;
          }

          .btn-sm {
            padding: 0.2rem 0.4rem !important;
            font-size: 0.75rem !important;
          }
        }
      `}</style>
    </div>
  );
}
