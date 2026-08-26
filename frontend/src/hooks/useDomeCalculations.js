import { useMemo } from "react";

/* ═══════════════════ CIRCULAR DOME (hemisphere) ═══════════════
   diameter & height given in cm, converted to meters internally.
   ------------------------------------------------------------ */
function circularTotalVolume(radius, domeHeight) {
  const r = radius, b = domeHeight > 0 ? domeHeight : radius;
  if (Math.abs(b - r) < 1e-9) return (2 / 3) * Math.PI * r ** 3;
  return (2 / 3) * Math.PI * r * r * b;
}

function circularSurfaceArea(radius, domeHeight) {
  const a = radius, c = domeHeight > 0 ? domeHeight : radius;
  if (Math.abs(a - c) < 1e-9) return 2 * Math.PI * a * a;
  if (c < a) {
    const e = Math.sqrt(1 - (c / a) ** 2);
    return Math.PI * a * a * (1 + (1 - e * e) / e * Math.atanh(e));
  }
  const e = Math.sqrt(1 - (a / c) ** 2);
  return 2 * Math.PI * a * a * (1 + (c / (a * e)) * Math.asin(e));
}

/* ═══════════════════ RECTANGLE DOME (box + half-cylinder roof) ═
   length, width, wallHeight given in cm, converted to meters.
   Roof is a half-cylinder: radius = width / 2.
   ------------------------------------------------------------ */
function rectangleTotalVolume(length, width, wallHeight) {
  const roofRadius = width / 2;
  const wallVolume = length * width * wallHeight;
  const roofVolume = (Math.PI * roofRadius * roofRadius * length) / 2;
  return wallVolume + roofVolume;
}

function rectangleSurfaceArea(length, width, wallHeight) {
  const roofRadius = width / 2;
  // Walls: 2 long sides + 2 short ends (rectangle up to wallHeight) + half-cylinder shell
  const longWalls = 2 * (length * wallHeight);
  const shortEnds = 2 * (width * wallHeight);
  const roofShell = Math.PI * roofRadius * length;
  const roofEndCaps = 2 * ((Math.PI * roofRadius * roofRadius) / 2);
  return longWalls + shortEnds + roofShell + roofEndCaps;
}

/* ═══════════════════════════════════════════════════════════ */

export function useDomeCalculations(params) {
  const { shapeType } = params;

  return useMemo(() => {
    if (shapeType === "rectangle") {
      const length = Math.max(0.01, params.length / 100);
      const width  = Math.max(0.01, params.width / 100);
      const wallHeight = Math.max(0.01, params.wallHeight / 100);

      const Vtotal  = rectangleTotalVolume(length, width, wallHeight);
      const SA      = rectangleSurfaceArea(length, width, wallHeight);

      return {
        totalVolume:  +Vtotal.toFixed(3),
        surfaceArea:  +SA.toFixed(3),
        length, width, wallHeight,
        roofRadius: width / 2,
        shape: "rectangle",
      };
    }

    // Circular
    const radius     = Math.max(0.01, params.diameter / 2 / 100);
    const domeHeight = Math.max(0.01, params.height / 100);

    const Vtotal   = circularTotalVolume(radius, domeHeight);
    const SA       = circularSurfaceArea(radius, domeHeight);

    return {
      totalVolume:  +Vtotal.toFixed(3),
      surfaceArea:  +SA.toFixed(3),
      radius,
      domeHeight,
      shape: "circular",
    };
  }, [
    shapeType,
    params.diameter,
    params.height,
    params.length,
    params.width,
    params.wallHeight,
  ]);
}
