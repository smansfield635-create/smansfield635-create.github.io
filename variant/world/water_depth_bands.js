export const HARBOR_WATER_DEPTH_BANDS = {
  normalizedDepthStops: [
    {
      id: "beach_shallows",
      minDepthUnits: 0,
      maxDepthUnits: 8,
      colorTop: "#e6ffff",
      colorBottom: "#97f6f2",
      glow: "rgba(180,255,244,0.24)"
    },
    {
      id: "lagoon_shelf",
      minDepthUnits: 8,
      maxDepthUnits: 20,
      colorTop: "#7beeea",
      colorBottom: "#33d7ef",
      glow: "rgba(88,244,232,0.18)"
    },
    {
      id: "outer_channel",
      minDepthUnits: 20,
      maxDepthUnits: 40,
      colorTop: "#22b8e7",
      colorBottom: "#0f7fbe",
      glow: "rgba(76,212,255,0.10)"
    },
    {
      id: "open_ocean",
      minDepthUnits: 40,
      maxDepthUnits: 999,
      colorTop: "#0b5e9e",
      colorBottom: "#041a40",
      glow: "rgba(40,120,220,0.06)"
    }
  ],
  currentBands: [
    {
      id: "lagoon_turquoise_current",
      color: "rgba(120,246,244,0.22)",
      lineWidth: 1.6,
      amplitude: 5.0,
      speed: 0.020
    },
    {
      id: "channel_current",
      color: "rgba(84,214,242,0.16)",
      lineWidth: 1.8,
      amplitude: 7.4,
      speed: 0.016
    },
    {
      id: "ocean_current",
      color: "rgba(60,166,224,0.10)",
      lineWidth: 1.8,
      amplitude: 9.2,
      speed: 0.012
    }
  ],
  specular: {
    lagoonHighlight: "rgba(255,255,255,0.16)",
    channelHighlight: "rgba(220,252,255,0.10)",
    oceanHighlight: "rgba(255,255,255,0.06)"
  }
};
