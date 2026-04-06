import React, { useEffect, useState, Fragment } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import axios from "axios";
import { MDBDataTable } from "mdbreact";
import Sidebar from "./SideBar";
import AdminLoader from "./AdminLoader";
import "./Dashboard.css";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newCategory, setNewCategory] = useState("");
  const [editingCategory, setEditingCategory] = useState(null);
  const [editCategoryName, setEditCategoryName] = useState("");

  const dispatch = useDispatch();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        "https://saliheenperfumes-zd2i.onrender.com/api/v1/user/category",
        { withCredentials: true }
      );
      setCategories(data.categories || []);
    } catch (error) {
      toast.error("Failed to fetch categories");
    } finally {
      setLoading(false);
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

  const toggleCategoryStatus = async (e, id, isActive) => {
    e.currentTarget.disabled = true;
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
      e.currentTarget.disabled = false;
    }
  };

  const tableData = {
    columns: [
      { label: "No.", field: "no", sort: "asc" },
      { label: "Name", field: "name", sort: "asc" },
      { label: "Status", field: "status", sort: "asc" },
      { label: "Actions", field: "actions", sort: "disabled" },
    ],
    rows: categories.map((category, index) => ({
      no: index + 1,
      name:
        editingCategory?._id === category._id ? (
          <input
            type="text"
            className="coupon-input"
            style={{ padding: "6px 10px", width: "100%", maxWidth: "300px" }}
            value={editCategoryName}
            onChange={(e) => setEditCategoryName(e.target.value)}
            autoFocus
          />
        ) : (
          category.name
        ),
      status: (
        <span className={`status-pill ${category.isActive ? "active" : "disabled"}`}>
          {category.isActive ? "Active" : "Inactive"}
        </span>
      ),
      actions: (
        <Fragment>
          {editingCategory?._id === category._id ? (
            <button className="tbl-btn tbl-btn-enable" onClick={saveEditCategory}>
              <i className="fa fa-save"></i> Save
            </button>
          ) : (
            <button
              className="tbl-btn tbl-btn-edit text-warning"
              onClick={() => {
                setEditingCategory(category);
                setEditCategoryName(category.name);
              }}
            >
              <i className="fa fa-pencil"></i> Edit
            </button>
          )}

          <button
            className={`tbl-btn ${category.isActive ? "tbl-btn-disable" : "tbl-btn-enable"}`}
            onClick={(e) => toggleCategoryStatus(e, category._id, category.isActive)}
          >
            <i className={`fa ${category.isActive ? "fa-ban" : "fa-check"}`}></i>{" "}
            {category.isActive ? "Disable" : "Enable"}
          </button>
        </Fragment>
      ),
    })),
  };

  return (
    <div className="admin-page-wrapper">
      <Sidebar />
      <div className="admin-page-content">

        {/* Page Header */}
        <div className="page-header">
          <div>
            <h1 className="page-title">
              <i className="fa fa-tags"></i>
              Categories
            </h1>
            <p className="page-subtitle">Manage product categories</p>
          </div>
        </div>

        {/* Create Category Card */}
        <div className="table-card" style={{ padding: "24px 28px" }}>
          <div className="module-header" style={{ padding: "0 0 18px 0", marginBottom: "20px" }}>
            <i className="fas fa-plus-circle"></i>
            <span className="module-title">Create New Category</span>
          </div>

          <div className="coupon-form-grid" style={{ gridTemplateColumns: "1fr auto" }}>
            <div className="coupon-field">
              <label className="coupon-label">Category Name</label>
              <input
                type="text"
                className="coupon-input"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="e.g. Perfumes"
              />
            </div>
            <div className="coupon-field">
              <label className="coupon-label">&nbsp;</label>
              <button
                className="btn-primary-action"
                onClick={createCategory}
              >
                <i className="fa fa-plus"></i> Add
              </button>
            </div>
          </div>
        </div>

        {/* Categories Table */}
        <div className="table-card">
          <div className="module-header" style={{ padding: "18px 24px" }}>
            <i className="fas fa-list"></i>
            <span className="module-title">All Categories</span>
          </div>

          <div className="table-responsive">
            {loading ? (
              <AdminLoader />
            ) : categories.length === 0 ? (
              <p className="text-center text-muted py-4">No categories found.</p>
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

      {/* Reuse some form styles from the coupon page */}
      <style>{`
        .coupon-form-grid {
          display: grid;
          gap: 16px;
          align-items: end;
        }

        @media (max-width: 600px) {
          .coupon-form-grid {
            grid-template-columns: 1fr !important;
          }
        }

        .coupon-field {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .coupon-label {
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--gray-3);
          font-family: var(--font-mono);
        }

        .coupon-input {
          background: var(--black-3);
          border: 1px solid var(--gray-1);
          color: var(--white);
          border-radius: var(--radius-sm);
          padding: 10px 14px;
          font-size: 0.9rem;
          font-family: var(--font-body);
          transition: var(--transition);
          outline: none;
          width: 100%;
        }

        .coupon-input:focus {
          border-color: var(--gray-3);
          background: var(--black-4);
        }
      `}</style>
    </div>
  );
}
