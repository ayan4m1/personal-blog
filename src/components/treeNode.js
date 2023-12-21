import PropTypes from 'prop-types';
import { Fragment, useState } from 'react';
import { Row, Col, Nav } from 'react-bootstrap';
import {
  faCaretDown,
  faCaretRight,
  faFile,
  faFolder
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function TreeNode({
  title,
  children,
  active = false,
  level = 0
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <Fragment>
      <Row onClick={() => setExpanded((prevVal) => !prevVal)}>
        <Col xs={1 + level}>
          {Boolean(children) && (
            <FontAwesomeIcon icon={expanded ? faCaretDown : faCaretRight} />
          )}
        </Col>
        <Col xs={11 - level}>
          <Nav.Item className={active && 'text-primary'}>
            <Nav.Link eventKey={title}>
              <FontAwesomeIcon
                icon={children ? faFolder : faFile}
                className="me-1"
              />{' '}
              {title}
            </Nav.Link>
          </Nav.Item>
        </Col>
      </Row>
      {expanded && children}
    </Fragment>
  );
}

TreeNode.propTypes = {
  active: PropTypes.bool,
  title: PropTypes.string.isRequired,
  level: PropTypes.number,
  children: PropTypes.node
};
