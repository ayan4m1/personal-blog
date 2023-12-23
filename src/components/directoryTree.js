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

  const [expanded, setExpanded] = useState(false);

  return (
    <Fragment>
      <Row onClick={isFile ? null : () => setExpanded((prevVal) => !prevVal)}>
        <Col xs={1}>
          {Boolean(children) && (
            <FontAwesomeIcon icon={expanded ? faCaretDown : faCaretRight} />
          )}
        </Col>
        <Col xs={11} style={level > 0 ? { paddingLeft: (level + 1) * 12 } : {}}>
          <Nav.Item className={activeDocument === path && 'text-primary'}>
            <Nav.Link eventKey={path}>
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
        children.map((child) => (
          <DirectoryTree
            key={child.path}
            node={child}
            level={level + 1}
            activeDocument={activeDocument}
          />
        ))}
      {expanded &&
        files.map((file) => (
          <DirectoryTree
            key={file.path}
            node={file}
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
