import PropTypes from 'prop-types';

import { getTileFriendlyName } from 'utils/mahjong';

export default function MahjongTile({
  tile,
  x,
  y,
  imageUrl,
  active,
  hint,
  onClick
}) {
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
      {(active || hint) && (
        <svg
          width={53}
          height={64}
          viewBox="0 0 53 64"
          style={{ zIndex: 10000 }}
        >
          <rect
            x={0}
            y={0}
            width={53}
            height={64}
            fill={active ? '#ff0000' : '#00ff00'}
            fillOpacity={0.4}
            stroke={active ? '#ff0000' : '#00ff00'}
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
  hint: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
  x: PropTypes.number,
  y: PropTypes.number
};
