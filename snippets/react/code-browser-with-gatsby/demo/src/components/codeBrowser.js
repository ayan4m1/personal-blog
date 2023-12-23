import Prism from 'prismjs';
import { uniq } from 'lodash-es';
import PropTypes from 'prop-types';
import { useState, useEffect, useMemo } from 'react';
import { Row, Tab, Col, Card } from 'react-bootstrap';

import DirectoryTree from 'components/directoryTree';
import useSnippets from 'hooks/useSnippets';

const getDirName = (path) => path.substring(0, path.lastIndexOf('/'));

const getExtension = (path) => path.substring(path.lastIndexOf('.') + 1);

export default function CodeBrowser({ id }) {
  const { snippets } = useSnippets();
  const [activeDocument, setActiveDocument] = useState(null);

  useEffect(() => {
    const activeDoc = snippets.find(
      (doc) => doc.path.replace(`${id}/`, '') === activeDocument
    );

    if (activeDoc) {
      Prism.highlightElement(
        document.getElementById(`doc-${activeDoc.path.replace(`${id}/`, '')}`)
      );
    }
  }, [activeDocument]);

  const snippetTree = useMemo(() => {
    const result = {
      path: '.',
      files: [],
      children: []
    };
    const strippedSnippets = snippets.map((doc) => ({
      ...doc,
      path: doc.path.replace(`${id}/`, '')
    }));
    const directories = uniq(
      strippedSnippets.map((doc) => getDirName(doc.path))
    );

    for (const dir of directories) {
      const segments = dir.split('/');

      if (!segments.join('')) {
        continue;
      }

      for (let i = 0; i < segments.length; i++) {
        let node = result;
        const path = segments.slice(0, i + 1);

        for (const segment of path) {
          const nextNode = node.children.find((dir) => dir.path === segment);

          if (nextNode) {
            node = nextNode;
          } else {
            node.children.push({
              path: segment,
              files: [],
              children: []
            });
          }
        }
      }
    }

    for (const doc of strippedSnippets) {
      let node = result;
      const segments = getDirName(doc.path).split('/');

      for (const segment of segments) {
        const nextNode = node.children.find((dir) => dir.path === segment);

        if (nextNode) {
          node = nextNode;
        }
      }

      node.files.push(doc);
    }

    return result;
  }, [snippets]);

  return (
    <Tab.Container
      id={id}
      activeKey={activeDocument}
      onSelect={(path) => setActiveDocument(path)}
    >
      <Row className="g-2">
        <Col xs={3}>
          <Card body>
            <DirectoryTree activeDocument={activeDocument} node={snippetTree} />
          </Card>
        </Col>
        <Col xs={9}>
          <Tab.Content>
            {snippets.map((doc) => (
              <Tab.Pane
                eventKey={doc.path.replace(`${id}/`, '')}
                key={doc.path}
              >
                <pre
                  id={`doc-${doc.path.replace(`${id}/`, '')}`}
                  className={`language-${getExtension(doc.path)} mt-0 rounded`}
                >
                  {doc.code.content}
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
  id: PropTypes.string.isRequired
};
