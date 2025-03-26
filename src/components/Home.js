import React, { useEffect, useState } from "react";
import axios from "axios";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Divider } from "semantic-ui-react";
import AttarOudhHistory from "./AttarOudhHistory/AttarOudhHistory";
import PerfumeProcess from "./PerfumeProcess/PerfumeProcess";
import "./Home.css";
import { useNavigate } from "react-router-dom";

// Dynamically import all images from assets folder
const importAll = (r) => r.keys().map(r);
const images = importAll(
  require.context("../../public/jpeg_photos", false, /\.(png|jpe?g|svg)$/)
);

const staticCategories = ["inspired.jpg", "luxury.jpg", "custom.jpg"];
const imagesCat = importAll(
  require.context("../../public/categories", false, /\.(png|jpe?g|svg|jpg)$/)
);

const quotes = [
  "العطر يوقظ الذكريات التي دفنتها السنين. - Perfume awakens memories buried by the years. (Arabic)",
  "Le parfum est une expression de l'amour silencieux. - Perfume is an expression of silent love. (French)",
  "العود والورد عطر الشرق وعبيره الأزلي. - Oud and rose are the perfumes of the East and its eternal fragrance. (Arabic)",
  "Das Parfum ist die Sprache, die das Herz spricht. - Perfume is the language spoken by the heart. (German)",
  "العطر هو تعبير عن الحنين ويمتد ليشمل كل ما هو جميل. - Perfume is an expression of nostalgia and extends to include all that is beautiful. (Arabic)",
  "アッタールは平和の香り、時間がゆっくり流れ、自然が咲く香りです。 - Attar is the scent of peace, of time slowing down and nature blooming. (Japanese)",
  "العطر هو رسالة سرية تُرسل من روح إلى أخرى. - Perfume is a secret message sent from one person’s soul to another. (Arabic)",
  "Attar es una celebración de la naturaleza, pura y sin refinar. - Attar is a celebration of nature, pure and unrefined. (Spanish)",
  "العطر هو لغة الحب، خفية وساحرة. - Perfume is a language of love, subtle and intoxicating. (Arabic)",
  "Attar captura el espíritu de la naturaleza y lo conserva en una botella. - Attar captures the spirit of nature and preserves it in a bottle. (Spanish)",
  "العطر هو مرآة لمشاعرنا، يكشف ما يكمن تحت السطح. - Perfume is the mirror of our emotions, it reveals what lies beneath the surface. (Arabic)",
  "アッタールはシンプルさの香りでありながら、深みのある世界を持っています。 - Attar is the fragrance of simplicity, yet it carries a world of depth. (Japanese)",
  "العطر هو تعبير عن الفردية، همس عن من تكون. - Perfume is an expression of individuality, a whisper of who you are. (Arabic)",
  "Attar рассказывает истории пустынь и роз, аромат, созданный природой. - Attar tells the stories of deserts and roses, a fragrance crafted by nature. (Russian)",
  "العطر كالتوقيع الشخصي، يترك أثراً أينما ذهبت. - Perfume is like a personal signature, leaving a trail wherever you go. (Arabic)",
  "아타르는 꽃과 향신료의 중심으로 향기로운 여행입니다. - Attar is a fragrant journey into the heart of flowers and spices. (Korean)",
  "العطر هو سيمفونية من الروائح تعزف على الحواس. - Perfume is a symphony of aromas that plays on the senses. (Arabic)",
  "Attar 响应古老的传统，展现了自然本质的美丽。 - Attar speaks of ancient traditions and the beauty of nature’s essence. (Chinese)",
  "العطر يضفي لمسة أخيرة على الأناقة—تفصيل غير مرئي يكمل شخصية الرجل أو المرأة. - Perfume puts the finishing touch to elegance—a detail that subtly underscores the look, an invisible extra that completes a man's or woman's personality. (Arabic)",
  "Attar είναι η ποίηση της γης, αποσταγμένη σε μία σταγόνα. - Attar is the poetry of the earth, distilled into a single drop. (Greek)",
  "العطر هو طريقة لإيقاف الزمن. تشم رائحة معينة وتتذكر كل شيء. - Perfume is a way of stopping time. You smell a certain scent and you remember everything. (Arabic)",
  "Attar è un legame senza χρόνο με τη γη, που περιλαμβάνει την ουσία της φύσης σε κάθε σταγόνα. - Attar is a timeless connection to the earth, embodying the essence of nature in every drop. (Italian)",
  "العطر هو المفتاح لذكرياتنا، لمحة من العطر يمكن أن تأخذك سنوات إلى الوراء. - Perfume is the key to our memories, a hint of scent can take you back years. (Arabic)",
  "Attar шепчет на языке цветов и природы. - Attar whispers the language of flowers and nature. (Russian)",
  "العطر هو الشكل الأكثر كثافة للذاكرة. - Perfume is the most intense form of memory. (Arabic)",
  "Attar es la fragancia de la tradición, que lleva la esencia de la pureza. - Attar is the fragrance of tradition, carrying the essence of purity. (Spanish)",
  "عطر المرأة يقول عنها أكثر مما يقوله خط يدها. - A woman’s perfume tells more about her than her handwriting. (Arabic)",
  "Le parfum est l'art qui fait parler la mémoire. - Perfume is the art that makes memory speak. (French)",
];

