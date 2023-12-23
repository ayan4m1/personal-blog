import PropTypes from 'prop-types';
import { Fragment, useState } from 'react';
import { Row, Col, Nav } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFolder,
  faCaretDown,
  faCaretRight,
  faFile
} from '@fortawesome/free-solid-svg-icons';

const getFileName = (path) => path.substring(path.lastIndexOf('/') + 1);

export default function DirectoryTree({ activeDocument, node, level = 0 }) {
  const { path, children, files } = node;
  const isFile = !Array.isArray(files);

  const [expanded, setExpanded] = useState(level === 0);

  return (
    <Fragment>
      <Row onClick={isFile ? null : () => setExpanded((prevVal) => !prevVal)}>
        <Col xs={1}>
          {!isFile && (
            <FontAwesomeIcon icon={expanded ? faCaretDown : faCaretRight} />
          )}
        </Col>
        <Col xs={11} style={level > 0 ? { paddingLeft: (level + 1) * 12 } : {}}>
          <Nav.Item className={activeDocument === path && 'text-primary'}>
            <Nav.Link eventKey={isFile ? path : null}>
              <FontAwesomeIcon
                icon={isFile ? faFile : faFolder}
                className="me-1"
              />{' '}
              {path ? getFileName(path) : '.'}
            </Nav.Link>
          </Nav.Item>
        </Col>
      </Row>
      {expanded &&
        [...(children || []), ...(files || [])].map((child) => (
          <DirectoryTree
            key={child.path}
            node={child}
            level={level + 1}
            activeDocument={activeDocument}
          />
        ))}
    </Fragment>
  );
}

DirectoryTree.propTypes = {
  activeDocument: PropTypes.string,
  node: PropTypes.object.isRequired,
  level: PropTypes.number
};
