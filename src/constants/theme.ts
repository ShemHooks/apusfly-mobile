export const brandColors = {
  primary: "#75C928",
  primaryDark: "#559E1C",
  primaryLight: "#EAF7DE",

  black: "#171717",
  yellow: "#F4C430",
  white: "#FFFFFF",
} as const;

export const colors = {
  light: {
    primary: brandColors.primary,
    primaryPressed: brandColors.primaryDark,
    primarySoft: brandColors.primaryLight,

    background: "#FFFFFF",
    surface: "#F8FAF7",
    surfaceSecondary: "#F0F4ED",

    text: "#171717",
    textSecondary: "#647067",
    textInverse: "#FFFFFF",

    border: "#E1E8DE",
    divider: "#EDF1EA",

    success: "#16A34A",
    warning: "#D97706",
    danger: "#DC2626",
    info: "#2563EB",

    accent: brandColors.yellow,
  },

  dark: {
    primary: "#8BDB43",
    primaryPressed: "#75C928",
    primarySoft: "#24391A",

    background: "#101410",
    surface: "#1A211A",
    surfaceSecondary: "#263026",

    text: "#F8FAF7",
    textSecondary: "#A8B5A6",
    textInverse: "#101410",

    border: "#344034",
    divider: "#283328",

    success: "#4ADE80",
    warning: "#FBBF24",
    danger: "#F87171",
    info: "#60A5FA",

    accent: "#F4C430",
  },
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  "2xl": 40,
  "3xl": 48,
} as const;

export const borderRadius = {
  sm: 6,
  md: 10,
  lg: 16,
  xl: 24,
  full: 9999,
} as const;

export const fontSize = {
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 20,
  "2xl": 24,
  "3xl": 30,
  "4xl": 36,
} as const;

export const fontWeight = {
  regular: "400",
  medium: "500",
  semibold: "600",
  bold: "700",
} as const;
