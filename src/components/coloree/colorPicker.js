import PropTypes from 'prop-types';
import { Fragment, useRef, useEffect } from 'react';

const diameter = 400;
const radius = diameter / 2;

export default function ColorPicker({
  colors,
  colorChoices,
  displayColor,
  solving
}) {
  const canvasRef = useRef();

  useEffect(() => {
    if (canvasRef.current) {
      const [height, width] = [
        canvasRef.current.clientHeight,
        canvasRef.current.clientWidth
      ];
      const ctx = canvasRef.current.getContext('2d');

      ctx.clearRect(0, 0, width, height);

      const borders = [];

      let currentAngle = Math.PI / 2;

      const renderColors = solving
        ? colors.map(({ pct }, index) => ({
            color: colorChoices[index] ?? '#666',
            pct
          }))
        : colors;

      for (const { color, pct } of renderColors) {
        const angle = pct * Math.PI;

        const path = new Path2D();

        path.moveTo(width, height / 2);
        path.arc(width, height / 2, radius, currentAngle, currentAngle + angle);
        path.closePath();

        ctx.fillStyle = color;
        ctx.fill(path);

        currentAngle += angle;

        borders.push(currentAngle);
      }

      const border = new Path2D();

      border.rect(0, 0, radius + 10, 5);

      for (const borderAngle of borders) {
        ctx.translate(width, height / 2);
        ctx.rotate(borderAngle);
        ctx.fillStyle = '#ccc';
        ctx.fill(border);
        ctx.resetTransform();
      }
    }
  }, [colors, colorChoices, solving]);

  return (
    <Fragment>
      <div
        className="color-picker-pie"
        style={{
          height: diameter,
          width: radius,
          borderRadius: `${radius}px`,
          overflow: 'hidden'
        }}
      >
        <canvas ref={canvasRef} height={diameter} width={radius} />
      </div>
      <div
        className="color-picker-final"
        style={{
          height: diameter,
          width: radius,
          borderRadius: `${radius}px`,
          backgroundColor: displayColor
        }}
      />
    </Fragment>
  );
}

ColorPicker.propTypes = {
  colors: PropTypes.arrayOf(PropTypes.object).isRequired,
  colorChoices: PropTypes.arrayOf(PropTypes.string),
  displayColor: PropTypes.string.isRequired,
  solving: PropTypes.bool.isRequired
};
