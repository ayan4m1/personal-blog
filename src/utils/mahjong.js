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
export const layouts = {
  turtle: [
    [12, 8, 10, 12, 12, 10, 8, 12],
    [0, 6, 6, 6, 6, 6, 6, 0],
    [0, 0, 4, 4, 4, 4, 0, 0],
    [0, 0, 0, 2, 2, 0, 0, 0],
    { layer: 1, x: -7, y: 3.5 },
    { layer: 1, x: 6, y: 3.5 },
    { layer: 1, x: 7, y: 3.5 },
    { layer: 5, x: -0.5, y: 3.5 }
  ]
};
export function getTileImagePath(tile) {
  return `mahjong/${tile.type.toLowerCase()}_${tile.value}.svg`;
}
export function getTileFriendlyName(tile) {
  return `${tile.value} ${tile.type}`;
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
export function generateLayout(name) {
  const result = [];
  const tiles = shuffle(getTiles());
  const layout = layouts[name];

  let layer = 1;
  for (const row of layout) {
    if (Array.isArray(row)) {
      let unitY = 0;
      for (const count of row) {
        let unitX = -count / 2;
        for (let i = 0; i < count; i++) {
          const tile = tiles.shift();

          result.push({
            ...tile,
            layer,
            x: unitX,
            y: unitY
          });
          unitX++;
        }
        unitY++;
      }
    } else {
      const tile = tiles.shift();
      const { layer, x, y } = row;
      result.push({
        ...tile,
        layer,
        x,
        y
      });
    }
    layer++;
  }

  return result;
}
export function isOpen(tile, layout) {
  const prevTile = layout.find(
    (t) =>
      t.x === tile.x - 1 && Math.abs(t.y - tile.y) < 1 && t.layer === tile.layer
  );
  const nextTile = layout.find(
    (t) =>
      t.x === tile.x + 1 && Math.abs(t.y - tile.y) < 1 && t.layer === tile.layer
  );
  const aboveTile = layout.find(
    (t) =>
      Math.abs(t.x - tile.x) < 1 &&
      Math.abs(t.y - tile.y) < 1 &&
      t.layer === tile.layer + 1
  );

  const minX = layout.reduce((prevMin, t) => Math.min(prevMin, t.x), 100);
  const maxX = layout.reduce((prevMax, t) => Math.max(prevMax, t.x), -100);

  return (
    ((tile.x >= minX && !prevTile) || (tile.x <= maxX && !nextTile)) &&
    !aboveTile
  );
}
export function isMatch(aTile, bTile) {
  if (aTile.type !== bTile.type) {
    return false;
  }

  switch (aTile.type) {
    case tileTypes.circle:
    case tileTypes.character:
    case tileTypes.bamboo:
    case tileTypes.wind:
    case tileTypes.dragon:
      if (aTile.value !== bTile.value) {
        return false;
      }
      break;
  }

  return true;
}
export function getAvailableMatches(layout) {
  let matches = 0;

  for (const tile of layout) {
    for (const otherTile of layout) {
      if (tile.index === otherTile.index) {
        continue;
      }

      if (
        isOpen(tile, layout) &&
        isOpen(otherTile, layout) &&
        isMatch(tile, otherTile)
      ) {
        matches++;
      }
    }
  }

  return matches / 2;
}
