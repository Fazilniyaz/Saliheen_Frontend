// import { Fragment } from "react";
// import { useState } from "react";
// import { countries } from "countries-list";
// import { useDispatch, useSelector } from "react-redux";
// import { saveShippingInfo } from "../../slices/cartSlice";
// import { useNavigate } from "react-router-dom";
// import CheckoutSteps from "./CheckoutSteps";
// import { toast } from "react-toastify";

// export const validateShipping = ({ shippingInfo, navigate }) => {
//   console.log(shippingInfo);
//   if (
//     !shippingInfo.address ||
//     !shippingInfo.city ||
//     !shippingInfo.state ||
//     !shippingInfo.country ||
//     !shippingInfo.phoneNo ||
//     !shippingInfo.postalCode
//   ) {
//     toast.error("Please fill the shipping information", {
//       position: "bottom-center",
//     });
//     navigate("/shipping");
//   }
// };

// export default function Shipping() {
//   const { shippingInfo = {} } = useSelector((state) => state.cartState);

//   const { user = "" } = useSelector((state) => state.authState);

//   console.log(user);

//   const [address, setAddress] = useState(shippingInfo.address);
//   const [city, setCity] = useState(shippingInfo.city);
//   const [phoneNo, setPhoneNo] = useState(shippingInfo.phoneNo);
//   const [postalCode, setPostalCode] = useState(shippingInfo.postalCode);
//   const [country, setCountry] = useState(shippingInfo.country);
//   const [state, setState] = useState(shippingInfo.state);
//   const countryList = Object.values(countries);
//   const [existingAddresses, setExistingAddress] = useState([]);
//   const [boolean, setBoolean] = useState(false);
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const submitHandler = (e) => {
//     e.preventDefault();
//     dispatch(
//       saveShippingInfo({ address, city, phoneNo, postalCode, country, state })
//     );
//     navigate(`/order/confirm`);
//   };

//   console.log(user.addresses);

//   return (
//     <Fragment>
//       <CheckoutSteps shipping />
//       <div className="row wrapper">
//         <div className="col-10 col-lg-5">
//           <form onSubmit={submitHandler} className="shadow-lg">
//             <h1 className="mb-4">Shipping Info</h1>
//             <div className="form-group">
//               <label htmlFor="address_field">Address</label>
//               <input
//                 type="text"
//                 id="address_field"
//                 className="form-control"
//                 value={address}
//                 onChange={(e) => {
//                   setAddress(e.target.value);
//                 }}
//                 required
//               />
//             </div>

//             <div className="form-group">
//               <label htmlFor="city_field">City</label>
//               <input
//                 type="text"
//                 id="city_field"
//                 className="form-control"
//                 value={city}
//                 onChange={(e) => {
//                   setCity(e.target.value);
//                 }}
//                 required
//               />
//             </div>

//             <div className="form-group">
//               <label htmlFor="phone_field">Phone No</label>
//               <input
//                 type="phone"
//                 id="phone_field"
//                 className="form-control"
//                 value={phoneNo}
//                 onChange={(e) => {
//                   setPhoneNo(e.target.value);
//                 }}
//                 required
//               />
//             </div>

//             <div className="form-group">
//               <label htmlFor="postal_code_field">Postal Code</label>
//               <input
//                 type="number"
//                 id="postal_code_field"
//                 className="form-control"
//                 value={postalCode}
//                 onChange={(e) => {
//                   setPostalCode(e.target.value);
//                 }}
//                 required
//               />
//             </div>

//             <div className="form-group">
//               <label htmlFor="country_field">Country</label>
//               <select
//                 id="country_field"
//                 className="form-control"
//                 value={country}
//                 onChange={(e) => setCountry(e.target.value)}
//                 required
//               >
//                 {countryList.map((country, i) => (
//                   <option key={i} value={country.name}>
//                     {country.name}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <div className="form-group">
//               <label htmlFor="state_field">State</label>
//               <input
//                 type="text"
//                 id="state_field"
//                 className="form-control"
//                 value={state}
//                 onChange={(e) => setState(e.target.value)}
//                 required
//               />
//             </div>

//             <button
//               id="shipping_btn"
//               type="submit"
//               className="btn btn-block py-3"
//             >
//               CONTINUE
//             </button>
//           </form>
//         </div>
//       </div>
//     </Fragment>
//   );
// }

import { Fragment, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { saveShippingInfo } from "../../slices/cartSlice";
import { useNavigate } from "react-router-dom";
import CheckoutSteps from "./CheckoutSteps";
import { toast } from "react-toastify";
import { countries } from "countries-list";
import axios from "axios";
import { useTheme } from "../../context";

export const validateShipping = ({ shippingInfo, navigate }) => {
  console.log(shippingInfo);
  if (
    !shippingInfo.address ||
    !shippingInfo.city ||
    !shippingInfo.state ||
    !shippingInfo.country ||
    !shippingInfo.phoneNo ||
    !shippingInfo.postalCode
  ) {
    toast.success("Order Confirmed", {
      position: "bottom-center",
    });
    navigate("/");
  }
};

export default function Shipping() {
  const { shippingInfo = {} } = useSelector((state) => state.cartState);
  const { user = "" } = useSelector((state) => state.authState);
  const { colors } = useTheme();

  const [address, setAddress] = useState(shippingInfo.address || "");
  const [city, setCity] = useState(shippingInfo.city || "");
  const [phoneNo, setPhoneNo] = useState(shippingInfo.phoneNo || "");
  const [postalCode, setPostalCode] = useState(shippingInfo.postalCode || "");
  const [country, setCountry] = useState(shippingInfo.country || "");
  const [state, setState] = useState(shippingInfo.state || "");
  const [fullName, setFullName] = useState(shippingInfo.fullName || (user && user.name) || "");
  const [guestEmail, setGuestEmail] = useState(shippingInfo.guestEmail || (user && user.email) || "");
  const [useExistingAddress, setUseExistingAddress] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [phoneForExistingAddress, setPhoneForExistingAddress] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const countryList = Object.values(countries);

  const handleExistingAddressSelect = (address) => {
    setSelectedAddress(address);
    setAddress(address.addressLine);
    setCity(address.city);
    setPostalCode(address.postalCode);
    setCountry(address.country);
    setState(address.state);
    setUseExistingAddress(true);
  };

  const handleExistingAddressSubmit = () => {
    if (!selectedAddress) {
      toast.error("Please select an existing address!", {
        position: "bottom-center",
      });
      return;
    }
    if (!phoneForExistingAddress) {
      toast.error("Please provide a phone number for the selected address!");
      return;
    }
    dispatch(
      saveShippingInfo({
        address: selectedAddress.addressLine,
        city: selectedAddress.city,
        phoneNo: phoneForExistingAddress,
        postalCode: selectedAddress.postalCode,
        country: selectedAddress.country,
        state: selectedAddress.state,
      })
    );
    navigate(`/order/confirm`);
  };

  const handleNewAddressSubmit = (e) => {
    e.preventDefault();
    const currentShippingInfo = {
      address,
      city,
      phoneNo,
      postalCode,
      country,
      state,
      fullName: fullName || (user && user.name),
      guestEmail: guestEmail || (user && user.email),
    };

    if (!user) {
      if (!fullName.trim() || !guestEmail.trim()) {
        toast.error("Please enter your name and email", { position: "bottom-center" });
        return;
      }
      dispatch(saveShippingInfo(currentShippingInfo));
      navigate(`/order/confirm`);
      return;
    }

    const addressForm = {
      addressLine: address,
      city,
      postalCode,
      country,
      state,
    };

    let userAddedExistingAddress = false;
    (user.addresses || []).map((item) => {
      if (address === item.addressLine) {
        toast("Address Already exists!", {
          type: "error",
          position: "bottom-center",
        });
        userAddedExistingAddress = true;
        return;
      }
    });

    if (!userAddedExistingAddress) {
      async function addNewAddress() {
        await axios.post(
          "https://saliheenperfumes-zd2i.onrender.com/api/v1/createAddress",
          addressForm,
          {
            withCredentials: true,
          }
        );
        toast("Address Created Successfully!", {
          position: "bottom-center",
        });
      }
      addNewAddress();
      dispatch(saveShippingInfo(currentShippingInfo));
      navigate(`/order/confirm`);
    }
  };

  return (
    <Fragment>
      <CheckoutSteps shipping />
      <div
        style={{
          margin: "1.5rem auto",
          padding: "1.25rem",
          maxWidth: "90%",
          backgroundColor: colors.bgPage,
          borderRadius: "12px",
          boxShadow: "0 2px 12px rgba(0, 0, 0, 0.06)",
          border: `1px solid ${colors.borderLight}`,
        }}
      >
        <h1
          style={{
            textAlign: "center",
            fontSize: "2rem",
            fontWeight: "600",
            color: colors.textPrimary,
            fontFamily: "Yantramanav",
            marginBottom: "1rem",
          }}
        >
          Shipping Info
        </h1>

        {/* Existing Addresses - only for logged-in users */}
        {user && user.addresses && user.addresses.length > 0 && (
          <div style={{ marginBottom: "2rem" }}>
            <h2
              style={{
                fontSize: "1.5rem",
                fontWeight: "bold",
                color: colors.textPrimary,
                marginBottom: "1rem",
              }}
            >
              Select an Existing Address
            </h2>
            {user.addresses.map((item, i) => (
              <div key={i} style={{ marginBottom: "1rem" }}>
                <input
                  type="radio"
                  id={`address-${i}`}
                  name="existingAddress"
                  value={i}
                  onChange={() => handleExistingAddressSelect(item)}
                  checked={selectedAddress === item}
                />
                <label
                  htmlFor={`address-${i}`}
                  style={{
                    marginLeft: "0.5rem",
                    color: "#333333",
                    fontSize: "1rem",
                  }}
                >
                  {`${item.addressLine}, ${item.city}, ${item.state}, ${item.country}, ${item.postalCode}`}
                </label>
              </div>
            ))}
            {useExistingAddress && (
              <div style={{ marginTop: "1rem" }}>
                <label
                  htmlFor="phone_existing_field"
                  style={{ color: "#333333", fontSize: "1rem" }}
                >
                  Phone No (for existing address)
                </label>
                <input
                  type="phone"
                  id="phone_existing_field"
                  style={{
                    width: "100%",
                    padding: "0.5rem",
                    borderRadius: "5px",
                    marginTop: "0.5rem",
                    color: "black",
                  }}
                  value={phoneForExistingAddress}
                  onChange={(e) => setPhoneForExistingAddress(e.target.value)}
                  required
                />
              </div>
            )}
            <button
              style={{
                backgroundColor: "#1a1a1a",
                color: "#fff",
                fontWeight: "600",
                padding: "0.5rem 1rem",
                borderRadius: "5px",
                marginTop: "1rem",
                border: "none",
              }}
              onClick={handleExistingAddressSubmit}
            >
              Continue with Selected Address
            </button>
            <button
              style={{
                backgroundColor: "#555555",
                color: "#fff",
                fontWeight: "bold",
                padding: "0.5rem 1rem",
                borderRadius: "5px",
                marginLeft: "1rem",
                border: "none",
              }}
              onClick={() => setUseExistingAddress(false)}
            >
              Enter a New Address
            </button>
          </div>
        )}

        {/* New Address Form */}
        {(!useExistingAddress || !user) && (
          <form
            onSubmit={handleNewAddressSubmit}
            style={{
              backgroundColor: "#fafafa",
              padding: "1rem",
              borderRadius: "10px",
              border: "1px solid #e5e5e5",
              boxShadow: "0 1px 3px rgba(0, 0, 0, 0.06)",
            }}
          >
            {!user && (
              <>
                <div style={{ marginBottom: "1rem" }}>
                  <label htmlFor="fullName_field" style={{ color: "#333333", fontSize: "1rem" }}>
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="fullName_field"
                    style={{
                      width: "100%",
                      padding: "0.5rem",
                      borderRadius: "5px",
                      marginTop: "0.5rem",
                      color: "black",
                    }}
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>
                <div style={{ marginBottom: "1rem" }}>
                  <label htmlFor="guestEmail_field" style={{ color: "#333333", fontSize: "1rem" }}>
                    Email
                  </label>
                  <input
                    type="email"
                    id="guestEmail_field"
                    style={{
                      width: "100%",
                      padding: "0.5rem",
                      borderRadius: "5px",
                      marginTop: "0.5rem",
                      color: "black",
                    }}
                    value={guestEmail}
                    onChange={(e) => setGuestEmail(e.target.value)}
                    required
                  />
                </div>
              </>
            )}
            <div style={{ marginBottom: "1rem" }}>
              <label
                htmlFor="address_field"
                style={{ color: "#333333", fontSize: "1rem" }}
              >
                Address
              </label>
              <input
                type="text"
                id="address_field"
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  borderRadius: "5px",
                  marginTop: "0.5rem",
                  color: "black",
                }}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
            </div>

            <div style={{ marginBottom: "1rem" }}>
              <label
                htmlFor="city_field"
                style={{ color: "#333333", fontSize: "1rem" }}
              >
                City
              </label>
              <input
                type="text"
                id="city_field"
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  borderRadius: "5px",
                  marginTop: "0.5rem",
                  color: "black",
                }}
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
              />
            </div>

            <div style={{ marginBottom: "1rem" }}>
              <label
                htmlFor="phone_field"
                style={{ color: "#333333", fontSize: "1rem" }}
              >
                Phone No
              </label>
              <input
                type="phone"
                id="phone_field"
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  borderRadius: "5px",
                  marginTop: "0.5rem",
                  color: "black",
                }}
                value={phoneNo}
                onChange={(e) => setPhoneNo(e.target.value)}
                required
              />
            </div>

            <div style={{ marginBottom: "1rem" }}>
              <label
                htmlFor="postal_code_field"
                style={{ color: "#333333", fontSize: "1rem" }}
              >
                Postal Code
              </label>
              <input
                type="number"
                id="postal_code_field"
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  borderRadius: "5px",
                  marginTop: "0.5rem",
                  color: "black",
                }}
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                required
              />
            </div>

            <div style={{ marginBottom: "1rem" }}>
              <label
                htmlFor="country_field"
                style={{ color: "#333333", fontSize: "1rem" }}
              >
                Country
              </label>
              <select
                id="country_field"
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  borderRadius: "5px",
                  marginTop: "0.5rem",
                  color: "black",
                }}
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                required
              >
                {countryList.map((country, i) => (
                  <option key={i} value={country.name}>
                    {country.name}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: "1rem" }}>
              <label
                htmlFor="state_field"
                style={{ color: "#333333", fontSize: "1rem" }}
              >
                State
              </label>
              <input
                type="text"
                id="state_field"
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  borderRadius: "5px",
                  marginTop: "0.5rem",
                  color: "black",
                }}
                value={state}
                onChange={(e) => setState(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              style={{
                backgroundColor: "#a2682a",
                color: "white",
                fontWeight: "bold",
                padding: "0.5rem 1rem",
                borderRadius: "5px",
                border: "none",
                width: "100%",
              }}
            >
              Continue with New Address
            </button>
          </form>
        )}
      </div>
    </Fragment>
  );
}
