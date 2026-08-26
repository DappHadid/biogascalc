/* ── Dynamic slider ranges — derive the max value each dimension
   can reach without pushing totalVolume past the plan's cap, given
   the other dimensions held at their current value. Inverts the
   same volume formulas used in useDomeCalculations.js.

   All inputs/outputs are in cm (matches the raw params the sliders
   edit); maxVolumeM3 is in m³ (matches the plan cap).
   ------------------------------------------------------------ */

function cmToM(cm) {
  return Math.max(0.01, cm / 100);
}

/* Circular: V = (2/3) * PI * r^2 * h, r = diameter/2 */
export function maxDiameterCm(heightCm, maxVolumeM3, hardMax) {
  const h = cmToM(heightCm);
  const rMaxM = Math.sqrt(maxVolumeM3 / ((2 / 3) * Math.PI * h));
  return Math.min(hardMax, rMaxM * 2 * 100);
}

export function maxHeightCm(diameterCm, maxVolumeM3, hardMax) {
  const r = cmToM(diameterCm) / 2;
  const hMaxM = maxVolumeM3 / ((2 / 3) * Math.PI * r * r);
  return Math.min(hardMax, hMaxM * 100);
}

/* Rectangle: V = L*W*H + (PI/2)*(W/2)^2*L */
export function maxLengthCm(widthCm, wallHeightCm, maxVolumeM3, hardMax) {
  const w = cmToM(widthCm);
  const h = cmToM(wallHeightCm);
  const roofRadius = w / 2;
  const perLength = w * h + (Math.PI / 2) * roofRadius * roofRadius;
  const lMaxM = maxVolumeM3 / perLength;
  return Math.min(hardMax, lMaxM * 100);
}

export function maxWallHeightCm(lengthCm, widthCm, maxVolumeM3, hardMax) {
  const l = cmToM(lengthCm);
  const w = cmToM(widthCm);
  const roofRadius = w / 2;
  const roofVolume = (Math.PI / 2) * roofRadius * roofRadius * l;
  const hMaxM = (maxVolumeM3 - roofVolume) / (l * w);
  return Math.min(hardMax, Math.max(0, hMaxM * 100));
}

/* Width appears as W (wall term) and W^2 (roof term) — solve the
   quadratic (PI/8)*L*W^2 + L*H*W - maxVolume = 0 for W. */
export function maxWidthCm(lengthCm, wallHeightCm, maxVolumeM3, hardMax) {
  const l = cmToM(lengthCm);
  const h = cmToM(wallHeightCm);
  const a = (Math.PI / 8) * l;
  const b = l * h;
  const c = -maxVolumeM3;
  const discriminant = b * b - 4 * a * c;
  if (discriminant < 0 || a === 0) return hardMax;
  const wMaxM = (-b + Math.sqrt(discriminant)) / (2 * a);
  return Math.min(hardMax, Math.max(0, wMaxM * 100));
}
