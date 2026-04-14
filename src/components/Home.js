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
import { ThreeDots } from "react-loader-spinner";
import { useNavigate } from "react-router-dom";
import { Wrench, Clock, RefreshCcw, Play, MapPin, Plus } from "lucide-react";
import "./Home.css";
import { useTheme } from "../context/ThemeContext";

// ─── ImageKit URLs ───────────────────────────────────────────────────────────
const carouselImages = [
  "https://ik.imagekit.io/thesolocompilers2025/jpeg_photos/IMG_0731%20(1).jpg?tr=q-80,f-webp,w-1200",
  "https://ik.imagekit.io/thesolocompilers2025/jpeg_photos/IMG_0727.jpg?tr=q-80,f-webp,w-1200",
  "https://ik.imagekit.io/thesolocompilers2025/jpeg_photos/IMG_0713.jpg?tr=q-80,f-webp,w-1200",
  "https://ik.imagekit.io/thesolocompilers2025/jpeg_photos/IMG_0724.jpg?tr=q-80,f-webp,w-1200",
  "https://ik.imagekit.io/thesolocompilers2025/jpeg_photos/IMG_0723.jpg?tr=q-80,f-webp,w-1200",
  "https://ik.imagekit.io/thesolocompilers2025/jpeg_photos/IMG_0716.jpg?tr=q-80,f-webp,w-1200",
];

const carouselSlides = [
  {
    title: "Discover Luxury Fragrances",
    subtitle:
      "Timeless scents, unforgettable moments. Crafted for those who appreciate the finest.",
    tag: "New Collection",
    image:
      "https://ik.imagekit.io/thesolocompilers2025/jpeg_photos/IMG_0731%20(1).jpg?tr=q-80,f-webp,w-600",
  },
  {
    title: "Pure Attars & Oud",
    subtitle:
      "Traditional oils distilled with care. Long-lasting, natural, and deeply personal.",
    tag: "Heritage",
    image:
      "https://ik.imagekit.io/thesolocompilers2025/jpeg_photos/IMG_0727.jpg?tr=q-80,f-webp,w-600",
  },
  {
    title: "Elegance in Every Drop",
    subtitle:
      "From inspired blends to signature collections—find the scent that speaks to you.",
    tag: "Signature",
    image:
      "https://ik.imagekit.io/thesolocompilers2025/jpeg_photos/IMG_0713.jpg?tr=q-80,f-webp,w-600",
  },
  {
    title: "The Art of Perfume",
    subtitle:
      "Where heritage meets modernity. Premium ingredients, exceptional craftsmanship.",
    tag: "Craftsmanship",
    image:
      "https://ik.imagekit.io/thesolocompilers2025/jpeg_photos/IMG_0724.jpg?tr=q-80,f-webp,w-600",
  },
  {
    title: "Your Scent, Your Story",
    subtitle:
      "Explore our range of attars, perfumes, and custom fragrances for every occasion.",
    tag: "Personal",
    image:
      "https://ik.imagekit.io/thesolocompilers2025/jpeg_photos/IMG_0723.jpg?tr=q-80,f-webp,w-600",
  },
  {
    title: "Shop Saliheen Perfumes",
    subtitle:
      "Authentic fragrances delivered to your door. Experience the difference today.",
    tag: "Exclusive",
    image:
      "https://ik.imagekit.io/thesolocompilers2025/jpeg_photos/IMG_0716.jpg?tr=q-80,f-webp,w-600",
  },
];

const publicUrl = process.env.PUBLIC_URL || "";
const getCategoryImageUrl = (categoryName) => {
  const name = (categoryName || "").toLowerCase().trim();
  const slug = name || "inspired";
  return `${publicUrl}/categories/${slug}.jpg`;
};

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
  "العطر يضفي لمسة أخيرة على الأناقة—تفصيل غير مرئي يكمل شخصية الرجل أو المرأة. - Perfume puts the finishing touch to elegance. (Arabic)",
  "Attar είναι η ποίηση της γης, αποσταγμένη σε μία σταγόνα. - Attar is the poetry of the earth, distilled into a single drop. (Greek)",
  "العطر هو طريقة لإيقاف الزمن. تشم رائحة معينة وتتذكر كل شيء. - Perfume is a way of stopping time. (Arabic)",
  "العطر هو المفتاح لذكرياتنا، لمحة من العطر يمكن أن تأخذك سنوات إلى الوراء. - Perfume is the key to our memories. (Arabic)",
  "Attar шепчет на языке цветов и природы. - Attar whispers the language of flowers and nature. (Russian)",
  "العطر هو الشكل الأكثر كثافة للذاكرة. - Perfume is the most intense form of memory. (Arabic)",
  "Attar es la fragancia de la tradición, que lleva la esencia de la pureza. - Attar is the fragrance of tradition. (Spanish)",
  "عطر المرأة يقول عنها أكثر مما يقوله خط يدها. - A woman's perfume tells more about her than her handwriting. (Arabic)",
  "Le parfum est l'art qui fait parler la mémoire. - Perfume is the art that makes memory speak. (French)",
];

// Lazy load heavy components
const AttarOudhHistory = React.lazy(
  () => import("./AttarOudhHistory/AttarOudhHistory"),
);
const PerfumeProcess = React.lazy(
  () => import("./PerfumeProcess/PerfumeProcess"),
);

// ─────────────────────────────────────────────────────────────────────────────
//  PREMIUM HERO SECTION
// ─────────────────────────────────────────────────────────────────────────────
const SLIDE_DURATION = 5500; // ms per slide
const TRANSITION_DURATION = 1000; // ms crossfade

