import React, { useMemo } from 'react';
import * as THREE from 'three';

/**
 * Calculates world pin coordinates taking into account frame rotation
 */
function calculatePinWorldPos(coords, photo) {
  const ar = photo.aspectRatio || 1.2;
  const baseW = 1.7 * (coords.scale || 1);
  const pH = baseW / ar;
  const borderPadding = 0.16;
  const bottomExtra = 0.35;
  const height = pH + borderPadding * 2 + bottomExtra;
  const pinLocalY = height / 2 - 0.08;

  const rotRad = THREE.MathUtils.degToRad(coords.rotZ || 0);

  // Apply 2D rotation matrix for local Y offset
  const rotatedX = -pinLocalY * Math.sin(rotRad);
  const rotatedY = pinLocalY * Math.cos(rotRad);

  return new THREE.Vector3(
    coords.x + rotatedX,
    coords.y + rotatedY,
    coords.z + 0.02
  );
}

export const ThreadNetwork = ({
  photos = [],
  connections = [],
  isMobile = false
}) => {
  // Build map of photo coordinates
  const photoMap = useMemo(() => {
    const map = new Map();
    photos.forEach((p) => {
      const coords = isMobile ? p.mobile : p.desktop;
      map.set(p.id, {
        photo: p,
        coords,
        pinWorldPos: calculatePinWorldPos(coords, p)
      });
    });
    return map;
  }, [photos, isMobile]);

  // Generate curved tube geometries for all valid pairs
  const threadGeometries = useMemo(() => {
    const geometries = [];

    connections.forEach((conn, index) => {
      const startObj = photoMap.get(conn.from);
      const endObj = photoMap.get(conn.to);

      if (!startObj || !endObj) return;

      const p1 = startObj.pinWorldPos;
      const p2 = endObj.pinWorldPos;

      // Natural sag depends on distance
      const distance = p1.distanceTo(p2);
      const sag = Math.min(0.24, Math.max(0.06, distance * 0.045));

      const midPoint = new THREE.Vector3()
        .addVectors(p1, p2)
        .multiplyScalar(0.5);
      
      // Thread sags downward and sits slightly closer to the wall
      midPoint.y -= sag;
      midPoint.z = Math.min(p1.z, p2.z) - 0.015;

      const curve = new THREE.CatmullRomCurve3([p1, midPoint, p2]);
      const tubeGeo = new THREE.TubeGeometry(curve, 24, 0.012, 6, false);

      geometries.push({ id: `thread-${index}`, geo: tubeGeo });
    });

    return geometries;
  }, [photoMap, connections]);

  return (
    <group>
      {threadGeometries.map(({ id, geo }) => (
        <mesh key={id} geometry={geo} castShadow>
          <meshStandardMaterial
            color="#A3242A"
            roughness={0.7}
            metalness={0.1}
          />
        </mesh>
      ))}
    </group>
  );
};

export default ThreadNetwork;
