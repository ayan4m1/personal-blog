import PropTypes from 'prop-types';
import {
  faDiceD4,
  faDiceD6,
  faDiceD8,
  faDiceD10,
  faDiceD12,
  faDiceD20
} from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const mapping = {
  4: faDiceD4,
  6: faDiceD6,
  8: faDiceD8,
  10: faDiceD10,
  12: faDiceD12,
  20: faDiceD20
};

export default function Result({ sides, value, ...props }) {
  return (
    <div>
      <FontAwesomeIcon
        {...props}
        opacity={0.2}
        size="4x"
        fixedWidth
        icon={mapping[sides]}
      />
      <div
        style={{
          position: 'relative',
          top: '-64px',
          left: 0,
          height: '64px',
          width: '80px',
          zIndex: 1000,
          verticalAlign: 'middle',
          display: 'table-cell',
          fontSize: '2rem'
        }}
        className="text-center"
      >
        {value}
      </div>
    </div>
  );
}

Result.propTypes = {
  sides: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired
};
