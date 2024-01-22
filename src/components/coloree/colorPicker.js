import PropTypes from 'prop-types';
import { Fragment } from 'react';

const diameter = 400;
const radius = diameter / 2;

export default function ColorPicker({ pieGradient, displayColor }) {
  return (
    <Fragment>
      <div
        className="color-picker-pie"
        style={{
          height: diameter,
          width: radius,
          borderRadius: `${radius}px`,
          background: pieGradient
        }}
      />
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
  pieGradient: PropTypes.string,
  displayColor: PropTypes.string
};
