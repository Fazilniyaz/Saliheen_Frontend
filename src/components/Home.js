

import React, {
  useEffect,
  useState,
  Suspense,
  memo,
  useMemo,
  useRef,
  useCallback,
} from "react";
import axios from "axios";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Divider } from "semantic-ui-react";
import { ThreeDots } from "react-loader-spinner";
import { useNavigate } from "react-router-dom";
import { Wrench, Clock, RefreshCcw, Play, MapPin, Plus } from "lucide-react";
import "./Home.css";
import { useTheme } from "../context/ThemeContext";

// ImageKit URLs - Optimized carousel images with transformations
const carouselImages = [
  "https://ik.imagekit.io/thesolocompilers2025/jpeg_photos/IMG_0731%20(1).jpg?updatedAt=null&ik-s=bb8b1c7c0631d03280fb551c7457ce304a1d6397",
  "https://ik.imagekit.io/thesolocompilers2025/jpeg_photos/IMG_0727.jpg?updatedAt=null&ik-s=1e840007c3a8c5e525f3769d03f2e61d73e1d02a",
  "https://ik.imagekit.io/thesolocompilers2025/jpeg_photos/IMG_0713.jpg?updatedAt=null&ik-s=3cf3fcd2fc3e5f59bdf41352b3e87cb8bfef10b8",
  "https://ik.imagekit.io/thesolocompilers2025/jpeg_photos/IMG_0724.jpg?updatedAt=null&ik-s=372f71a5622665a5a652d1dbb98bf7d0c33c3b98",
  "https://ik.imagekit.io/thesolocompilers2025/jpeg_photos/IMG_0723.jpg?updatedAt=null&ik-s=7ae45f927879243c68a7547334cd1c2cf954d129",
  "https://ik.imagekit.io/thesolocompilers2025/jpeg_photos/IMG_0716.jpg?updatedAt=null&ik-s=415256a267698b4b7d8e10b870496c89652a9e63",
];

// Unique title and subtitle for each carousel slide
const carouselSlides = [
  {
    title: "Discover Luxury Fragrances",
    subtitle: "Timeless scents, unforgettable moments. Crafted for those who appreciate the finest.",
  },
  {
    title: "Pure Attars & Oud",
    subtitle: "Traditional oils distilled with care. Long-lasting, natural, and deeply personal.",
  },
  {
    title: "Elegance in Every Drop",
    subtitle: "From inspired blends to signature collections—find the scent that speaks to you.",
  },
  {
    title: "The Art of Perfume",
    subtitle: "Where heritage meets modernity. Premium ingredients, exceptional craftsmanship.",
  },
  {
    title: "Your Scent, Your Story",
    subtitle: "Explore our range of attars, perfumes, and custom fragrances for every occasion.",
  },
  {
    title: "Shop Saliheen Perfumes",
    subtitle: "Authentic fragrances delivered to your door. Experience the difference today.",
  },
];

// Category images from public/categories/ (inspired.jpg, custom.jpg, luxury.jpg, etc.)
const publicUrl = process.env.PUBLIC_URL || "";
const getCategoryImageUrl = (categoryName) => {
  const name = (categoryName || "").toLowerCase().trim();
  const slug = name || "inspired";
  return `${publicUrl}/categories/${slug}.jpg`;
};

// YouTube configuration
const YOUTUBE_VIDEO_ID = "fNc2gD-GJFI";
const YOUTUBE_THUMBNAIL = `https://img.youtube.com/vi/${YOUTUBE_VIDEO_ID}/maxresdefault.jpg`;

