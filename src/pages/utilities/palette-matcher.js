import Color from 'color';
import { uniq } from 'lodash-es';
import { useFormik } from 'formik';
import colorNamer from 'color-namer';
import { useCallback, useMemo, useState } from 'react';
import ComplementaryColors from 'complementary-colors';
import { Button, Container, Form, Row } from 'react-bootstrap';

import Layout from 'components/layout';
import ColorSwatch from 'components/palette/swatch';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faConciergeBell } from '@fortawesome/free-solid-svg-icons';
import { closest } from 'color-diff';

const transformColorDiffColor = ({ R: r, G: g, B: b }) => ({
  r,
  g,
  b
});
const transformColor = (obj) => ({
  R: obj.red(),
  G: obj.green(),
  B: obj.blue()
});
const transformColors = (colors) =>
  uniq(colors?.split?.(/[,;\s]/).filter((str) => str.length > 0)).map(
    (rawColor) => parseColor(rawColor)
  );
const parseColor = (rgb) => Color.rgb(rgb);

export default function PaletteMatcherPage() {
  const [complements, setComplements] = useState([]);
  const { values, handleChange, handleSubmit, setFieldValue } = useFormik({
    initialValues: {
      colors: '',
      selectedColor: null
    },
    onSubmit: (vals) => {
      const otherColors = transformColors(vals.colors);
      const selectedColorIndex = otherColors.findIndex(
        (color) => color.hex() === vals.selectedColor
      );

      if (selectedColorIndex >= 0) {
        otherColors.splice(selectedColorIndex, 1);
      }

      const comparator = new ComplementaryColors(vals.selectedColor);
      const complementaryColors = comparator
        .complementary()
        .map((colorObj) => Color(colorObj));

      console.dir(otherColors.map((color) => color.hex()));

      setComplements(
        complementaryColors.map((color) =>
          Color(
            transformColorDiffColor(
              closest(transformColor(color), otherColors.map(transformColor))
            )
          )
        )
      );
    }
  });
  const parsedColors = useMemo(
    () => transformColors(values.colors),
    [values.colors]
  );
  const handleColorSelect = useCallback(
    (hexString) => {
      if (values.selectedColor === hexString) {
        setFieldValue('selectedColor', null);
      } else {
        setFieldValue('selectedColor', hexString);
      }
    },
    [setFieldValue, values.selectedColor]
  );

  return (
    <Layout
      title="Color Palette Matcher"
      description="Find complementary colors from among a list of colors you supply."
    >
      <Container>
        <Row>
          <Form onSubmit={handleSubmit} className="px-0">
            <Form.Group className="mb-3">
              <Form.Label>Colors</Form.Label>
              <Form.Control
                name="colors"
                type="text"
                onChange={handleChange}
                value={values.colors}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Primary Color</Form.Label>
              <Container fluid>
                <Row>
                  {Boolean(parsedColors.length) &&
                    parsedColors.map((color) => {
                      const hexString = color.hex();
                      const {
                        ntc: [{ name: colorName }]
                      } = colorNamer(hexString, {
                        pick: ['ntc']
                      });

                      return (
                        <ColorSwatch
                          key={hexString}
                          name={colorName}
                          color={color}
                          active={hexString === values.selectedColor}
                          onChange={handleColorSelect}
                        />
                      );
                    })}
                </Row>
              </Container>
            </Form.Group>
            {Boolean(values.selectedColor) && (
              <Form.Group className="text-end">
                <Button type="submit" variant="success">
                  <FontAwesomeIcon icon={faConciergeBell} fixedWidth /> Get
                  Suggestions
                </Button>
              </Form.Group>
            )}
          </Form>
        </Row>
        <Row>
          <p>Closest Matching Complementary Colors</p>
          {Boolean(complements.length) &&
            complements.map((color) => {
              const hexString = color.hex();
              const {
                ntc: [{ name: colorName }]
              } = colorNamer(hexString, {
                pick: ['ntc']
              });

              return (
                <ColorSwatch
                  key={hexString}
                  name={colorName}
                  color={color}
                  onChange={() => {}}
                />
              );
            })}
        </Row>
      </Container>
    </Layout>
  );
}
