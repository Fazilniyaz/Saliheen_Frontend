// import React, { Fragment } from "react";

// export const Footer = () => {
//   return (
//     <Fragment>
//       <footer class="py-1">
//         <p class="text-center text-dark mt-1">
//           ChronoCraft - 2022-2023, All Rights Reserved
//         </p>
//       </footer>
//     </Fragment>
//   );
// };
import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaYoutube, FaInstagram, FaPhoneAlt, FaEnvelope } from "react-icons/fa"; // Importing icons
// import { Data } from "../datas/data";
import About from "../privacypolicy/About";
import { Divider } from "semantic-ui-react";
export const Footer = () => {
  const [categories, setCategories] = useState([]);
  const [boolean, setBoolean] = useState(false);

  useEffect(() => {
    // Fetch categories and update state with active one
    async function getAllCategories() {
      try {
        const { data } = await axios.get("/api/v1/admin/category");
        console.log(data);
        const activeCategories = data.categories.filter(
          (item) => item.isActive
        );
        setCategories(activeCategories.map((item) => item.name)); // Push active names into state
        setBoolean(true);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    }

    getAllCategories();
  }, []); // Empty dependency array ensures it runs only once

  console.log(categories);

  return (
    <div className="bg-black text-gray-200 py-10 px-6 mt-6">
      <Divider/>
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Address Section */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Address</h2>
          <p className="leading-relaxed">
          Saliheen Perfumes #2, <br/>Vincent Rd,<br/> near Masjidul Muslimeen , Fort, Coimbatore, Tamil Nadu 641001.
          </p>
        </div>

        {/* Main Categories Section */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Policies</h2>
          <About />
        </div>

        {/* Contact Section */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Contact Us</h2>
          <p className="flex items-center mb-2">
            <FaPhoneAlt className="mr-2" /> +91 8072826007
          </p>
          <p className="flex items-center mb-2">
            <FaEnvelope className="mr-2" />
            <a
              href="mailto:fazilniyazdeen@gmail.com"
              className="hover:text-gray-400"
            >
              saliheenperfumes@gmail.com
            </a>
          </p>
          <div className="flex gap-4 mt-4">
            <a
              href="#"
              className="text-2xl hover:text-red-500 transition duration-300"
            >
              <FaYoutube />
            </a>
            <a
              href="#"
              className="text-2xl hover:text-pink-500 transition duration-300"
            >
              <FaInstagram />
            </a>
          </div>
        </div>
      </div>
      <div className="text-center mt-8 border-t border-gray-700 pt-4">
        <p>© 2025 Saliheen Perfumes. All rights reserved.</p>
      </div>
    </div>
  );
};
