import PropTypes from 'prop-types';
import { Fragment, useRef, useEffect } from 'react';

export default function ColorPicker({ diameter, finalColor, pieColors }) {
  const radius = diameter / 2;
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

      for (const { color, pct } of pieColors) {
        const angle = pct * Math.PI;

        const path = new Path2D();

        path.moveTo(width, height / 2);
        path.arc(
          width,
          height / 2,
          radius + 10,
          currentAngle,
          currentAngle + angle
        );
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
  }, [pieColors, canvasRef]);

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
          backgroundColor: finalColor
        }}
      />
    </Fragment>
  );
}

ColorPicker.propTypes = {
  diameter: PropTypes.number.isRequired,
  pieColors: PropTypes.arrayOf(PropTypes.object).isRequired,
  finalColor: PropTypes.string.isRequired
};