const quotes = [
  "العطر يوقظ الذكريات التي دفنتها السنين. - Perfume awakens memories buried by the years. (Arabic)",
  "Le parfum est une expression de l'amour silencieux. - Perfume is an expression of silent love. (French)",
  "العود والورد عطر الشرق وعبيره الأزلي. - Oud and rose are the perfumes of the East and its eternal fragrance. (Arabic)",
  "Das Parfum ist die Sprache, die das Herz spricht. - Perfume is the language spoken by the heart. (German)",
  "العطر هو تعبير عن الحنين ويمتد ليشمل كل ما هو جميل. - Perfume is an expression of nostalgia and extends to include all that is beautiful. (Arabic)",
  "アッタールは平和の香り、時間がゆっくり流れ、自然が咲く香りです。 - Attar is the scent of peace, of time slowing down and nature blooming. (Japanese)",
  "العطر هو رسالة سرية تُرسل من روح إلى أخرى. - Perfume is a secret message sent from one person's soul to another. (Arabic)",
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
  "Attar 响应古老的传统，展现了自然本质的美丽。 - Attar speaks of ancient traditions and the beauty of nature's essence. (Chinese)",
  "العطر يضفي لمسة أخيرة على الأناقة—تفصيل غير مرئي يكمل شخصية الرجل أو المرأة. - Perfume puts the finishing touch to elegance—a detail that subtly underscores the look, an invisible extra that completes a man's or woman's personality. (Arabic)",
  "Attar είναι η ποίηση της γης, αποσταγμένη σε μία σταγόνα. - Attar is the poetry of the earth, distilled into a single drop. (Greek)",
  "العطر هو طريقة لإيقاف الزمن. تشم رائحة معينة وتتذكر كل شيء. - Perfume is a way of stopping time. You smell a certain scent and you remember everything. (Arabic)",
  "Attar è un legame senza χρόνο με τη γη, που περιλαμβάνει την ουσία της φύσης σε κάθε σταγόνα. - Attar is a timeless connection to the earth, embodying the essence of nature in every drop. (Italian)",
  "العطر هو المفتاح لذكرياتنا، لمحة من العطر يمكن أن تأخذك سنوات إلى الوراء. - Perfume is the key to our memories, a hint of scent can take you back years. (Arabic)",
  "Attar шепчет на языке цветов и природы. - Attar whispers the language of flowers and nature. (Russian)",
  "العطر هو الشكل الأكثر كثافة للذاكرة. - Perfume is the most intense form of memory. (Arabic)",
  "Attar es la fragancia de la tradición, que lleva la esencia de la pureza. - Attar is the fragrance of tradition, carrying the essence of purity. (Spanish)",
  "عطر المرأة يقول عنها أكثر مما يقوله خط يدها. - A woman's perfume tells more about her than her handwriting. (Arabic)",
  "Le parfum est l'art qui fait parler la mémoire. - Perfume is the art that makes memory speak. (French)",
];

// Lazy load heavy components
const AttarOudhHistory = React.lazy(() =>
  import("./AttarOudhHistory/AttarOudhHistory")
);
const PerfumeProcess = React.lazy(() =>
  import("./PerfumeProcess/PerfumeProcess")
);

// ============= MEMOIZED COMPONENTS =============

const Loader = memo(() => (
  <div className="flex justify-center items-center h-screen w-full theme-bg-page">
    <ThreeDots
      height="80"
      width="80"
      radius="9"
      color="#1a1a1a"
      ariaLabel="three-dots-loading"
      visible={true}
    />
  </div>
));

const SmallLoader = memo(() => (
  <div className="text-center py-5">
    <ThreeDots
      height="40"
      width="40"
      radius="9"
      color="#1a1a1a"
      ariaLabel="three-dots-loading"
      visible={true}
    />
  </div>
));

