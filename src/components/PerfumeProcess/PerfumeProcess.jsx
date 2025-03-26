import React from "react";
import { useSpring, animated } from "react-spring";
import "./PerfumeProcess.scss"; // Custom styling for the component

// Image imports
import step1Image from "../../assets/attarprocess/step1.jpg";
import extractionImage from "../../assets/attarprocess/step2.jpg";
import blendingImage from "../../assets/attarprocess/step3.jpg";
import agingImage from "../../assets/attarprocess/step4.jpg";
import bottlingImage from "../../assets/attarprocess/step5.jpg";
import { Divider } from "semantic-ui-react";

const PerfumeProcess = () => {
  // Animation for smooth transitions
  const fadeIn = useSpring({
    opacity: 1,
    from: { opacity: 0 },
    config: { duration: 1000 },
  });

  return (
    <div className="perfume-process-container">
      {/* Title Section */}
      <animated.div style={fadeIn} className="title-section">
        <h1 style={{ fontSize: "25px" }}>How Perfume is Made from Attar</h1>
        <p>
          The art of crafting perfumes from natural attar is a delicate process,
          combining centuries-old techniques and modern refinement.
        </p>
      </animated.div>

      {/* Step 1: Collection of Raw Materials */}
      <div className="step-section">
        <img src={step1Image} alt="Raw Materials" className="step-image" />
        <div className="step-description">
          <h2>Step 1: Collection of Raw Materials</h2>
          <p>
            Natural flowers, herbs, and spices are gathered to extract attar,
            the essence that forms the base of a perfume.
          </p>
        </div>
      </div>
      <Divider />
      {/* Step 2: Extraction Process */}
      <div className="step-section">
        <div className="step-description">
          <h2>Step 2: Extraction of Attar</h2>
          <p>
            Through a process known as distillation, the pure essence of attar
            is extracted from the raw materials. This is done using heat and
            pressure.
          </p>
        </div>
        <img
          src={extractionImage}
          alt="Extraction Process"
          className="step-image"
        />
      </div>
      <Divider />
      {/* Step 3: Blending with Oils */}
      <div className="step-section">
        <img
          src={blendingImage}
          alt="Blending Process"
          className="step-image"
        />
        <div className="step-description">
          <h2>Step 3: Blending with Carrier Oils</h2>
          <p>
            The extracted attar is blended with carrier oils to create a base
            for the perfume. Different blends create unique fragrances.
          </p>
        </div>
      </div>
      <Divider />
      {/* Step 4: Aging Process */}
      <div className="step-section">
        <div className="step-description">
          <h2>Step 4: Aging and Refinement</h2>
          <p>
            Once blended, the perfume is aged to allow the fragrance to mature
            and reach its full potential. This can take weeks or even months.
          </p>
        </div>
        <img src={agingImage} alt="Aging Process" className="step-image" />
      </div>
      <Divider />
      {/* Step 5: Bottling and Packaging */}
      <div className="step-section">
        <img
          src={bottlingImage}
          alt="Bottling Process"
          className="step-image"
        />
        <div className="step-description">
          <h2>Step 5: Bottling and Packaging</h2>
          <p>
            Finally, the finished perfume is bottled and beautifully packaged,
            ready to be enjoyed.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PerfumeProcess;
