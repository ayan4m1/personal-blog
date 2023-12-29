import { shuffle } from 'lodash-es';

export const tileTypes = {
  circle: 'Circle',
  bamboo: 'Bamboo',
  character: 'Character',
  wind: 'Wind',
  dragon: 'Dragon',
  season: 'Season',
  flower: 'Flower'
};
export const tileCounts = {
  [tileTypes.circle]: 9,
  [tileTypes.bamboo]: 9,
  [tileTypes.character]: 9,
  [tileTypes.wind]: 4,
  [tileTypes.dragon]: 3,
  [tileTypes.season]: 4,
  [tileTypes.flower]: 4
};
export const tileCopies = {
  [tileTypes.circle]: 4,
  [tileTypes.bamboo]: 4,
  [tileTypes.character]: 4,
  [tileTypes.wind]: 4,
  [tileTypes.dragon]: 4,
  [tileTypes.season]: 1,
  [tileTypes.flower]: 1
};
export function getTileImagePath(tile) {
  return `mahjong/${tile.type.toLowerCase()}_${tile.value}.svg`;
}
export function getTiles() {
  const result = [];

  for (const type of Object.values(tileTypes)) {
    for (let i = 0; i < tileCounts[type]; i++) {
      for (let j = 0; j < tileCopies[type]; j++) {
        result.push({
          index: `${type}_${i}_${j}`,
          type,
          value: i + 1
        });
      }
    }
  }

  return result;
}
export function generateTurtle() {
  const result = [];
  const tiles = shuffle(getTiles());

  let i = 0;
  let remaining = tiles.length;
  for (const tile of tiles) {
    result.push({
      ...tile,
      layer: remaining < 40 ? 0 : 1,
      x: (i % 15) + (remaining < 40 ? 0.5 : 0),
      y: Math.floor(i / 15)
    });
    i++;
  }

  return result;
}