// Category Card with shimmer loading effect
const CategoryCard = memo(({ category, onClick }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imgSrc, setImgSrc] = useState(() => getCategoryImageUrl(category.name));

  const handleImageError = () => {
    setImgSrc(carouselImages[0]);
  };

  return (
    <div onClick={onClick} className="category-card">
      <div className="category-image-container">
        {!imageLoaded && (
          <div className="shimmer-wrapper">
            <div className="shimmer"></div>
          </div>
        )}
        <img
          src={imgSrc}
          alt={category.name}
          className={`category-image ${imageLoaded ? "loaded" : ""}`}
          loading="lazy"
          decoding="async"
          onLoad={() => setImageLoaded(true)}
          onError={handleImageError}
        />
        <div className="category-overlay">
          <span className="category-overlay-text">Explore</span>
        </div>
      </div>
      <div className="category-info">
        <h3 className="category-title">{category.name}</h3>
      </div>
    </div>
  );
});

// Quote Slide Component
const QuoteSlide = memo(({ quote }) => {
  const [otherLang, englishLang] = useMemo(() => quote.split(" - "), [quote]);

  return (
    <div className="quote-slide">
      <span className="quote-mark" aria-hidden="true">"</span>
      <div className="quote-content">
        <p className="quote-primary">{otherLang}</p>
        <p className="quote-secondary">{englishLang}</p>
      </div>
    </div>
  );
});

// YouTube Player with click-to-load
const YouTubePlayer = memo(() => {
  const [showVideo, setShowVideo] = useState(false);

  const handlePlayClick = () => {
    setShowVideo(true);
  };

  if (!showVideo) {
    return (
      <div className="youtube-thumbnail-container" onClick={handlePlayClick}>
        <img
          src={YOUTUBE_THUMBNAIL}
          alt="Saliheen Perfumes Video"
          className="youtube-thumbnail"
          loading="lazy"
        />
        <button className="youtube-play-button" aria-label="Play video">
          <Play size={56} fill="#fff" />
        </button>
        <div className="youtube-overlay">
          <p>Click to Play</p>
        </div>
      </div>
    );
  }

  return (
    <div className="youtube-iframe-wrapper">
      <iframe
        width="100%"
        height="500"
        src={`https://www.youtube.com/embed/${YOUTUBE_VIDEO_ID}?autoplay=1&mute=1&controls=1&rel=0&modestbranding=1`}
        title="Saliheen Perfumes"
        frameBorder="0"
        allow="accelerometer; autoplay; encrypted-media; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
        loading="lazy"
      />
    </div>
  );
});

// ============= INTERSECTION OBSERVER HOOK =============

const useIntersectionObserver = (options = {}) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, ...options }
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [options]);

  return [ref, isIntersecting];
};

// Lazy Section Wrapper
const LazySection = memo(({ children, minHeight = "300px" }) => {
  const [ref, isVisible] = useIntersectionObserver();

  return (
    <div ref={ref} style={{ minHeight: isVisible ? "auto" : minHeight }}>
      {isVisible ? children : null}
    </div>
  );
});

// ============= MAIN HOME COMPONENT =============

