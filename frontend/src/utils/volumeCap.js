/* ── Volume cap — proportional dimension scaling ───────────────
   Scales dome dimensions down (never up) so totalVolume never
   exceeds maxVolume, using s = cbrt(maxVolume / currentVolume)
   since uniform scaling of every linear dimension by s scales
   volume by s^3 for both dome shapes.
   ------------------------------------------------------------ */
export function clampParamsToVolume(params, currentVolume, maxVolume) {
  if (currentVolume <= maxVolume || currentVolume <= 0) return params;

  const scale = Math.cbrt(maxVolume / currentVolume);

  if (params.shapeType === "rectangle") {
    return {
      ...params,
      length:     params.length * scale,
      width:      params.width * scale,
      wallHeight: params.wallHeight * scale,
    };
  }

  return {
    ...params,
    diameter: params.diameter * scale,
    height:   params.height * scale,
  };
}
