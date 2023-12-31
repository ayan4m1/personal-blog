import PropTypes from 'prop-types';

export default function MahjongTile({ tile, x, y, imageUrl, active, onClick }) {
  return (
    <button
      onClick={() => onClick(tile)}
      className="mahjong-tile"
      style={{
        border: active ? '2px solid red' : 'none',
        margin: active ? 0 : 2,
        zIndex: 999 + tile.layer,
        top: y - tile.layer * -5,
        left: x - tile.layer * -5
      }}
    >
      <img draggable={false} src={imageUrl} alt="test" style={{ height: 64 }} />
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
