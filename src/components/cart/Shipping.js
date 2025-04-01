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
    toast.error("Please fill the shipping information", {
      position: "bottom-center",
    });
    navigate("/shipping");
  }
};

export default function Shipping() {
  const { shippingInfo = {} } = useSelector((state) => state.cartState);
  const { user = "" } = useSelector((state) => state.authState);

  const [address, setAddress] = useState(shippingInfo.address || "");
  const [city, setCity] = useState(shippingInfo.city || "");
  const [phoneNo, setPhoneNo] = useState(shippingInfo.phoneNo || "");
  const [postalCode, setPostalCode] = useState(shippingInfo.postalCode || "");
  const [country, setCountry] = useState(shippingInfo.country || "");
  const [state, setState] = useState(shippingInfo.state || "");
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
    };

    const addressForm = {
      addressLine: address,
      city,
      postalCode,
      country,
      state,
    };

    let userAddedExistingAddress = false;

    user.addresses.map((item) => {
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
          "https://api.saliheenperfumes.com/api/v1/createAddress",
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
          margin: "2rem auto",
          padding: "1rem",
          maxWidth: "90%",
          backgroundColor: "black",
          borderRadius: "10px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
        }}
      >
        <h1
          style={{
            textAlign: "center",
            backgroundImage:
              "repeating-linear-gradient(to right, #a2682a 0%, #be8c3c 8%, #be8c3c 18%, #d3b15f 27%, #faf0a0 35%, #ffffc2 40%, #faf0a0 50%, #d3b15f 58%, #be8c3c 67%, #b17b32 77%, #bb8332 83%, #d4a245 88%, #e1b453 93%, #a4692a 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            fontSize: "2.5rem",
            fontWeight: "bold",
            fontFamily: "Yantramanav",
            filter: "drop-shadow(0 0 1px rgba(255, 200, 0, .3))",
            animation: "MoveBackgroundPosition 6s ease-in-out infinite",
          }}
        >
          Shipping Info
        </h1>

        {/* Existing Addresses */}
        {user && user.addresses && user.addresses.length > 0 && (
          <div style={{ marginBottom: "2rem" }}>
            <h2
              style={{
                fontSize: "1.5rem",
                fontWeight: "bold",
                color: "#a2682a",
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
                    color: "#fff",
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
                  style={{ color: "#fff", fontSize: "1rem" }}
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
                  }}
                  value={phoneForExistingAddress}
                  onChange={(e) => setPhoneForExistingAddress(e.target.value)}
                  required
                />
              </div>
            )}
            <button
              style={{
                backgroundColor: "#a2682a",
                color: "white",
                fontWeight: "bold",
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
                backgroundColor: "#444",
                color: "white",
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
        {!useExistingAddress && (
          <form
            onSubmit={handleNewAddressSubmit}
            style={{
              backgroundColor: "#222",
              padding: "1rem",
              borderRadius: "10px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
            }}
          >
            <div style={{ marginBottom: "1rem" }}>
              <label
                htmlFor="address_field"
                style={{ color: "#fff", fontSize: "1rem" }}
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
                }}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
            </div>

            <div style={{ marginBottom: "1rem" }}>
              <label
                htmlFor="city_field"
                style={{ color: "#fff", fontSize: "1rem" }}
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
                }}
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
              />
            </div>

            <div style={{ marginBottom: "1rem" }}>
              <label
                htmlFor="phone_field"
                style={{ color: "#fff", fontSize: "1rem" }}
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
                }}
                value={phoneNo}
                onChange={(e) => setPhoneNo(e.target.value)}
                required
              />
            </div>

            <div style={{ marginBottom: "1rem" }}>
              <label
                htmlFor="postal_code_field"
                style={{ color: "#fff", fontSize: "1rem" }}
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
                }}
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                required
              />
            </div>

            <div style={{ marginBottom: "1rem" }}>
              <label
                htmlFor="country_field"
                style={{ color: "#fff", fontSize: "1rem" }}
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
                style={{ color: "#fff", fontSize: "1rem" }}
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
