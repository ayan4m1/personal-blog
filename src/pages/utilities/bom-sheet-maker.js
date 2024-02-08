import { Col, Container, Row } from 'react-bootstrap';
import { useFormik } from 'formik';
import { useState } from 'react';
import { number, object } from 'yup';

import Layout from 'components/layout';
import Grid from 'components/bom-sheet-maker/grid';
import Sidebar from 'components/bom-sheet-maker/sidebar';

const validationSchema = object().shape({
  columns: number()
    .min(1, 'Cannot have less than one column.')
    .max(6, 'Cannot have more than six columns.'),
  height: number().min(100, 'Height cannot be less than 100px.')
});

export default function BOMSheetMakerPage() {
  const [groups, setGroups] = useState([]);
  const formContext = useFormik({
    initialValues: {
      columns: 2,
      height: 200,
      bomText: ''
    },
    validationSchema
  });

  return (
    <Layout
      title="BOM Sheet Maker"
      description="Generate a printable parts placement sheet from a BOM."
    >
      <Container fluid>
        <Row>
          <Col xs={3} className="d-print-none">
            <Sidebar
              formContext={formContext}
              groups={groups}
              setGroups={setGroups}
            />
          </Col>
          <Col>
            <Grid {...formContext.values} groups={groups} />
          </Col>
        </Row>
      </Container>
    </Layout>
  );
}