const PremiumHero = memo(({ onExplore, isDark }) => {
  const [current, setCurrent] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [productImageError, setProductImageError] = useState(false);
  const startRef = useRef(null);

  const total = carouselImages.length;

  const goTo = useCallback(
    (idx) => {
      const safeIndex = ((idx % total) + total) % total;
      setCurrent((prevCurrent) => (prevCurrent === safeIndex ? prevCurrent : safeIndex));
      setProductImageError(false);
      setProgress(0);
      startRef.current = performance.now();
    },
    [total],
  );

  const next = useCallback(
    () => goTo((current + 1) % total),
    [goTo, current, total],
  );
  const prev_ = useCallback(
    () => goTo((current - 1 + total) % total),
    [goTo, current, total],
  );

  // Progress animation via rAF
  useEffect(() => {
    if (isPaused) return;
    let rafId;
    startRef.current = performance.now();

    const tick = (now) => {
      const elapsed = now - startRef.current;
      const pct = Math.min((elapsed / SLIDE_DURATION) * 100, 100);
      setProgress(pct);
      if (pct < 100) {
        rafId = requestAnimationFrame(tick);
      } else {
        next();
      }
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [current, isPaused, next]);

  const padded = (n) => String(n + 1).padStart(2, "0");

  return (
    <section
      className={`ph-hero${isDark ? " ph-theme-dark" : " ph-theme-light"}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onClick={onExplore}
      role="banner"
      aria-label="Hero slideshow"
    >
      {/* ── Google Fonts ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Cinzel:wght@400;500;600&family=EB+Garamond:ital,wght@0,400;0,500;1,400&display=swap');

        /* ── Hero Shell ── */
        .ph-hero {
          position: relative;
          width: 100vw;
          margin-left: calc(50% - 50vw);
          margin-right: calc(50% - 50vw);
          height: 100svh;
          min-height: 600px;
          overflow: hidden;
          background: #0a0806;
          cursor: pointer;
          font-family: 'Cormorant Garamond', Georgia, serif;
          user-select: none;
        }

        /* ── Slides ── */
        .ph-slide {
          position: absolute; inset: 0;
          transition: opacity ${TRANSITION_DURATION}ms cubic-bezier(0.4,0,0.2,1);
        }
        .ph-slide-bg {
          position: absolute; inset: 0;
          background-size: cover;
          background-position: center;
          will-change: transform;
          transform-origin: center center;
        }
        .ph-slide--active .ph-slide-bg {
          animation: ph-kenburns ${SLIDE_DURATION + TRANSITION_DURATION}ms linear forwards;
        }
        @keyframes ph-kenburns {
          from { transform: scale(1.0) translate(0, 0); }
          to   { transform: scale(1.07) translate(-0.8%, 0.4%); }
        }

        /* ── Layered Overlays ── */
        .ph-overlay-vignette {
          position: absolute; inset: 0;
          background:
            radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.55) 100%);
          pointer-events: none;
        }
        .ph-overlay-bottom {
          position: absolute; inset: 0;
          background:
            linear-gradient(to top,
              rgba(4,2,1,0.96) 0%,
              rgba(4,2,1,0.7)  18%,
              rgba(4,2,1,0.2)  42%,
              transparent      62%
            ),
            linear-gradient(to right,
              rgba(4,2,1,0.55) 0%,
              transparent      55%
            );
          pointer-events: none;
        }
        .ph-overlay-grain {
          position: absolute; inset: 0;
          opacity: 0.032;
          pointer-events: none;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E");
          background-size: 180px 180px;
        }

        /* ── Theme mapping: light=black/white, dark=black/gold ── */
        .ph-hero.ph-theme-light {
          background: #000;
        }
        .ph-hero.ph-theme-light .ph-slide-bg {
          filter: grayscale(1) contrast(1.06) brightness(0.68);
        }
        .ph-hero.ph-theme-light .ph-brand,
        .ph-hero.ph-theme-light .ph-tag,
        .ph-hero.ph-theme-light .ph-counter-current,
        .ph-hero.ph-theme-light .ph-slide-counter,
        .ph-hero.ph-theme-light .ph-scroll-text,
        .ph-hero.ph-theme-light .ph-pause-indicator,
        .ph-hero.ph-theme-light .ph-arrow,
        .ph-hero.ph-theme-light .ph-cta {
          color: rgba(255,255,255,0.9);
        }
        .ph-hero.ph-theme-light .ph-tag,
        .ph-hero.ph-theme-light .ph-cta,
        .ph-hero.ph-theme-light .ph-dot,
        .ph-hero.ph-theme-light .ph-product-image-frame {
          border-color: rgba(255,255,255,0.35);
        }
        .ph-hero.ph-theme-light .ph-dot {
          background: rgba(255,255,255,0.25);
        }
        .ph-hero.ph-theme-light .ph-dot.active {
          background: #fff;
          box-shadow: 0 0 10px rgba(255,255,255,0.4);
        }
        .ph-hero.ph-theme-light .ph-counter-sep {
          background: rgba(255,255,255,0.4);
        }
        .ph-hero.ph-theme-light .ph-left-line,
        .ph-hero.ph-theme-light .ph-scroll-line {
          background: linear-gradient(to bottom, transparent, rgba(255,255,255,0.45), transparent);
        }
        .ph-hero.ph-theme-light .ph-title {
          color: #fff;
          text-shadow: 0 2px 26px rgba(0,0,0,0.65);
        }
        .ph-hero.ph-theme-light .ph-subtitle {
          color: rgba(255,255,255,0.78);
        }
        .ph-hero.ph-theme-light .ph-cta::before {
          background: #fff;
        }
        .ph-hero.ph-theme-light .ph-cta:hover {
          color: #000;
          border-color: #fff;
        }
        .ph-hero.ph-theme-light .ph-progress-fill {
          background: linear-gradient(90deg, rgba(255,255,255,0.45), rgba(255,255,255,0.95));
          box-shadow: 0 0 8px rgba(255,255,255,0.35);
        }
        .ph-hero.ph-theme-light .ph-product-image {
          filter: grayscale(1);
          box-shadow:
            0 20px 60px rgba(0, 0, 0, 0.7),
            0 0 28px rgba(255, 255, 255, 0.12);
        }
        .ph-hero.ph-theme-light .ph-product-image-frame {
          background: linear-gradient(135deg, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0.06) 50%, rgba(255,255,255,0.14) 100%);
        }
        .ph-hero.ph-theme-light .ph-product-image-shine {
          background: linear-gradient(135deg, transparent 0%, rgba(255,255,255,0.08) 50%, transparent 100%);
        }
        .ph-hero.ph-theme-light .ph-ornament circle,
        .ph-hero.ph-theme-light .ph-ornament line {
          stroke: rgba(255,255,255,0.5);
        }
        .ph-hero.ph-theme-light .ph-ornament circle[fill] {
          fill: rgba(255,255,255,0.75);
        }

        /* ── Top Bar ── */
        .ph-topbar {
          position: absolute; top: 0; left: 0; right: 0;
          display: flex; align-items: center; justify-content: space-between;
          padding: 28px 48px;
          z-index: 20;
          animation: ph-fade-down 1s ease 0.3s both;
        }
        @keyframes ph-fade-down {
          from { opacity: 0; transform: translateY(-16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .ph-brand {
          font-family: 'Cinzel', serif;
          font-size: clamp(0.85rem, 1.2vw, 1.1rem);
          font-weight: 500;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          color: #c9a96e;
          text-shadow: 0 1px 12px rgba(0,0,0,0.5);
        }
        .ph-slide-counter {
          font-family: 'EB Garamond', Georgia, serif;
          font-size: clamp(0.72rem, 1vw, 0.88rem);
          letter-spacing: 0.2em;
          color: rgba(201,169,110,0.75);
          display: flex; align-items: center; gap: 8px;
        }
        .ph-counter-current {
          font-size: clamp(0.9rem, 1.4vw, 1.1rem);
          color: #c9a96e;
          font-weight: 500;
        }
        .ph-counter-sep {
          width: 24px; height: 1px;
          background: rgba(201,169,110,0.4);
          display: inline-block;
        }

        /* ── Left Ornament Column ── */
        .ph-left-col {
          position: absolute; left: 48px; top: 50%; transform: translateY(-50%);
          display: flex; flex-direction: column; align-items: center; gap: 14px;
          z-index: 20;
          animation: ph-fade-left 1s ease 0.5s both;
        }
        @keyframes ph-fade-left {
          from { opacity: 0; transform: translateY(-50%) translateX(-12px); }
          to   { opacity: 1; transform: translateY(-50%) translateX(0); }
        }
        .ph-left-line {
          width: 1px; height: 80px;
          background: linear-gradient(to bottom, transparent, rgba(201,169,110,0.6), transparent);
        }
        .ph-dot-nav {
          display: flex; flex-direction: column; gap: 10px;
          align-items: center;
        }
        .ph-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: rgba(201,169,110,0.3);
          border: 1px solid rgba(201,169,110,0.4);
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
        }
        .ph-dot::after {
          content: "";
          position: absolute; inset: -4px;
          border-radius: 50%;
          border: 1px solid transparent;
          transition: border-color 0.3s ease;
        }
        .ph-dot.active {
          background: #c9a96e;
          transform: scale(1.4);
          box-shadow: 0 0 10px rgba(201,169,110,0.5);
        }
        .ph-dot.active::after { border-color: rgba(201,169,110,0.3); }
        .ph-dot:hover:not(.active) { background: rgba(201,169,110,0.65); }

        /* ── Main Content ── */
        .ph-content {
          position: absolute;
          bottom: 0; left: 0; right: 0;
          padding: 0 48px 120px 140px;
          z-index: 20;
          max-width: 1200px;
          width: min(1200px, calc(100% - 420px));
        }
        .ph-tag {
          display: inline-block;
          font-family: 'Cinzel', serif;
          font-size: clamp(0.55rem, 0.8vw, 0.7rem);
          letter-spacing: 0.35em;
          text-transform: uppercase;
          color: #c9a96e;
          border: 1px solid rgba(201,169,110,0.45);
          padding: 5px 14px;
          margin-bottom: 22px;
          border-radius: 1px;
          opacity: 0;
          animation: ph-word-in 0.7s cubic-bezier(0.22,1,0.36,1) 0.1s forwards;
        }
        .ph-title {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: clamp(2.6rem, 6vw, 5.8rem);
          font-weight: 300;
          line-height: 1.08;
          color: #f5ede0;
          margin: 0 0 22px;
          letter-spacing: -0.01em;
          text-shadow: 0 2px 30px rgba(0,0,0,0.4);
          opacity: 0;
          animation: ph-fade-up 0.9s cubic-bezier(0.22,1,0.36,1) 0.2s forwards;
        }
        @keyframes ph-word-in {
          from { opacity: 0; transform: translateX(-12px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        .ph-subtitle {
          font-family: 'EB Garamond', Georgia, serif;
          font-size: clamp(1rem, 1.8vw, 1.35rem);
          font-weight: 400;
          color: rgba(245,237,224,0.7);
          line-height: 1.65;
          max-width: 480px;
          margin-bottom: 36px;
          opacity: 0;
          animation: ph-fade-up 0.9s cubic-bezier(0.22,1,0.36,1) 0.5s forwards;
        }
        @keyframes ph-fade-up {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* ── CTA Button ── */
        .ph-cta {
          display: inline-flex; align-items: center; gap: 14px;
          padding: 14px 32px;
          border: 1px solid rgba(201,169,110,0.6);
          background: transparent;
          color: #c9a96e;
          font-family: 'Cinzel', serif;
          font-size: clamp(0.6rem, 0.9vw, 0.78rem);
          font-weight: 500;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          cursor: pointer;
          position: relative; overflow: hidden;
          opacity: 0;
          animation: ph-fade-up 0.9s cubic-bezier(0.22,1,0.36,1) 0.7s forwards;
          transition: color 0.35s ease, border-color 0.35s ease;
        }
        .ph-cta::before {
          content: "";
          position: absolute; inset: 0;
          background: #c9a96e;
          transform: scaleX(0); transform-origin: left;
          transition: transform 0.4s cubic-bezier(0.22,1,0.36,1);
          z-index: 0;
        }
        .ph-cta:hover { color: #0a0806; border-color: #c9a96e; }
        .ph-cta:hover::before { transform: scaleX(1); }
        .ph-cta-text, .ph-cta-arrow { position: relative; z-index: 1; }
        .ph-cta-arrow {
          width: 22px; height: 1px;
          background: currentColor;
          display: inline-block;
          position: relative; z-index: 1;
          transition: width 0.3s ease;
        }
        .ph-cta-arrow::after {
          content: "";
          position: absolute; right: 0; top: -3px;
          width: 7px; height: 7px;
          border-right: 1px solid currentColor;
          border-top: 1px solid currentColor;
          transform: rotate(45deg);
        }
        .ph-cta:hover .ph-cta-arrow { width: 32px; }

        /* ── Nav Arrows ── */
        .ph-arrow {
          position: absolute; top: 50%; z-index: 20;
          transform: translateY(-50%);
          background: none; border: none;
          cursor: pointer; padding: 12px;
          color: rgba(201,169,110,0.55);
          transition: color 0.2s ease, transform 0.2s ease;
          line-height: 1;
        }
        .ph-arrow:hover { color: #c9a96e; }
        .ph-arrow-prev { right: 80px; }
        .ph-arrow-prev:hover { transform: translateY(-50%) translateX(-2px); }
        .ph-arrow-next { right: 40px; }
        .ph-arrow-next:hover { transform: translateY(-50%) translateX(2px); }
        .ph-arrow svg { display: block; }

        /* ── Progress Bar ── */
        .ph-progress-track {
          position: absolute; bottom: 0; left: 0; right: 0;
          height: 2px;
          background: rgba(255,255,255,0.06);
          z-index: 30;
        }
        .ph-progress-fill {
          height: 100%;
          background: linear-gradient(90deg, rgba(201,169,110,0.4), #c9a96e);
          transform-origin: left;
          transition: width 0.05s linear;
          box-shadow: 0 0 8px rgba(201,169,110,0.4);
        }

        /* ── Scroll Indicator ── */
        .ph-scroll-hint {
          position: absolute; bottom: 32px; left: 50%;
          transform: translateX(-50%);
          z-index: 20;
          display: flex; flex-direction: column; align-items: center; gap: 6px;
          opacity: 0;
          animation: ph-fade-up 1s ease 1.2s forwards;
          pointer-events: none;
        }
        .ph-scroll-text {
          font-family: 'Cinzel', serif;
          font-size: 0.52rem;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: rgba(201,169,110,0.5);
        }
        .ph-scroll-line {
          width: 1px; height: 36px;
          background: linear-gradient(to bottom, rgba(201,169,110,0.5), transparent);
          animation: ph-scroll-pulse 2s ease-in-out infinite;
        }
        @keyframes ph-scroll-pulse {
          0%, 100% { transform: scaleY(1); opacity: 0.5; }
          50%       { transform: scaleY(0.5); opacity: 1; }
        }

        /* ── Pause indicator ── */
        .ph-pause-indicator {
          position: absolute; top: 28px; right: 50%;
          transform: translateX(50%);
          z-index: 25;
          font-family: 'Cinzel', serif;
          font-size: 0.52rem;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: rgba(201,169,110,0.6);
          opacity: 0;
          transition: opacity 0.3s ease;
          pointer-events: none;
        }
        .ph-hero:hover .ph-pause-indicator { opacity: 1; }

        /* ── Decorative gold ornament ── */
        .ph-ornament {
          position: absolute; top: 50%; right: 80px;
          transform: translateY(-50%);
          z-index: 10;
          opacity: 0.07;
          pointer-events: none;
          animation: ph-ornament-rotate 60s linear infinite;
        }
        @keyframes ph-ornament-rotate {
          from { transform: translateY(-50%) rotate(0deg); }
          to   { transform: translateY(-50%) rotate(360deg); }
        }

        /* ── Responsive ── */
        @media (max-width: 1024px) {
          .ph-content { padding: 0 48px 100px 120px; }
          .ph-left-col { left: 28px; }
          .ph-topbar { padding: 22px 28px; }
          .ph-left-line { height: 50px; }
          .ph-arrow-prev { right: 60px; }
          .ph-arrow-next { right: 24px; }
        }
        @media (max-width: 900px) {
          .ph-content { padding: 0 28px 100px 88px; }
          .ph-left-col { left: 28px; }
          .ph-topbar { padding: 22px 28px; }
          .ph-left-line { height: 50px; }
          .ph-arrow-prev { right: 56px; }
          .ph-arrow-next { right: 20px; }
        }
        @media (max-width: 600px) {
          .ph-content { padding: 0 20px 90px 20px; max-width: 100%; }
          .ph-left-col { display: none; }
          .ph-topbar { padding: 18px 20px; }
          .ph-ornament { display: none; }
          .ph-arrow-prev { right: 52px; }
          .ph-arrow-next { right: 16px; }
          .ph-cta { padding: 12px 22px; }
        }
        @media (max-width: 380px) {
          .ph-title { font-size: 2.2rem; }
          .ph-subtitle { font-size: 0.95rem; }
        }

        /* ── Product Image Display ── */
        .ph-product-image-container {
          position: absolute;
          right: 48px;
          top: 50%;
          transform: translateY(-50%);
          z-index: 15;
          width: 320px;
          height: 420px;
          perspective: 1200px;
          animation: ph-image-in 1s ease 0.3s both;
        }
        @keyframes ph-image-in {
          from {
            opacity: 0;
            transform: translateY(-50%) translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateY(-50%) translateX(0);
          }
        }

        .ph-product-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 8px;
          box-shadow: 
            0 20px 60px rgba(0, 0, 0, 0.6),
            0 0 40px rgba(201, 169, 110, 0.2),
            inset 0 0 30px rgba(201, 169, 110, 0.05);
          transition: transform 1s cubic-bezier(0.22, 1, 0.36, 1), 
                      filter 0.6s ease;
          will-change: transform;
          animation: ph-image-float 6s ease-in-out infinite;
        }
        @keyframes ph-image-float {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-8px) scale(1.02); }
        }

        .ph-product-image-frame {
          position: absolute;
          inset: -12px;
          background: linear-gradient(135deg, 
            rgba(201, 169, 110, 0.3) 0%, 
            rgba(201, 169, 110, 0.1) 50%, 
            rgba(201, 169, 110, 0.2) 100%);
          border: 1px solid rgba(201, 169, 110, 0.3);
          border-radius: 12px;
          pointer-events: none;
          z-index: -1;
          animation: ph-frame-glow 3s ease-in-out infinite;
        }
        @keyframes ph-frame-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(201, 169, 110, 0.2); }
          50% { box-shadow: 0 0 40px rgba(201, 169, 110, 0.4); }
        }

        .ph-product-image-shine {
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg,
            transparent 0%,
            rgba(255, 255, 255, 0.1) 50%,
            transparent 100%);
          border-radius: 8px;
          pointer-events: none;
          z-index: 2;
        }

        /* ── Responsive adjustments for product image ── */
        @media (max-width: 1200px) {
          .ph-content {
            width: min(900px, calc(100% - 340px));
          }
          .ph-product-image-container {
            width: 260px;
            height: 340px;
            right: 32px;
          }
        }
        @media (max-width: 900px) {
          .ph-content {
            width: auto;
          }
          .ph-product-image-container {
            display: none;
          }
        }
      `}</style>

      {/* ── Active slide ── */}
      {carouselImages.map((img, i) => {
        const isActive = i === current;
        if (!isActive) return null;
        return (
          <div
            key={i}
            className={`ph-slide${isActive ? " ph-slide--active" : ""}`}
            style={{ opacity: 1, zIndex: 2 }}
          >
            <div
              className="ph-slide-bg"
              style={{ backgroundImage: `url(${img})` }}
            />
          </div>
        );
      })}

      {/* ── Overlays ── */}
      <div className="ph-overlay-vignette" style={{ zIndex: 3 }} />
      <div className="ph-overlay-bottom" style={{ zIndex: 4 }} />
      <div className="ph-overlay-grain" style={{ zIndex: 5 }} />

      {/* ── Rotating Ornament SVG ── */}
      <svg
        className="ph-ornament"
        width="320"
        height="320"
        viewBox="0 0 320 320"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ zIndex: 6 }}
      >
        <circle
          cx="160"
          cy="160"
          r="140"
          stroke="#c9a96e"
          strokeWidth="0.5"
          strokeDasharray="4 6"
        />
        <circle
          cx="160"
          cy="160"
          r="110"
          stroke="#c9a96e"
          strokeWidth="0.3"
          strokeDasharray="2 8"
        />
        <circle cx="160" cy="160" r="4" fill="#c9a96e" />
        {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => {
          const rad = (deg * Math.PI) / 180;
          const x1 = 160 + 115 * Math.cos(rad);
          const y1 = 160 + 115 * Math.sin(rad);
          const x2 = 160 + 138 * Math.cos(rad);
          const y2 = 160 + 138 * Math.sin(rad);
          return (
            <line
              key={deg}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="#c9a96e"
              strokeWidth="0.5"
            />
          );
        })}
        {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => {
          const rad = (deg * Math.PI) / 180;
          const cx = 160 + 140 * Math.cos(rad);
          const cy = 160 + 140 * Math.sin(rad);
          return <circle key={deg} cx={cx} cy={cy} r="2" fill="#c9a96e" />;
        })}
      </svg>

      {/* ── Top Bar ── */}
      <div className="ph-topbar" style={{ zIndex: 20 }}>
        <div className="ph-brand">Saliheen Perfumes</div>
        <div className="ph-slide-counter">
          <span className="ph-counter-current">{padded(current)}</span>
          <span className="ph-counter-sep" />
          <span>{padded(total - 1)}</span>
        </div>
      </div>

      {/* ── Left Ornament Column ── */}
      <div className="ph-left-col" style={{ zIndex: 20 }}>
        <div className="ph-left-line" />
        <div className="ph-dot-nav">
          {carouselImages.map((_, i) => (
            <button
              key={i}
              className={`ph-dot${i === current ? " active" : ""}`}
              onClick={(e) => {
                e.stopPropagation();
                goTo(i);
              }}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
        <div className="ph-left-line" />
      </div>

      {/* ── Main Content (re-mounts on slide change for text animation) ── */}
      <div className="ph-content" key={current} style={{ zIndex: 20 }}>
        {/* Tag */}
        <div className="ph-tag">{carouselSlides[current].tag}</div>

        {/* Title — split into words with staggered animation */}
        <h1 className="ph-title">{carouselSlides[current].title}</h1>

        {/* Subtitle */}
        <p className="ph-subtitle">{carouselSlides[current].subtitle}</p>

        {/* CTA */}
        <button
          className="ph-cta"
          onClick={(e) => {
            e.stopPropagation();
            onExplore();
          }}
        >
          <span className="ph-cta-text">Explore Collection</span>
          <span className="ph-cta-arrow" />
        </button>
      </div>

      {/* ── Product Image Display ── */}
      <div
        className="ph-product-image-container"
        key={`product-${current}`}
        style={{ zIndex: 15 }}
      >
        <img
          src={productImageError ? carouselImages[current] : carouselSlides[current].image}
          alt={carouselSlides[current].title}
          className="ph-product-image"
          loading="lazy"
          decoding="async"
          onError={() => setProductImageError(true)}
        />
        <div className="ph-product-image-shine" />
        <div className="ph-product-image-frame" />
      </div>

      {/* ── Prev / Next arrows ── */}
      <button
        className="ph-arrow ph-arrow-prev"
        style={{ zIndex: 20 }}
        onClick={(e) => {
          e.stopPropagation();
          prev_();
        }}
        aria-label="Previous slide"
      >
        <svg width="18" height="28" viewBox="0 0 18 28" fill="none">
          <path
            d="M14 4L4 14L14 24"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      <button
        className="ph-arrow ph-arrow-next"
        style={{ zIndex: 20 }}
        onClick={(e) => {
          e.stopPropagation();
          next();
        }}
        aria-label="Next slide"
      >
        <svg width="18" height="28" viewBox="0 0 18 28" fill="none">
          <path
            d="M4 4L14 14L4 24"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {/* ── Progress Bar ── */}
      <div className="ph-progress-track" style={{ zIndex: 30 }}>
        <div className="ph-progress-fill" style={{ width: `${progress}%` }} />
      </div>

      {/* ── Pause indicator ── */}
      <div className="ph-pause-indicator" style={{ zIndex: 20 }}>
        ⏸ &nbsp; Paused
      </div>

      {/* ── Scroll hint ── */}
      <div className="ph-scroll-hint" style={{ zIndex: 20 }}>
        <span className="ph-scroll-text">Scroll</span>
        <span className="ph-scroll-line" />
      </div>
    </section>
  );
});

// ─────────────────────────────────────────────────────────────────────────────
//  EXISTING MEMOIZED COMPONENTS (unchanged)
// ─────────────────────────────────────────────────────────────────────────────

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

const CategoryCard = memo(({ category, onClick }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imgSrc, setImgSrc] = useState(() =>
    getCategoryImageUrl(category.name),
  );
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

const QuoteSlide = memo(({ quote }) => {
  const [otherLang, englishLang] = useMemo(() => quote.split(" - "), [quote]);
  return (
    <div className="quote-slide">
      <span className="quote-mark" aria-hidden="true">
        "
      </span>
      <div className="quote-content">
        <p className="quote-primary">{otherLang}</p>
        <p className="quote-secondary">{englishLang}</p>
      </div>
    </div>
  );
});

const YouTubePlayer = memo(() => {
  const [showVideo, setShowVideo] = useState(false);
  if (!showVideo) {
    return (
      <div
        className="youtube-thumbnail-container"
        onClick={() => setShowVideo(true)}
      >
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
      { threshold: 0.1, ...options },
    );
    const currentRef = ref.current;
    if (currentRef) observer.observe(currentRef);
    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, [options]);
  return [ref, isIntersecting];
};

const LazySection = memo(({ children, minHeight = "300px" }) => {
  const [ref, isVisible] = useIntersectionObserver();
  return (
    <div ref={ref} style={{ minHeight: isVisible ? "auto" : minHeight }}>
      {isVisible ? children : null}
    </div>
  );
});

// ─────────────────────────────────────────────────────────────────────────────
//  MAIN HOME COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

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
    [navigate],
  );

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get(
          "https://saliheenperfumes-zd2i.onrender.com/api/v1/user/category",
          { withCredentials: true },
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
            <RefreshCcw size={18} /> Refresh Page
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
    <>
      {/* ══ PREMIUM HERO — Edge-to-edge, outside container ══ */}
      <PremiumHero onExplore={() => navigate("/allproducts")} isDark={isDark} />

      <div className="home-container">
        <hr className="section-divider" />

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
          {loading ? (
            <SmallLoader />
          ) : (
            <div className="categories-grid">
              {categories.map((category) => (
                <CategoryCard
                  key={category._id}
                  category={category}
                  onClick={() => handleCategoryClick(category.name)}
                />
              ))}
            </div>
          )}
        </section>

        {/* Our Branches */}
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
            <svg
              className="branches-connector"
              viewBox="0 0 800 80"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient
                  id="branchGradient"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="0%"
                >
                  <stop offset="0%" stopColor="#a2682a" stopOpacity="0.3" />
                  <stop offset="50%" stopColor="#a2682a" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#a2682a" stopOpacity="0.3" />
                </linearGradient>
                <marker
                  id="branchArrow"
                  markerWidth="10"
                  markerHeight="10"
                  refX="9"
                  refY="3"
                  orient="auto"
                >
                  <path d="M0,0 L0,6 L9,3 z" fill="#a2682a" />
                </marker>
              </defs>
              <path
                d="M 40 40 Q 200 10, 400 40 T 760 40"
                fill="none"
                stroke="url(#branchGradient)"
                strokeWidth="2"
                strokeDasharray="6 4"
                markerEnd="url(#branchArrow)"
              />
            </svg>
            <div className="branches-nodes">
              <a
                href="https://www.google.com/maps/place/Saliheen+Perfumes+%231/@10.9916817,76.9620386,17z"
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
                href="https://www.google.com/maps/place/Saliheen+Perfumes+%232/@10.9914939,76.9628627,17z"
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
                href="https://www.google.com/maps/place/Saliheen+Perfumes+%233/@11.1014831,77.3528603,17z"
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
              <div
                className="branch-connector-line branch-connector-dashed"
                aria-hidden="true"
              ></div>
              <div className="branch-node branch-node-coming">
                <div className="branch-node-icon-wrap branch-coming-icon">
                  <Plus size={24} />
                </div>
                <p className="branch-address branch-coming-text">
                  More branches
                </p>
                <p className="branch-city branch-coming-sub">Coming soon</p>
              </div>
            </div>
          </div>
        </section>

        <hr className="section-divider" />

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

        <hr className="section-divider" />

        {/* Lazy Load Attar History */}
        <LazySection minHeight="400px">
          <Suspense fallback={<SmallLoader />}>
            <AttarOudhHistory />
          </Suspense>
        </LazySection>

        <hr className="section-divider" />

        {/* YouTube Section */}
        <section className="video-section">
          <h2 className="section-heading">
            <span className="heading-text">Experience Our Craftsmanship</span>
            <div className="heading-underline"></div>
          </h2>
          <YouTubePlayer />
        </section>

        <hr className="section-divider" />

        {/* Lazy Load Perfume Process */}
        <LazySection minHeight="400px">
          <Suspense fallback={<SmallLoader />}>
            <PerfumeProcess />
          </Suspense>
        </LazySection>
      </div>
    </>
  );
};

export default Home;

// import React, {
//   useEffect,
//   useState,
//   Suspense,
//   memo,
//   useMemo,
//   useRef,
//   useCallback,
// } from "react";
// import axios from "axios";
// import { Carousel } from "react-responsive-carousel";
// import "react-responsive-carousel/lib/styles/carousel.min.css";
// import { ThreeDots } from "react-loader-spinner";
// import { useNavigate } from "react-router-dom";
// import { Wrench, Clock, RefreshCcw, Play, MapPin, Plus } from "lucide-react";
// import "./Home.css";
// import { useTheme } from "../context/ThemeContext";

// // ImageKit URLs - Optimized carousel images with transformations
// const carouselImages = [
//   "https://ik.imagekit.io/thesolocompilers2025/jpeg_photos/IMG_0731%20(1).jpg?tr=q-80,f-webp,w-1200",
//   "https://ik.imagekit.io/thesolocompilers2025/jpeg_photos/IMG_0727.jpg?tr=q-80,f-webp,w-1200",
//   "https://ik.imagekit.io/thesolocompilers2025/jpeg_photos/IMG_0713.jpg?tr=q-80,f-webp,w-1200",
//   "https://ik.imagekit.io/thesolocompilers2025/jpeg_photos/IMG_0724.jpg?tr=q-80,f-webp,w-1200",
//   "https://ik.imagekit.io/thesolocompilers2025/jpeg_photos/IMG_0723.jpg?tr=q-80,f-webp,w-1200",
//   "https://ik.imagekit.io/thesolocompilers2025/jpeg_photos/IMG_0716.jpg?tr=q-80,f-webp,w-1200",
// ];

// // Unique title and subtitle for each carousel slide
// const carouselSlides = [
//   {
//     title: "Discover Luxury Fragrances",
//     subtitle: "Timeless scents, unforgettable moments. Crafted for those who appreciate the finest.",
//   },
//   {
//     title: "Pure Attars & Oud",
//     subtitle: "Traditional oils distilled with care. Long-lasting, natural, and deeply personal.",
//   },
//   {
//     title: "Elegance in Every Drop",
//     subtitle: "From inspired blends to signature collections—find the scent that speaks to you.",
//   },
//   {
//     title: "The Art of Perfume",
//     subtitle: "Where heritage meets modernity. Premium ingredients, exceptional craftsmanship.",
//   },
//   {
//     title: "Your Scent, Your Story",
//     subtitle: "Explore our range of attars, perfumes, and custom fragrances for every occasion.",
//   },
//   {
//     title: "Shop Saliheen Perfumes",
//     subtitle: "Authentic fragrances delivered to your door. Experience the difference today.",
//   },
// ];

// // Category images from public/categories/ (inspired.jpg, custom.jpg, luxury.jpg, etc.)
// const publicUrl = process.env.PUBLIC_URL || "";
// const getCategoryImageUrl = (categoryName) => {
//   const name = (categoryName || "").toLowerCase().trim();
//   const slug = name || "inspired";
//   return `${publicUrl}/categories/${slug}.jpg`;
// };

// // YouTube configuration
// const YOUTUBE_VIDEO_ID = "fNc2gD-GJFI";
// const YOUTUBE_THUMBNAIL = `https://img.youtube.com/vi/${YOUTUBE_VIDEO_ID}/maxresdefault.jpg`;

// const quotes = [
//   "العطر يوقظ الذكريات التي دفنتها السنين. - Perfume awakens memories buried by the years. (Arabic)",
//   "Le parfum est une expression de l'amour silencieux. - Perfume is an expression of silent love. (French)",
//   "العود والورد عطر الشرق وعبيره الأزلي. - Oud and rose are the perfumes of the East and its eternal fragrance. (Arabic)",
//   "Das Parfum ist die Sprache, die das Herz spricht. - Perfume is the language spoken by the heart. (German)",
//   "العطر هو تعبير عن الحنين ويمتد ليشمل كل ما هو جميل. - Perfume is an expression of nostalgia and extends to include all that is beautiful. (Arabic)",
//   "アッタールは平和の香り、時間がゆっくり流れ、自然が咲く香りです。 - Attar is the scent of peace, of time slowing down and nature blooming. (Japanese)",
//   "العطر هو رسالة سرية تُرسل من روح إلى أخرى. - Perfume is a secret message sent from one person's soul to another. (Arabic)",
//   "Attar es una celebración de la naturaleza, pura y sin refinar. - Attar is a celebration of nature, pure and unrefined. (Spanish)",
//   "العطر هو لغة الحب، خفية وساحرة. - Perfume is a language of love, subtle and intoxicating. (Arabic)",
//   "Attar captura el espíritu de la naturaleza y lo conserva en una botella. - Attar captures the spirit of nature and preserves it in a bottle. (Spanish)",
//   "العطر هو مرآة لمشاعرنا، يكشف ما يكمن تحت السطح. - Perfume is the mirror of our emotions, it reveals what lies beneath the surface. (Arabic)",
//   "アッタールはシンプルさの香りでありながら、深みのある世界を持っています。 - Attar is the fragrance of simplicity, yet it carries a world of depth. (Japanese)",
//   "العطر هو تعبير عن الفردية، همس عن من تكون. - Perfume is an expression of individuality, a whisper of who you are. (Arabic)",
//   "Attar рассказывает истории пустынь и роз, аромат, созданный природой. - Attar tells the stories of deserts and roses, a fragrance crafted by nature. (Russian)",
//   "العطر كالتوقيع الشخصي، يترك أثراً أينما ذهبت. - Perfume is like a personal signature, leaving a trail wherever you go. (Arabic)",
//   "아타르는 꽃과 향신료의 중심으로 향기로운 여행입니다. - Attar is a fragrant journey into the heart of flowers and spices. (Korean)",
//   "العطر هو سيمفونية من الروائح تعزف على الحواس. - Perfume is a symphony of aromas that plays on the senses. (Arabic)",
//   "Attar 响应古老的传统，展现了自然本质的美丽。 - Attar speaks of ancient traditions and the beauty of nature's essence. (Chinese)",
//   "العطر يضفي لمسة أخيرة على الأناقة—تفصيل غير مرئي يكمل شخصية الرجل أو المرأة. - Perfume puts the finishing touch to elegance—a detail that subtly underscores the look, an invisible extra that completes a man's or woman's personality. (Arabic)",
//   "Attar είναι η ποίηση της γης, αποσταγμένη σε μία σταγόνα. - Attar is the poetry of the earth, distilled into a single drop. (Greek)",
//   "العطر هو طريقة لإيقاف الزمن. تشم رائحة معينة وتتذكر كل شيء. - Perfume is a way of stopping time. You smell a certain scent and you remember everything. (Arabic)",
//   "Attar è un legame senza χρόνο με τη γη, που περιλαμβάνει την ουσία της φύσης σε κάθε σταγόνα. - Attar is a timeless connection to the earth, embodying the essence of nature in every drop. (Italian)",
//   "العطر هو المفتاح لذكرياتنا، لمحة من العطر يمكن أن تأخذك سنوات إلى الوراء. - Perfume is the key to our memories, a hint of scent can take you back years. (Arabic)",
//   "Attar шепчет на языке цветов и природы. - Attar whispers the language of flowers and nature. (Russian)",
//   "العطر هو الشكل الأكثر كثافة للذاكرة. - Perfume is the most intense form of memory. (Arabic)",
//   "Attar es la fragancia de la tradición, que lleva la esencia de la pureza. - Attar is the fragrance of tradition, carrying the essence of purity. (Spanish)",
//   "عطر المرأة يقول عنها أكثر مما يقوله خط يدها. - A woman's perfume tells more about her than her handwriting. (Arabic)",
//   "Le parfum est l'art qui fait parler la mémoire. - Perfume is the art that makes memory speak. (French)",
// ];

// // Lazy load heavy components
// const AttarOudhHistory = React.lazy(() =>
//   import("./AttarOudhHistory/AttarOudhHistory")
// );
// const PerfumeProcess = React.lazy(() =>
//   import("./PerfumeProcess/PerfumeProcess")
// );

// // ============= MEMOIZED COMPONENTS =============

// const SmallLoader = memo(() => (
//   <div className="text-center py-5">
//     <ThreeDots
//       height="40"
//       width="40"
//       radius="9"
//       color="#1a1a1a"
//       ariaLabel="three-dots-loading"
//       visible={true}
//     />
//   </div>
// ));

// // Category Card with shimmer loading effect
// const CategoryCard = memo(({ category, onClick }) => {
//   const [imageLoaded, setImageLoaded] = useState(false);
//   const [imgSrc, setImgSrc] = useState(() => getCategoryImageUrl(category.name));

//   const handleImageError = () => {
//     setImgSrc(carouselImages[0]);
//   };

//   return (
//     <div onClick={onClick} className="category-card">
//       <div className="category-image-container">
//         {!imageLoaded && (
//           <div className="shimmer-wrapper">
//             <div className="shimmer"></div>
//           </div>
//         )}
//         <img
//           src={imgSrc}
//           alt={category.name}
//           className={`category-image ${imageLoaded ? "loaded" : ""}`}
//           loading="lazy"
//           decoding="async"
//           onLoad={() => setImageLoaded(true)}
//           onError={handleImageError}
//         />
//         <div className="category-overlay">
//           <span className="category-overlay-text">Explore</span>
//         </div>
//       </div>
//       <div className="category-info">
//         <h3 className="category-title">{category.name}</h3>
//       </div>
//     </div>
//   );
// });

// // Quote Slide Component
// const QuoteSlide = memo(({ quote }) => {
//   const [otherLang, englishLang] = useMemo(() => quote.split(" - "), [quote]);

//   return (
//     <div className="quote-slide">
//       <span className="quote-mark" aria-hidden="true">"</span>
//       <div className="quote-content">
//         <p className="quote-primary">{otherLang}</p>
//         <p className="quote-secondary">{englishLang}</p>
//       </div>
//     </div>
//   );
// });

// // YouTube Player with click-to-load
// const YouTubePlayer = memo(() => {
//   const [showVideo, setShowVideo] = useState(false);

//   const handlePlayClick = () => {
//     setShowVideo(true);
//   };

//   if (!showVideo) {
//     return (
//       <div className="youtube-thumbnail-container" onClick={handlePlayClick}>
//         <img
//           src={YOUTUBE_THUMBNAIL}
//           alt="Saliheen Perfumes Video"
//           className="youtube-thumbnail"
//           loading="lazy"
//         />
//         <button className="youtube-play-button" aria-label="Play video">
//           <Play size={56} fill="#fff" />
//         </button>
//         <div className="youtube-overlay">
//           <p>Click to Play</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="youtube-iframe-wrapper">
//       <iframe
//         width="100%"
//         height="500"
//         src={`https://www.youtube.com/embed/${YOUTUBE_VIDEO_ID}?autoplay=1&mute=1&controls=1&rel=0&modestbranding=1`}
//         title="Saliheen Perfumes"
//         frameBorder="0"
//         allow="accelerometer; autoplay; encrypted-media; picture-in-picture; web-share"
//         referrerPolicy="strict-origin-when-cross-origin"
//         allowFullScreen
//         loading="lazy"
//       />
//     </div>
//   );
// });

// // ============= INTERSECTION OBSERVER HOOK =============

// const useIntersectionObserver = (options = {}) => {
//   const [isIntersecting, setIsIntersecting] = useState(false);
//   const ref = useRef(null);

//   useEffect(() => {
//     const observer = new IntersectionObserver(
//       ([entry]) => {
//         if (entry.isIntersecting) {
//           setIsIntersecting(true);
//           observer.disconnect();
//         }
//       },
//       { threshold: 0.1, ...options }
//     );

//     const currentRef = ref.current;
//     if (currentRef) {
//       observer.observe(currentRef);
//     }

//     return () => {
//       if (currentRef) {
//         observer.unobserve(currentRef);
//       }
//     };
//   }, [options]);

//   return [ref, isIntersecting];
// };

// // Lazy Section Wrapper
// const LazySection = memo(({ children, minHeight = "300px" }) => {
//   const [ref, isVisible] = useIntersectionObserver();

//   return (
//     <div ref={ref} style={{ minHeight: isVisible ? "auto" : minHeight }}>
//       {isVisible ? children : null}
//     </div>
//   );
// });

// // ============= MAIN HOME COMPONENT =============

// export const Home = () => {
//   const [categories, setCategories] = useState([]);
//   const [underService, setUnderService] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();
//   const { colors, isDark } = useTheme();

//   const handleCategoryClick = useCallback(
//     (categoryName) => {
//       navigate(`/category/${categoryName}`);
//     },
//     [navigate]
//   );

//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         const { data } = await axios.get(
//           "https://saliheenperfumes-zd2i.onrender.com/api/v1/user/category",
//           { withCredentials: true }
//         );
//         setCategories(data.categories);
//       } catch (error) {
//         console.error("Error fetching categories:", error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchCategories();
//   }, []);

//   // Removed global loading block to allow fast First Contentful Paint.
//   // if (loading) {
//   //   return <Loader />;
//   // }

//   if (underService) {
//     return (
//       <div className="maintenance-container">
//         <div className="maintenance-card">
//           <div className="maintenance-icon">
//             <Wrench size={70} className="text-yellow-400" />
//           </div>
//           <h1 className="maintenance-title">We're Under Service</h1>
//           <p className="maintenance-description">
//             Our website is currently undergoing scheduled maintenance to improve
//             your experience. We'll be back soon. Thank you for your patience!
//           </p>
//           <div className="maintenance-time">
//             <Clock />
//             <p>Estimated downtime: Few minutes</p>
//           </div>
//           <button
//             onClick={() => window.location.reload()}
//             className="maintenance-refresh-btn"
//           >
//             <RefreshCcw size={18} />
//             Refresh Page
//           </button>
//         </div>
//         <footer className="maintenance-footer">
//           &copy; {new Date().getFullYear()} Fazil Niyazdeen TM. All rights
//           reserved.
//         </footer>
//       </div>
//     );
//   }

//   return (
//     <div className="home-container">
//       {/* Hero Carousel */}
//       <section onClick={() => navigate("/allproducts")} className="hero-section">
//         <Carousel
//           className="hero-carousel"
//           interval={3000}
//           autoFocus={false}
//           showIndicators={true}
//           showStatus={false}
//           swipeable={true}
//           showThumbs={false}
//           showArrows={false}
//           autoPlay
//           infiniteLoop
//           stopOnHover={true}
//           transitionTime={600}
//           renderIndicator={(onClickHandler, isSelected, index, label) => {
//             const accentColor = isDark ? colors.accent : "#1a1a1a";
//             const unselectedColor = isDark ? "rgba(212, 175, 55, 0.35)" : "rgba(0, 0, 0, 0.15)";
//             const defStyle = {
//               marginLeft: 10,
//               cursor: "pointer",
//               display: "inline-block",
//               width: isSelected ? "28px" : "10px",
//               height: "8px",
//               borderRadius: "4px",
//               background: isSelected ? accentColor : unselectedColor,
//               transition: "all 0.3s ease",
//             };
//             return (
//               <span
//                 style={defStyle}
//                 onClick={onClickHandler}
//                 onKeyDown={onClickHandler}
//                 value={index}
//                 key={index}
//                 role="button"
//                 tabIndex={0}
//                 aria-label={`${label} ${index + 1}`}
//               />
//             );
//           }}
//         >
//           {carouselImages.map((image, index) => {
//             const slide = carouselSlides[index] || carouselSlides[0];
//             return (
//               <div key={index} className="carousel-slide">
//                 <img
//                   src={image}
//                   alt={`Perfume Collection ${index + 1}`}
//                   className="carousel-image"
//                   loading={index === 0 ? "eager" : "lazy"}
//                   fetchpriority={index === 0 ? "high" : "auto"}
//                   decoding="async"
//                 />
//                 <div className="carousel-overlay">
//                   <h2 className="carousel-title">{slide.title}</h2>
//                   <p className="carousel-subtitle">{slide.subtitle}</p>
//                 </div>
//               </div>
//             );
//           })}
//         </Carousel>
//       </section>

//       <hr className="section-divider" />

//       <button
//         type="button"
//         onClick={() => navigate("/allproducts")}
//         className="shop-all-btn"
//       >
//         Shop All
//       </button>

//       {/* Categories Section */}
//       <section className="categories-section">
//         <h2 className="section-heading">
//           <span className="heading-text">Shop By Category</span>
//           <div className="heading-underline"></div>
//         </h2>
//         {loading ? (
//           <SmallLoader />
//         ) : (
//           <div className="categories-grid">
//             {categories.map((category) => (
//               <CategoryCard
//                 key={category._id}
//                 category={category}
//                 onClick={() => handleCategoryClick(category.name)}
//               />
//             ))}
//           </div>
//         )}
//       </section>

//       {/* Our Branches - Flowchart style */}
//       <section className="branches-section">
//         <h2 className="section-heading">
//           <span className="heading-text">Our Branches</span>
//           <div className="heading-underline"></div>
//         </h2>
//         <div className="branches-flowchart">
//           <div className="branches-hub">
//             <MapPin size={28} className="branches-hub-icon" />
//             <span>Saliheen Perfumes</span>
//           </div>
//           <svg className="branches-connector" viewBox="0 0 800 80" preserveAspectRatio="none">
//             <defs>
//               <linearGradient id="branchGradient" x1="0%" y1="0%" x2="100%" y2="0%">
//                 <stop offset="0%" stopColor="#a2682a" stopOpacity="0.3" />
//                 <stop offset="50%" stopColor="#a2682a" stopOpacity="0.8" />
//                 <stop offset="100%" stopColor="#a2682a" stopOpacity="0.3" />
//               </linearGradient>
//               <marker id="branchArrow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
//                 <path d="M0,0 L0,6 L9,3 z" fill="#a2682a" />
//               </marker>
//             </defs>
//             <path d="M 40 40 Q 200 10, 400 40 T 760 40" fill="none" stroke="url(#branchGradient)" strokeWidth="2" strokeDasharray="6 4" markerEnd="url(#branchArrow)" />
//           </svg>
//           <div className="branches-nodes">
//             <a
//               href="https://www.google.com/maps/place/Saliheen+Perfumes+%231/@10.9916817,76.9620386,17z/data=!3m1!4b1!4m6!3m5!1s0x3ba85900450454a7:0x565fdbefe66e4e7f!8m2!3d10.9916817!4d76.9646135!16s%2Fg%2F11y26psvb3?entry=ttu"
//               target="_blank"
//               rel="noopener noreferrer"
//               className="branch-node branch-node-link"
//             >
//               <div className="branch-node-icon-wrap">
//                 <MapPin size={22} />
//               </div>
//               <p className="branch-address">Bk Chetty Street</p>
//               <p className="branch-city">Coimbatore</p>
//             </a>
//             <div className="branch-connector-line" aria-hidden="true"></div>
//             <a
//               href="https://www.google.com/maps/place/Saliheen+Perfumes+%232/@10.9914939,76.9628627,17z/data=!3m1!4b1!4m6!3m5!1s0x3ba8590046440a5d:0x8fa6299e9c37a341!8m2!3d10.9914939!4d76.9654376!16s%2Fg%2F11wttjnrh0?entry=ttu"
//               target="_blank"
//               rel="noopener noreferrer"
//               className="branch-node branch-node-link"
//             >
//               <div className="branch-node-icon-wrap">
//                 <MapPin size={22} />
//               </div>
//               <p className="branch-address">Vincent Road</p>
//               <p className="branch-city">Coimbatore</p>
//             </a>
//             <div className="branch-connector-line" aria-hidden="true"></div>
//             <a
//               href="https://www.google.com/maps/place/Saliheen+Perfumes+%233/@11.1014831,77.3528603,17z/data=!3m1!4b1!4m6!3m5!1s0x3ba907a0a378e37b:0x76d014aef9bd2a43!8m2!3d11.1014831!4d77.3554352!16s%2Fg%2F11yf39cb0x?entry=ttu"
//               target="_blank"
//               rel="noopener noreferrer"
//               className="branch-node branch-node-link"
//             >
//               <div className="branch-node-icon-wrap">
//                 <MapPin size={22} />
//               </div>
//               <p className="branch-address">Kangeyam Cross Road</p>
//               <p className="branch-city">Tirupur</p>
//             </a>
//             <div className="branch-connector-line branch-connector-dashed" aria-hidden="true"></div>
//             <div className="branch-node branch-node-coming">
//               <div className="branch-node-icon-wrap branch-coming-icon">
//                 <Plus size={24} />
//               </div>
//               <p className="branch-address branch-coming-text">More branches</p>
//               <p className="branch-city branch-coming-sub">Coming soon</p>
//             </div>
//           </div>
//         </div>
//       </section>

//       <hr className="section-divider" />

//       {/* Quotes Carousel */}
//       <section className="quotes-section">
//         <h2 className="section-heading quotes-section-heading">
//           <span className="heading-text">Words on Fragrance</span>
//           <div className="heading-underline"></div>
//         </h2>
//         <Carousel
//           className="quotes-carousel"
//           autoFocus={false}
//           showIndicators={false}
//           showStatus={false}
//           swipeable={false}
//           showThumbs={false}
//           showArrows={false}
//           autoPlay
//           infiniteLoop
//           interval={4000}
//           transitionTime={800}
//         >
//           {quotes.map((quote, index) => (
//             <QuoteSlide key={index} quote={quote} />
//           ))}
//         </Carousel>
//       </section>

//       <hr className="section-divider" />

//       {/* Lazy Load Attar History */}
//       <LazySection minHeight="400px">
//         <Suspense fallback={<SmallLoader />}>
//           <AttarOudhHistory />
//         </Suspense>
//       </LazySection>

//       <hr className="section-divider" />

//       {/* YouTube Section */}
//       <section className="video-section">
//         <h2 className="section-heading">
//           <span className="heading-text">Experience Our Craftsmanship</span>
//           <div className="heading-underline"></div>
//         </h2>
//         <YouTubePlayer />
//       </section>

//       <hr className="section-divider" />

//       {/* Lazy Load Perfume Process */}
//       <LazySection minHeight="400px">
//         <Suspense fallback={<SmallLoader />}>
//           <PerfumeProcess />
//         </Suspense>
//       </LazySection>
//     </div>
//   );
// };

// export default Home;
