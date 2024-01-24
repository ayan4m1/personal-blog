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

export const createColorPalette = (colors) => {
  const palette = colors.map(({ color }) => color);

  for (let i = palette.length - 1; i < 17; i++) {
    palette.push(createRandomColor());
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
