import React from 'react';

export const DecorativeCard = ({
  top = 70,
  left = 48,
  rot = 0
}) => {
  return (
    <div
      className="wall-decorative-quote-card"
      style={{
        top: `${top}%`,
        left: `${left}%`,
        transform: `translate(-50%, -50%) rotate(${rot}deg)`
      }}
    >
      <div className="quote-heart-emblem">♡</div>
      <p className="quote-text">
        Some bonds<br />
        are meant to be<br />
        celebrated forever.
      </p>

      <style>{`
        .wall-decorative-quote-card {
          position: absolute;
          z-index: 6;
          max-width: 150px;
          text-align: center;
          padding: 6px 10px;
          pointer-events: none;
          user-select: none;
        }

        .quote-heart-emblem {
          color: #9B2226;
          font-size: 0.95rem;
          margin-bottom: 2px;
          font-weight: 700;
        }

        .quote-text {
          font-family: 'Playfair Display', Georgia, serif;
          font-style: italic;
          font-size: clamp(10px, 0.85vw, 11.5px);
          line-height: 1.35;
          color: #4A3E33;
          margin: 0;
          text-shadow: 0 1px 2px rgba(255, 255, 255, 0.9);
          letter-spacing: -0.01em;
        }

        @media (max-width: 768px) {
          .wall-decorative-quote-card {
            display: none; /* Keep mobile canvas clear */
          }
        }
      `}</style>
    </div>
  );
};

export default DecorativeCard;
