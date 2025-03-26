import React from "react";
import { Message, Icon, Header, Divider } from "semantic-ui-react";
import "./AttarOudhHistory.scss";
const AttarOudhHistory = () => (
  <>
  <div class="wrapper">
    <p className="attar">
      Attar, or Ittar, is one of the oldest forms of natural perfume,
      originating from the Middle East and South Asia. It is made through steam
      distillation of flowers and herbs, then infused with a base oil like
      sandalwood. Attar has significant cultural importance, especially in
      Islamic culture, and is valued for its natural, long-lasting fragrance.
    </p>
    <Divider />
    <p className="oudh">
      Oudh, also known as agarwood, is a rare and valuable resin produced by the
      Aquilaria tree. This fragrant resin has been treasured for thousands of
      years, particularly in the Middle East, where it is used as incense and in
      perfumes. Oudh holds a special place in many cultures and is often
      associated with luxury and spiritual significance.
    </p>
  </div>
  <Divider/>
  </>
);

export default AttarOudhHistory;
