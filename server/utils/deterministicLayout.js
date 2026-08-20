/**
 * Simple PRNG based on string seed (Murmur-like hash)
 */
function createPrng(seedStr) {
  let hash = 0;
  for (let i = 0; i < seedStr.length; i++) {
    const char = seedStr.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }

  return function nextRandom() {
    hash = (hash * 9301 + 49297) % 233280;
    return hash / 233280;
  };
}

/**
 * Computes deterministic 3D layout coordinates and thread connections for a list of photos
 */
export function calculateDeterministicLayout(photos = [], seed = 'default-seed') {
  const prng = createPrng(seed);
  const count = photos.length;

  // Base grid layouts for desktop (2-3 rows) and mobile (vertical column flow)
  return photos.map((photo, index) => {
    // Generate small pseudo-random tilts between -3.5° and +3.5°
    const rotZ = Number(((prng() - 0.5) * 7.0).toFixed(2));
    const mobileRotZ = Number(((prng() - 0.5) * 5.0).toFixed(2));

    // Desktop positioning
    let desktopX = 0;
    let desktopY = 0;
    let desktopZ = Number((0.04 + prng() * 0.08).toFixed(2));

    if (count <= 6) {
      // 2 rows of 3
      const col = index % 3; // 0, 1, 2
      const row = Math.floor(index / 3); // 0, 1
      desktopX = Number((-2.8 + col * 2.8 + (prng() - 0.5) * 0.3).toFixed(2));
      desktopY = Number((row === 0 ? 1.35 : -1.35 + (prng() - 0.5) * 0.3).toFixed(2));
    } else if (count <= 8) {
      // 2 rows of 4
      const col = index % 4;
      const row = Math.floor(index / 4);
      desktopX = Number((-3.6 + col * 2.4 + (prng() - 0.5) * 0.25).toFixed(2));
      desktopY = Number((row === 0 ? 1.4 : -1.4 + (prng() - 0.5) * 0.25).toFixed(2));
    } else {
      // 3 rows for 9-15 photos
      const col = index % 4;
      const row = Math.floor(index / 4);
      desktopX = Number((-3.6 + col * 2.4 + (prng() - 0.5) * 0.2).toFixed(2));
      desktopY = Number((1.8 - row * 1.7 + (prng() - 0.5) * 0.2).toFixed(2));
    }

    // Mobile positioning (focused vertical flow)
    const mobileCol = index % 2;
    const mobileRow = Math.floor(index / 2);
    const mobileX = Number((mobileCol === 0 ? -1.15 : 1.15).toFixed(2));
    const mobileY = Number((1.6 - mobileRow * 1.55).toFixed(2));
    const mobileZ = Number((0.05 + prng() * 0.06).toFixed(2));

    return {
      ...photo,
      desktop: {
        x: desktopX,
        y: desktopY,
        z: desktopZ,
        rotZ,
        scale: 1.0
      },
      mobile: {
        x: mobileX,
        y: mobileY,
        z: mobileZ,
        rotZ: mobileRotZ,
        scale: 0.85
      },
      pin: { x: 0, y: 0.9, z: 0.12 }
    };
  });
}

/**
 * Computes natural connecting thread pairs for any photo count
 */
export function calculateThreadConnections(photos = []) {
  const connections = [];
  const count = photos.length;
  if (count < 2) return connections;

  // Primary chain
  for (let i = 0; i < count - 1; i++) {
    connections.push({
      from: photos[i].id,
      to: photos[i + 1].id
    });
  }

  // Add 1-2 cross-tension threads for visual richness
  if (count >= 6) {
    connections.push({ from: photos[1].id, to: photos[4].id });
  }
  if (count >= 8) {
    connections.push({ from: photos[2].id, to: photos[6].id });
  }

  return connections;
}
