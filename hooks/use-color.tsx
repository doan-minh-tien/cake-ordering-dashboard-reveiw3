import { useState } from 'react';

// Reusing the COLOR_OPTIONS from your original code
const COLOR_OPTIONS = [
  { displayName: "Trắng", name: "White", hex: "#FFFFFF" },
  { displayName: "Đỏ", name: "Red", hex: "#FF0000" },
  { displayName: "Xanh lá", name: "Green", hex: "#00FF00" },
  { displayName: "Xanh dương", name: "Blue", hex: "#0000FF" },
  { displayName: "Vàng", name: "Yellow", hex: "#FFFF00" },
  { displayName: "Hồng", name: "Pink", hex: "#FFC0CB" },
  { displayName: "Tím", name: "Purple", hex: "#800080" },
  { displayName: "Cam", name: "Orange", hex: "#FFA500" },
  { displayName: "Nâu", name: "Brown", hex: "#A52A2A" },
];

export interface ColorOption {
  displayName: string;
  name: string;
  hex: string;
}

export const useColorSelection = (initialColor?: any) => {
  const getColorValue = (colorData?: any): ColorOption => {
    if (!colorData) return COLOR_OPTIONS[0];

    if (typeof colorData === 'string') {
      // Search by English name
      const foundColor = COLOR_OPTIONS.find((c) => c.name === colorData);
      if (foundColor) return foundColor;

      // Search by Vietnamese display name
      const foundDisplayColor = COLOR_OPTIONS.find(
        (c) => c.displayName === colorData
      );
      if (foundDisplayColor) return foundDisplayColor;

      // Search by hex code
      const hexColor = COLOR_OPTIONS.find((c) => c.hex === colorData);
      if (hexColor) return hexColor;

      return COLOR_OPTIONS[0];
    }

    // Check if it's an object with properties
    if (colorData && typeof colorData === 'object') {
      // Check for old structure (only name and hex)
      if ('name' in colorData && 'hex' in colorData && !('displayName' in colorData)) {
        const matchingColor = COLOR_OPTIONS.find(
          (c) => c.name === colorData.name || c.hex === colorData.hex
        );
        if (matchingColor) return matchingColor;
      }

      // Check for new structure with all properties
      if ('displayName' in colorData && 'name' in colorData && 'hex' in colorData) {
        return colorData as ColorOption;
      }
    }

    return COLOR_OPTIONS[0];
  };

  const [selectedColor, setSelectedColor] = useState<ColorOption>(
    getColorValue(initialColor)
  );

  const changeColor = (newColor: any) => {
    const processedColor = getColorValue(newColor);
    setSelectedColor(processedColor);
  };

  return {
    COLOR_OPTIONS,
    selectedColor,
    changeColor,
    getColorValue
  };
};