export const Home = () => {
  const [categories, setCategories] = useState([]);
  const [underService, setUnderService] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { colors, isDark } = useTheme();

  const handleCategoryClick = useCallback(
    (categoryName) => {
      navigate(`/category/${categoryName}`);
    },
    [navigate]
  );

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get(
          "https://saliheenperfumes-zd2i.onrender.com/api/v1/user/category",
          { withCredentials: true }
        );
        setCategories(data.categories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  if (loading) {
    return <Loader />;
  }

  if (underService) {
    return (
      <div className="maintenance-container">
        <div className="maintenance-card">
          <div className="maintenance-icon">
            <Wrench size={70} className="text-yellow-400" />
          </div>
          <h1 className="maintenance-title">We're Under Service</h1>
          <p className="maintenance-description">
            Our website is currently undergoing scheduled maintenance to improve
            your experience. We'll be back soon. Thank you for your patience!
          </p>
          <div className="maintenance-time">
            <Clock />
            <p>Estimated downtime: Few minutes</p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="maintenance-refresh-btn"
          >
            <RefreshCcw size={18} />
            Refresh Page
          </button>
        </div>
        <footer className="maintenance-footer">
          &copy; {new Date().getFullYear()} Fazil Niyazdeen TM. All rights
          reserved.
        </footer>
      </div>
    );
  }

  return (
    <div className="home-container">
      {/* Hero Carousel */}
      <section onClick={() => navigate("/allproducts")} className="hero-section">
        <Carousel
          className="hero-carousel"
          interval={3000}
          autoFocus={false}
          showIndicators={true}
          showStatus={false}
          swipeable={true}
          showThumbs={false}
          showArrows={false}
          autoPlay
          infiniteLoop
          stopOnHover={true}
          transitionTime={600}
          renderIndicator={(onClickHandler, isSelected, index, label) => {
            const accentColor = isDark ? colors.accent : "#1a1a1a";
            const unselectedColor = isDark ? "rgba(212, 175, 55, 0.35)" : "rgba(0, 0, 0, 0.15)";
            const defStyle = {
              marginLeft: 10,
              cursor: "pointer",
              display: "inline-block",
              width: isSelected ? "28px" : "10px",
              height: "8px",
              borderRadius: "4px",
              background: isSelected ? accentColor : unselectedColor,
              transition: "all 0.3s ease",
            };
            return (
              <span
                style={defStyle}
                onClick={onClickHandler}
                onKeyDown={onClickHandler}
                value={index}
                key={index}
                role="button"
                tabIndex={0}
                aria-label={`${label} ${index + 1}`}
              />
            );
          }}
        >
          {carouselImages.map((image, index) => {
            const slide = carouselSlides[index] || carouselSlides[0];
            return (
              <div key={index} className="carousel-slide">
                <img
                  src={image}
                  alt={`Perfume Collection ${index + 1}`}
                  className="carousel-image"
                  loading={index < 2 ? "eager" : "lazy"}
                  decoding="async"
                />
                <div className="carousel-overlay">
                  <h2 className="carousel-title">{slide.title}</h2>
                  <p className="carousel-subtitle">{slide.subtitle}</p>
                </div>
              </div>
            );
          })}
        </Carousel>
      </section>

      <Divider className="section-divider" />

      <button
        type="button"
        onClick={() => navigate("/allproducts")}
        className="shop-all-btn"
      >
        Shop All
      </button>

      {/* Categories Section */}
      <section className="categories-section">
        <h2 className="section-heading">
          <span className="heading-text">Shop By Category</span>
          <div className="heading-underline"></div>
        </h2>
        <div className="categories-grid">
          {categories.map((category) => (
            <CategoryCard
              key={category._id}
              category={category}
              onClick={() => handleCategoryClick(category.name)}
            />
          ))}
        </div>
      </section>

      {/* Our Branches - Flowchart style */}
      <section className="branches-section">
        <h2 className="section-heading">
          <span className="heading-text">Our Branches</span>
          <div className="heading-underline"></div>
        </h2>
        <div className="branches-flowchart">
          <div className="branches-hub">
            <MapPin size={28} className="branches-hub-icon" />
            <span>Saliheen Perfumes</span>
          </div>
          <svg className="branches-connector" viewBox="0 0 800 80" preserveAspectRatio="none">
            <defs>
              <linearGradient id="branchGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#a2682a" stopOpacity="0.3" />
                <stop offset="50%" stopColor="#a2682a" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#a2682a" stopOpacity="0.3" />
              </linearGradient>
              <marker id="branchArrow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
                <path d="M0,0 L0,6 L9,3 z" fill="#a2682a" />
              </marker>
            </defs>
            <path d="M 40 40 Q 200 10, 400 40 T 760 40" fill="none" stroke="url(#branchGradient)" strokeWidth="2" strokeDasharray="6 4" markerEnd="url(#branchArrow)" />
          </svg>
          <div className="branches-nodes">
            <a
              href="https://www.google.com/maps/place/Saliheen+Perfumes+%231/@10.9916817,76.9620386,17z/data=!3m1!4b1!4m6!3m5!1s0x3ba85900450454a7:0x565fdbefe66e4e7f!8m2!3d10.9916817!4d76.9646135!16s%2Fg%2F11y26psvb3?entry=ttu"
              target="_blank"
              rel="noopener noreferrer"
              className="branch-node branch-node-link"
            >
              <div className="branch-node-icon-wrap">
                <MapPin size={22} />
              </div>
              <p className="branch-address">Bk Chetty Street</p>
              <p className="branch-city">Coimbatore</p>
            </a>
            <div className="branch-connector-line" aria-hidden="true"></div>
            <a
              href="https://www.google.com/maps/place/Saliheen+Perfumes+%232/@10.9914939,76.9628627,17z/data=!3m1!4b1!4m6!3m5!1s0x3ba8590046440a5d:0x8fa6299e9c37a341!8m2!3d10.9914939!4d76.9654376!16s%2Fg%2F11wttjnrh0?entry=ttu"
              target="_blank"
              rel="noopener noreferrer"
              className="branch-node branch-node-link"
            >
              <div className="branch-node-icon-wrap">
                <MapPin size={22} />
              </div>
              <p className="branch-address">Vincent Road</p>
              <p className="branch-city">Coimbatore</p>
            </a>
            <div className="branch-connector-line" aria-hidden="true"></div>
            <a
              href="https://www.google.com/maps/place/Saliheen+Perfumes+%233/@11.1014831,77.3528603,17z/data=!3m1!4b1!4m6!3m5!1s0x3ba907a0a378e37b:0x76d014aef9bd2a43!8m2!3d11.1014831!4d77.3554352!16s%2Fg%2F11yf39cb0x?entry=ttu"
              target="_blank"
              rel="noopener noreferrer"
              className="branch-node branch-node-link"
            >
              <div className="branch-node-icon-wrap">
                <MapPin size={22} />
              </div>
              <p className="branch-address">Kangeyam Cross Road</p>
              <p className="branch-city">Tirupur</p>
            </a>
            <div className="branch-connector-line branch-connector-dashed" aria-hidden="true"></div>
            <div className="branch-node branch-node-coming">
              <div className="branch-node-icon-wrap branch-coming-icon">
                <Plus size={24} />
              </div>
              <p className="branch-address branch-coming-text">More branches</p>
              <p className="branch-city branch-coming-sub">Coming soon</p>
            </div>
          </div>
        </div>
      </section>

      <Divider className="section-divider" />

      {/* Quotes Carousel */}
      <section className="quotes-section">
        <h2 className="section-heading quotes-section-heading">
          <span className="heading-text">Words on Fragrance</span>
          <div className="heading-underline"></div>
        </h2>
        <Carousel
          className="quotes-carousel"
          autoFocus={false}
          showIndicators={false}
          showStatus={false}
          swipeable={false}
          showThumbs={false}
          showArrows={false}
          autoPlay
          infiniteLoop
          interval={4000}
          transitionTime={800}
        >
          {quotes.map((quote, index) => (
            <QuoteSlide key={index} quote={quote} />
          ))}
        </Carousel>
      </section>

      <Divider className="section-divider" />

      {/* Lazy Load Attar History */}
      <LazySection minHeight="400px">
        <Suspense fallback={<SmallLoader />}>
          <AttarOudhHistory />
        </Suspense>
      </LazySection>

      <Divider className="section-divider" />

      {/* YouTube Section */}
      <section className="video-section">
        <h2 className="section-heading">
          <span className="heading-text">Experience Our Craftsmanship</span>
          <div className="heading-underline"></div>
        </h2>
        <YouTubePlayer />
      </section>

      <Divider className="section-divider" />

      {/* Lazy Load Perfume Process */}
      <LazySection minHeight="400px">
        <Suspense fallback={<SmallLoader />}>
          <PerfumeProcess />
        </Suspense>
      </LazySection>
    </div>
  );
};

export default Home;
