import Prism from 'prismjs';
import PropTypes from 'prop-types';
import { useState, useEffect, useRef } from 'react';
import { Tab, Tabs } from 'react-bootstrap';

const getExtension = (filename) =>
  filename.substring(filename.lastIndexOf('.') + 1);

export default function CodeBrowser({ key, documents }) {
  const docRef = useRef(null);
  const [activeDocument, setActiveDocument] = useState(documents[0].filename);

  useEffect(() => {
    const activeDoc = documents.find((doc) => doc.filename === activeDocument);

    if (activeDoc) {
      docRef.current = document.getElementById(`doc-${activeDoc.filename}`);
      Prism.highlightElement(docRef.current);
    }
  }, [activeDocument]);

  return (
    <Tabs
      id={key}
      activeKey={activeDocument}
      onSelect={(filename) => setActiveDocument(filename)}
    >
      {documents.map((doc) => (
        <Tab eventKey={doc.filename} key={doc.filename} title={doc.filename}>
          <pre
            id={`doc-${doc.filename}`}
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
