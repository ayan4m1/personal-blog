import Prism from 'prismjs';
import PropTypes from 'prop-types';
import { useState, useEffect, useRef } from 'react';
import { Row, Tab, Col, Card } from 'react-bootstrap';

import TreeNode from 'components/treeNode';

const getExtension = (filename) =>
  filename.substring(filename.lastIndexOf('.') + 1);

export default function CodeBrowser({ id, documents }) {
  const docRef = useRef(null);
  const [activeDocument, setActiveDocument] = useState(null);

  useEffect(() => {
    const activeDoc = documents.find((doc) => doc.filename === activeDocument);

    if (activeDoc) {
      docRef.current = document.getElementById(`doc-${activeDoc.filename}`);
      Prism.highlightElement(docRef.current);
    }
  }, [activeDocument]);

  return (
    <Tab.Container
      id={id}
      activeKey={activeDocument}
      onSelect={(filename) => setActiveDocument(filename)}
    >
      <Row className="g-2">
        <Col xs={3}>
          <Card body>
            <TreeNode title="./">
              {documents.map((doc) => (
                <TreeNode
                  active={doc.filename === activeDocument}
                  level={1}
                  key={doc.filename}
                  title={doc.filename}
                />
              ))}
            </TreeNode>
          </Card>
        </Col>
        <Col xs={9}>
          <Tab.Content>
            {documents.map((doc) => (
              <Tab.Pane
                eventKey={doc.filename}
                key={doc.filename}
                title={doc.filename}
              >
                <pre
                  id={`doc-${doc.filename}`}
                  className={`language-${getExtension(doc.filename)} mt-0`}
                >
                  {doc.content}
                </pre>
              </Tab.Pane>
            ))}
          </Tab.Content>
        </Col>
      </Row>
    </Tab.Container>
  );
}

CodeBrowser.propTypes = {
  id: PropTypes.string.isRequired,
  documents: PropTypes.arrayOf(PropTypes.object).isRequired
};
