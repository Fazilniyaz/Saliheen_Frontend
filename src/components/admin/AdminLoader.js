import { ThreeDots } from "react-loader-spinner";
import "./Dashboard.css";

export default function AdminLoader() {
    return (
        <div className="loading-wrapper">
            <ThreeDots height="48" width="48" radius="6" color="#ffffff" ariaLabel="loading" visible />
            <p className="loading-text">Loading Data…</p>
        </div>
    );
}
