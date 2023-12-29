import PropTypes from 'prop-types';

export default function MahjongTile({
  tile,
  x,
  y,
  layer = 1,
  image,
  active,
  onClick
}) {
  return (
    <button
      onClick={() => onClick(tile.index)}
      style={{
        position: 'fixed',
        background: 'none',
        border: active ? '1px solid red' : 'none',
        padding: 0,
        margin: 0,
        zIndex: 999 + layer,
        top: y * 64,
        left: x * 48
      }}
    >
      <img src={image?.publicURL} alt="test" style={{ height: 64 }} />
    </button>
  );
}

MahjongTile.propTypes = {
  tile: PropTypes.object.isRequired,
  image: PropTypes.node.isRequired,
  active: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
  x: PropTypes.number,
  y: PropTypes.number,
  layer: PropTypes.number
};
