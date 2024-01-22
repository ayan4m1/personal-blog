import { rgb } from 'd3-color';

export const randomColor = () =>
  rgb(
    Math.ceil(Math.random() * 255),
    Math.ceil(Math.random() * 255),
    Math.ceil(Math.random() * 255),
    1
  ).formatHex();