export const Home = () => {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  const handleCategoryClick = (categoryName) => {
    navigate(`/category/${categoryName}`);
  };

  useEffect(() => {
    const fetchCategories = async () => {
      const { data } = await axios.get(
        "http://13.61.189.197:8000/api/v1/user/category"
      );
      setCategories(data.categories);
    };
    fetchCategories();
  }, []);

  return (
    <div className="baritems">
      {/* <div className="setFlex">
        <span>Welcome to </span>
        <h1 style={{ margin: "8px" }}>
          Saliheen Perfumes<span className="noise"></span>
        </h1>
      </div> */}

      {/* Image Carousel */}
      <Carousel
        className="image-carousel"
        interval={1500}
        autoFocus={false}
        showIndicators={false}
        showStatus={false}
        swipeable={false}
        showThumbs={false}
        showArrows={false}
        autoPlay
        infiniteLoop
        stopOnHover={false}
        centerMode={true}
      >
        {images.map((image, index) => {
          const fileName = image.split("/").pop().split(".")[0];
          return (
            <div key={index}>
              <img
                src={image}
                alt={`Image ${index + 1}`}
                style={{ objectFit: "cover" }}
              />
              <p className="legend carousel-legend">{fileName}</p>
            </div>
          );
        })}
      </Carousel>

      <Divider />

      {/* Categories Section */}
      <h2 className="heading">Shop By Category</h2>
      <div className="categories-container">
        {categories.map((category, index) => (
          <div
            onClick={() => handleCategoryClick(category.name)}
            key={category._id}
            className="category-card"
          >
            <img
              src={imagesCat[index]} // Replace with actual image paths
              alt={category.name}
              className="category-image"
            />
            <div className="category-info">
              <h3>{category.name}</h3>
            </div>
          </div>
        ))}
      </div>

      <Divider />

      {/* Quotes Carousel */}
      <Carousel
        className="quote-carousel"
        autoFocus={false}
        showIndicators={false}
        showStatus={false}
        swipeable={false}
        showThumbs={false}
        showArrows={false}
        autoPlay
        infiniteLoop
      >
        {quotes.map((quote, index) => {
          let otherLang = quote.split("-")[0];
          let englishLang = quote.split("-")[1];
          return (
            <div
              key={index}
              style={{
                textAlign: "center",
                backgroundColor: "black",
                borderRadius: "10px",
                padding: "10px",
              }}
            >
              <h1 style={{ fontSize: "20px", fontStyle: "italic" }}>
                {otherLang}
              </h1>
              <h1 style={{ fontSize: "15px", fontStyle: "italic" }}>
                {englishLang}
              </h1>
            </div>
          );
        })}
      </Carousel>

      <Divider />
      <AttarOudhHistory />
      <Divider />
      <iframe
        width="99%"
        height="50%"
        src="https://www.youtube.com/embed/fNc2gD-GJFI?autoplay=1&mute=1&controls=0&rel=0&modestbranding=1"
        title="Saliheen Offline"
        frameBorder="0"
        allow="accelerometer; autoplay; encrypted-media; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen={false}
      ></iframe>
      <Divider />
      <PerfumeProcess />

      <style jsx>{`
        .heading {
          font-size: 2rem;
          font-weight: bold;
          text-align: center;
          margin-top: 20px;
          color: #ffd700;
        }
        .categories-container {
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          gap: 20px;
          margin: 20px 0;
        }
        .category-card {
          background-color: #000;
          color: #e1b453;
          border: 1px solid #e1b453;
          border-radius: 10px;
          overflow: hidden;
          width: 200px;
          text-align: center;
          transition: transform 0.3s;
          cursor: pointer;
        }
        .category-card:hover {
          transform: scale(1.05);
        }
        .category-image {
          width: 100%;
          height: 150px;
          object-fit: cover;
        }
        .category-info {
          padding: 10px;
        }
        .slick-prev:before,
        .slick-next:before {
          color: #ffd700;
        }
      `}</style>
    </div>
  );
};

export default Home;
