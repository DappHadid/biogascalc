import * as THREE from "three";

/* ── Profile point generators ─────────────────────────────────
   Returns array of [x, y] points for LatheGeometry.
   x = radius at that height, y = height from base (0 = floor).
   ------------------------------------------------------------ */

export function hemisphereProfile(radius, segments = 64) {
  const points = [];
  for (let i = 0; i <= segments; i++) {
    const t = (i / segments) * (Math.PI / 2);   // 0 → π/2
    const y = radius * Math.sin(t);
    const x = radius * Math.cos(t);
    points.push(new THREE.Vector2(x, y));
  }
  return points;
}

export function semiEllipsoidProfile(radius, height, segments = 64) {
  const points = [];
  for (let i = 0; i <= segments; i++) {
    const t = (i / segments) * (Math.PI / 2);
    const y = height * Math.sin(t);
    const x = radius * Math.cos(t);
    points.push(new THREE.Vector2(x, y));
  }
  return points;
}

/* ── Slurry cap profile ────────────────────────────────────────
   Same lathe approach but only up to slurry height.
   ------------------------------------------------------------ */

export function slurryCapProfile(shapeType, radius, domeHeight, slurryHeight, segments = 64) {
  if (slurryHeight <= 0) return [];

  const H  = shapeType === "hemisphere" ? radius : domeHeight;
  const hClamped = Math.min(slurryHeight, H);
  const points = [];

  for (let i = 0; i <= segments; i++) {
    const y = (i / segments) * hClamped;
    let x;
    if (shapeType === "hemisphere") {
      const r = radius;
      x = Math.sqrt(Math.max(0, r * r - (r - y) * (r - y)));
    } else {
      const a = radius, b = H;
      const ratio = 1 - (y / b) ** 2;
      x = a * Math.sqrt(Math.max(0, ratio));
    }
    points.push(new THREE.Vector2(x, y));
  }

  // Close bottom: add center point at y=0
  points.push(new THREE.Vector2(0, 0));
  return points;
}

/* ── Build LatheGeometry from profile ─────────────────────────*/
export function buildLathe(profile, phiSegments = 80) {
  if (!profile || profile.length < 2) return null;
  return new THREE.LatheGeometry(profile, phiSegments);
}

