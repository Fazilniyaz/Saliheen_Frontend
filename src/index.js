import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import store from "./store";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { GoogleOAuthProvider } from "@react-oauth/google";
import "semantic-ui-css/semantic.min.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  // <React.StrictMode>
  <GoogleOAuthProvider clientId="689703415437-5m2ursgv12igqeibro1b6s8a1trd9do2.apps.googleusercontent.com">
    <Provider store={store}>
      <App />
    </Provider>{" "}
  </GoogleOAuthProvider>

  // {/* </React.StrictMode> */}
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
