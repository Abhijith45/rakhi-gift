import React from 'react';

export const WallBackground = ({ children }) => {
  return (
    <div className="wall-background-root">
      {/* Wall Ambient Lighting Texture */}
      <div className="wall-plaster-ambient" />

      {/* Script Calligraphy Header */}
      <div className="wall-calligraphy-header">
        <h2 className="wall-script-title">
          Memories that <span className="script-accent">last forever</span>
          <span className="script-heart"> ♡</span>
        </h2>
      </div>

      {/* Gold Wire Grid Outer Frame */}
      <div className="wire-grid-outer-frame">
        {/* Wire Grid Mesh Pattern */}
        <div className="wire-grid-mesh-pattern" />

        {/* Content Container (Threads, Frames, Notes) */}
        <div className="wire-grid-content-area">
          {children}
        </div>
      </div>

      <style>{`
        .wall-background-root {
          position: relative;
          width: 100%;
          min-height: 680px;
          background: linear-gradient(180deg, #F5ECE0 0%, #EFE4D6 50%, #E5D8C6 100%);
          border-radius: var(--radius-xl);
          padding: 1.75rem 1.5rem 2.25rem 1.5rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          overflow: hidden;
          box-shadow: 
            inset 0 2px 8px rgba(255, 255, 255, 0.6),
            0 16px 44px rgba(65, 45, 25, 0.12);
          border: 1px solid #D8CABB;
        }

        /* Warm ambient spotlight glow */
        .wall-plaster-ambient {
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at 50% 30%, rgba(255, 252, 244, 0.75) 0%, rgba(240, 230, 214, 0.3) 55%, rgba(210, 192, 170, 0.35) 100%);
          pointer-events: none;
        }

        /* Script Calligraphy Header */
        .wall-calligraphy-header {
          position: relative;
          z-index: 2;
          text-align: center;
          margin-bottom: 0.85rem;
        }

        .wall-script-title {
          font-family: 'Playfair Display', Georgia, serif;
          font-style: italic;
          font-weight: 600;
          font-size: clamp(1.75rem, 3.5vw, 2.5rem);
          color: #2D251E;
          letter-spacing: -0.01em;
          margin: 0;
          text-shadow: 0 1px 2px rgba(255, 255, 255, 0.7);
        }

        .script-accent {
          color: #9B2226; /* Rakhi Crimson */
          font-style: italic;
        }

        .script-heart {
          color: #9B2226;
          font-size: 0.9em;
          vertical-align: middle;
          margin-left: 3px;
        }

        /* Wire Grid Outer Metal Frame */
        .wire-grid-outer-frame {
          position: relative;
          z-index: 3;
          width: 100%;
          flex: 1;
          min-height: 540px;
          border: 5px solid #CDB179;
          border-radius: 24px;
          box-shadow: 
            0 6px 20px rgba(60, 45, 25, 0.15),
            inset 0 1px 4px rgba(255, 255, 255, 0.5),
            inset 0 -1px 4px rgba(80, 55, 15, 0.25);
          background: rgba(248, 242, 232, 0.5);
          display: flex;
          overflow: visible;
        }

        /* Wire Grid Mesh Pattern */
        .wire-grid-mesh-pattern {
          position: absolute;
          inset: 0;
          border-radius: 19px;
          background-size: 58px 58px;
          background-image: 
            linear-gradient(to right, rgba(195, 160, 95, 0.35) 1.2px, transparent 1.2px),
            linear-gradient(to bottom, rgba(195, 160, 95, 0.35) 1.2px, transparent 1.2px);
          pointer-events: none;
          box-shadow: inset 0 0 12px rgba(160, 130, 80, 0.08);
        }

        .wire-grid-content-area {
          position: relative;
          width: 100%;
          height: 100%;
          min-height: 540px;
        }

        @media (max-width: 900px) {
          .wall-background-root {
            min-height: 600px;
            padding: 1.25rem 1rem 1.75rem 1rem;
          }
          .wire-grid-outer-frame {
            min-height: 480px;
            border-width: 4px;
            border-radius: 18px;
          }
          .wire-grid-mesh-pattern {
            background-size: 46px 46px;
          }
        }

        @media (max-width: 640px) {
          .wall-background-root {
            min-height: 520px;
            padding: 1rem 0.5rem 1.25rem 0.5rem;
          }
          .wire-grid-outer-frame {
            min-height: 440px;
            border-width: 3px;
            border-radius: 14px;
          }
          .wire-grid-mesh-pattern {
            background-size: 36px 36px;
          }
          .wall-script-title {
            font-size: 1.35rem;
          }
        }
      `}</style>
    </div>
  );
};

export default WallBackground;
