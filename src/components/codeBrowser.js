import Prism from 'prismjs';
import PropTypes from 'prop-types';
import { useState, useEffect, useRef } from 'react';
import { Tab, Tabs } from 'react-bootstrap';

const getExtension = (filename) =>
  filename.substring(filename.lastIndexOf('.') + 1);

export default function CodeBrowser({ key, documents }) {
  const docRef = useRef(null);
  const [activeDocument, setActiveDocument] = useState(documents[0].id);

  useEffect(() => {
    docRef.current = document.getElementById(activeDocument);
    Prism.highlightElement(docRef.current);
  }, [activeDocument]);

  return (
    <Tabs
      id={key}
      activeKey={activeDocument}
      onSelect={(doc) => setActiveDocument(doc)}
    >
      {documents.map((doc) => (
        <Tab eventKey={doc.id} key={doc.id} title={doc.filename}>
          <pre
            id={doc.id}
            className={`language-${getExtension(doc.filename)} mt-0`}
          >
            {doc.content}
          </pre>
        </Tab>
      ))}
    </Tabs>
  );
}

CodeBrowser.propTypes = {
  key: PropTypes.string.isRequired,
  documents: PropTypes.arrayOf(PropTypes.object).isRequired
};
