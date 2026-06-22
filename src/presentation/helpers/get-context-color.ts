interface ComponentColors {
  backgroundColor: string;
  textColor: string;
  borderColor: string;
}

function hexToHsl(hex: string): { h: number; s: number; l: number } | null {
  const cleanHex = hex.replace("#", "");
  if (cleanHex.length !== 3 && cleanHex.length !== 6) return null;

  let num = parseInt(cleanHex, 16);
  let r = 0,
    g = 0,
    b = 0;

  if (cleanHex.length === 3) {
    r = ((num >> 8) & 0xf) * 17;
    g = ((num >> 4) & 0xf) * 17;
    b = (num & 0xf) * 17;
  } else {
    r = (num >> 16) & 0xff;
    g = (num >> 8) & 0xff;
    b = num & 0xff;
  }

  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  let h = 0,
    s = 0,
    l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

export function getContextColors(
  bgColor: string,
  textColorFallBack?: string,
  borderColorFallBack?: string,
): ComponentColors {
  const hsl = hexToHsl(bgColor);

  if (!hsl) {
    return {
      backgroundColor: bgColor,
      textColor: textColorFallBack || "#000000",
      borderColor: borderColorFallBack || "#000000",
    };
  }

  const { h, s, l } = hsl;

  if (l > 50) {
    return {
      backgroundColor: `hsl(${h}, ${s}%, ${l}%)`,
      textColor: `hsl(${h}, ${Math.max(500, s - 50)}%, ${Math.max(15, l - 68)}%)`,
      borderColor: `hsl(${h}, ${Math.max(50, s - 50)}%, ${Math.max(20, l - 18)}%)`,
    };
  } else {
    return {
      backgroundColor: `hsl(${h}, ${s}%, ${l}%)`,
      textColor: `hsl(${h}, ${Math.min(20, s)}%, 95%)`,
      borderColor: `hsl(${h}, ${s}%, ${Math.min(20, l + 10)}%)`,
    };
  }
}
