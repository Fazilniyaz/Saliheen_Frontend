import React, { useEffect, useState, forwardRef, useImperativeHandle, Fragment } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { MDBDataTable } from "mdbreact";
import AdminLoader from "./AdminLoader";

const BASE_URL = "https://saliheenperfumes-zd2i.onrender.com/api/v1";

const CouponTable = forwardRef(function CouponTable(props, ref) {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${BASE_URL}/admin/coupons`, {
        withCredentials: true,
      });
      setCoupons(data.coupons || []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch coupons.");
    } finally {
      setLoading(false);
    }
  };

  useImperativeHandle(ref, () => ({ refresh: fetchCoupons }));

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleDelete = async (e, couponId) => {
    e.currentTarget.disabled = true;
    if (!window.confirm("Are you sure you want to delete this coupon?")) {
      e.currentTarget.disabled = false;
      return;
    }
    try {
      await axios.delete(`${BASE_URL}/admin/coupon/${couponId}`, {
        withCredentials: true,
      });
      toast.success("Coupon deleted successfully.");
      setCoupons((prev) => prev.filter((c) => c._id !== couponId));
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete coupon.");
      e.currentTarget.disabled = false;
    }
  };

  const isExpired = (date) => new Date(date) < new Date();

  const tableData = {
    columns: [
      { label: "Code", field: "code", sort: "asc" },
      { label: "Discount", field: "discount", sort: "asc" },
      { label: "Expiry Date", field: "expiryDate", sort: "asc" },
      { label: "Status", field: "status", sort: "asc" },
      { label: "Actions", field: "actions", sort: "disabled" },
    ],
    rows: coupons.map((coupon) => {
      const expired = isExpired(coupon.expiryDate);
      return {
        code: <span style={{ fontFamily: "monospace", letterSpacing: "1px", fontWeight: "bold" }}>{coupon.code}</span>,
        discount: <span style={{ color: "#d4af37", fontWeight: "bold" }}>{coupon.discount}%</span>,
        expiryDate: new Date(coupon.expiryDate).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
        status: (
          <span className={`status-pill ${expired ? "disabled" : "active"}`}>
            {expired ? "Expired" : "Active"}
          </span>
        ),
        actions: (
          <Fragment>
            <button
              onClick={(e) => handleDelete(e, coupon._id)}
              className="tbl-btn tbl-btn-delete"
            >
              <i className="fa fa-trash"></i> Delete
            </button>
          </Fragment>
        ),
      };
    }),
  };

  if (loading || coupons.length === 0) {
    return <AdminLoader />;
  }

  return (
    <div className="table-responsive">
      {coupons.length === 0 ? (
        <p className="text-center text-muted py-4">No coupons created yet.</p>
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
  );
});

export default CouponTable;