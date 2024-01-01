import PropTypes from 'prop-types';
import { faPause, faPlay } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, InputGroup } from 'react-bootstrap';

import { formatTime } from 'utils/timer';

export default function TimeViewer({ elapsedTime, running, onToggle }) {
  return (
    <InputGroup>
      <InputGroup.Text className="font-monospace">
        {formatTime(elapsedTime)}
      </InputGroup.Text>
      <Button variant="info" size="sm" onClick={onToggle}>
        <FontAwesomeIcon icon={running ? faPause : faPlay} fixedWidth />
      </Button>
    </InputGroup>
  );
}

TimeViewer.propTypes = {
  elapsedTime: PropTypes.number.isRequired,
  running: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired
};
