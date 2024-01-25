import { rgb, color as createColor } from 'd3-color';
import { diff, rgb_to_lab } from 'color-diff';
import { shuffle } from 'lodash-es';

export const createRandomColor = () =>
  rgb(
    Math.ceil(Math.random() * 255),
    Math.ceil(Math.random() * 255),
    Math.ceil(Math.random() * 255),
    1
  ).formatHex();

export const createRandomPuzzle = (difficulty = 1) => {
  const colorCount = Math.ceil(Math.random() * difficulty) + 2;
  const colors = [];
  const minPct = 0.05;
  let remainingPct = 1;

  while (colors.length < colorCount) {
    const newColor = createRandomColor();

    if (colors.some(({ color }) => getColorSimilarity(color, newColor) > 80)) {
      continue;
    }

    const newPct =
      colors.length + 1 === colorCount
        ? remainingPct
        : Math.max(
            minPct,
            parseFloat((remainingPct * (Math.random() / 2)).toFixed(2))
          );

    colors.push({ color: newColor, pct: newPct });

    remainingPct -= newPct;
  }

  return colors;
};

export const createColorPalette = (colors) => {
  const palette = colors.map(({ color }) => color);

  while (palette.length < 16) {
    const newColor = createRandomColor();

    if (!palette.some((color) => getColorSimilarity(color, newColor) < 30)) {
      palette.push(createRandomColor());
    }
  }

  return shuffle(palette);
};

const getLabColor = (hex) => {
  const color = createColor(hex);

  return rgb_to_lab({
    R: color.r,
    G: color.g,
    B: color.b
  });
};

export const getColorSimilarity = (a, b) =>
  100 - diff(getLabColor(a), getLabColor(b));

export const combineColors = (colors) => {
  if (!colors.length) {
    return 'transparent';
  }

  const mixed = [0, 0, 0];
  let totalPct = 0;

  for (const { color, pct } of colors) {
    const { r, g, b } = createColor(color);

    mixed[0] += r * pct;
    mixed[1] += g * pct;
    mixed[2] += b * pct;
    totalPct += pct;
  }

  if (totalPct < 1) {
    mixed[0] *= 1 / totalPct;
    mixed[1] *= 1 / totalPct;
    mixed[2] *= 1 / totalPct;
  }

  return rgb(...mixed, 1).formatHex();
};

export const combineColorChoices = (colors, choices) =>
  choices.map((color, index) => ({
    color,
    pct: colors[index].pct
  }));

export const getRemainingPct = (colors) =>
  Math.round(
    Math.max(0, (1 - colors.reduce((prev, curr) => prev + curr.pct, 0)) * 100)
  );
