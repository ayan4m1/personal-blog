import { useMemo } from 'react';
import PropTypes from 'prop-types';
import { contrastColor } from 'contrast-color';
import { Col, OverlayTrigger, Tooltip } from 'react-bootstrap';

export default function ColorSwatch({
  name,
  color,
  active = false,
  children,
  onChange
}) {
  const style = useMemo(() => {
    const colorHex = color.hex();
    const borderColor = contrastColor({
      bgColor: colorHex
    });
    const result = {
      backgroundColor: colorHex,
      color: borderColor,
      border: active ? `2px dashed ${borderColor}` : 'none'
    };

    return result;
  }, [color, active]);

  return (
    <Col
      xs={12}
      sm={6}
      md={3}
      lg={2}
      className="g-2 d-flex justify-content-center align-items-center"
    >
      <OverlayTrigger placement="bottom" overlay={<Tooltip>{name}</Tooltip>}>
        <button
          type="button"
          className="btn btn-sm color-swatch p-0"
          style={style}
          onClick={() => onChange(color.hex())}
        >
          {children}
        </button>
      </OverlayTrigger>
    </Col>
  );
}

ColorSwatch.propTypes = {
  name: PropTypes.string.isRequired,
  color: PropTypes.object.isRequired,
  active: PropTypes.bool,
  children: PropTypes.node,
  onChange: PropTypes.func.isRequired
};
