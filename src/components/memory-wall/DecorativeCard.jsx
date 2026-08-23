import React from 'react';

export const DecorativeCard = ({
  top = 85,
  left = 48,
  rot = 0,
  plan = 'PREMIUM'
}) => {
  const normalizedPlan = (plan || 'PREMIUM').toUpperCase();
  if (normalizedPlan === 'BASIC') return null;

  const isDeluxe = normalizedPlan === 'DELUXE';

  return (
    <div
      className={`wall-decorative-quote-card ${isDeluxe ? 'quote-card-deluxe' : ''}`}
      style={{
        top: `${top}%`,
        left: `${left}%`,
        transform: `translate(-50%, -50%) rotate(${rot}deg)`
      }}
    >
      <div className="quote-heart-emblem">♡</div>
      <p className="quote-text">
        {isDeluxe ? (
          <>
            Some bonds are<br />
            woven in the heart,<br />
            celebrated forever.
          </>
        ) : (
          <>
            Some bonds<br />
            are meant to be<br />
            celebrated forever.
          </>
        )}
      </p>

      <style>{`
        .wall-decorative-quote-card {
          position: absolute;
          z-index: 7;
          max-width: 150px;
          text-align: center;
          padding: 6px 10px;
          pointer-events: none;
          user-select: none;
          transition: transform 0.2s ease;
        }

        .quote-card-deluxe {
          background: rgba(255, 252, 246, 0.85);
          border: 1px solid #DFC9A8;
          border-radius: 4px;
          box-shadow: 0 4px 14px rgba(60, 45, 20, 0.1);
          padding: 8px 12px;
          max-width: 165px;
        }

        .quote-heart-emblem {
          color: #9B2226;
          font-size: 0.95rem;
          margin-bottom: 2px;
          font-weight: 700;
        }

        .quote-card-deluxe .quote-heart-emblem {
          color: #8E1616;
          font-size: 1.05rem;
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

        .quote-card-deluxe .quote-text {
          color: #38281C;
          font-size: clamp(10.5px, 0.9vw, 12px);
          font-weight: 500;
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
