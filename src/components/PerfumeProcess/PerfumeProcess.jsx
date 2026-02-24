import React from "react";
import { useSpring, animated } from "react-spring";
import "./PerfumeProcess.scss";

import step1Image from "../../assets/attarprocess/step1.jpg";
import extractionImage from "../../assets/attarprocess/step2.jpg";
import blendingImage from "../../assets/attarprocess/step3.jpg";
import agingImage from "../../assets/attarprocess/step4.jpg";
import bottlingImage from "../../assets/attarprocess/step5.jpg";

const steps = [
  {
    num: 1,
    title: "Collection of Raw Materials",
    body: "Natural flowers, herbs, and spices are gathered to extract attar, the essence that forms the base of a perfume.",
    image: step1Image,
    alt: "Raw Materials",
  },
  {
    num: 2,
    title: "Extraction of Attar",
    body: "Through distillation, the pure essence of attar is extracted from the raw materials using heat and pressure.",
    image: extractionImage,
    alt: "Extraction Process",
  },
  {
    num: 3,
    title: "Blending with Carrier Oils",
    body: "The extracted attar is blended with carrier oils to create a base. Different blends create unique fragrances.",
    image: blendingImage,
    alt: "Blending Process",
  },
  {
    num: 4,
    title: "Aging and Refinement",
    body: "Once blended, the perfume is aged to allow the fragrance to mature and reach its full potential.",
    image: agingImage,
    alt: "Aging Process",
  },
  {
    num: 5,
    title: "Bottling and Packaging",
    body: "The finished perfume is bottled and beautifully packaged, ready to be enjoyed.",
    image: bottlingImage,
    alt: "Bottling Process",
  },
];

const PerfumeProcess = () => {
  const fadeIn = useSpring({
    opacity: 1,
    from: { opacity: 0 },
    config: { duration: 800 },
  });

  return (
    <div className="perfume-process-container">
      <animated.div style={fadeIn} className="timeline-header">
        <h1 className="timeline-title">How Perfume is Made from Attar</h1>
        <p className="timeline-subtitle">
          The art of crafting perfumes from natural attar combines centuries-old
          techniques with modern refinement.
        </p>
      </animated.div>

      <div className="timeline">
        {steps.map((step, index) => (
          <div
            key={step.num}
            className={`timeline-step ${index % 2 === 1 ? "timeline-step--alt" : ""}`}
          >
            <div className="timeline-marker">
              <span className="timeline-dot" aria-hidden="true" />
              {index < steps.length - 1 && <span className="timeline-line" />}
            </div>
            <div className="timeline-content">
              <div className="timeline-card">
                <div className="timeline-card-image-wrap">
                  <img
                    src={step.image}
                    alt={step.alt}
                    className="timeline-card-image"
                    loading="lazy"
                  />
                </div>
                <div className="timeline-card-body">
                  <span className="timeline-step-num">Step {step.num}</span>
                  <h2 className="timeline-card-title">{step.title}</h2>
                  <p className="timeline-card-text">{step.body}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PerfumeProcess;
