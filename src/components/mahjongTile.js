import PropTypes from 'prop-types';

import { getTileFriendlyName } from 'utils/mahjong';

export default function MahjongTile({ tile, x, y, imageUrl, active, onClick }) {
  return (
    <button
      onClick={() => onClick(tile)}
      className="mahjong-tile"
      style={{
        zIndex: 999 + tile.layer,
        top: y,
        left: x
      }}
    >
      <img
        draggable={false}
        src={imageUrl}
        alt={getTileFriendlyName(tile)}
        style={{ height: 64, position: 'absolute' }}
      />
      {active && (
        <svg
          width={53}
          height={64}
          viewBox="0 0 53 64"
          style={{ zIndex: 10000 }}
        >
          <rect
            x={0}
            y={0}
            height={64}
            width={53}
            fill="#ff0000"
            fillOpacity={0.4}
            stroke="#ff0000"
            strokeWidth={2}
            rx={8}
          />
        </svg>
      )}
    </button>
  );
}

MahjongTile.propTypes = {
  tile: PropTypes.object.isRequired,
  imageUrl: PropTypes.string.isRequired,
  active: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
  x: PropTypes.number,
  y: PropTypes.number
};
