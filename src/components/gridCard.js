import PropTypes from 'prop-types';
import { Card, Container, Row, Col, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExternalLinkSquare } from '@fortawesome/free-solid-svg-icons';
import { faGithub } from '@fortawesome/free-brands-svg-icons';

export default function GridCard({
  title,
  category,
  icon,
  svgIcon,
  children,
  githubUrl,
  url,
  showUrl = false
}) {
  return (
    <Card className="mb-2">
      <Card.Title className="bg-primary text-light p-2 rounded-top mb-0">
        <Container fluid>
          <Row>
            <Col xs={8} className="d-flex align-items-center">
              {Boolean(svgIcon) && (
                <img
                  src={svgIcon}
                  alt={category}
                  className="me-2"
                  style={{ height: 32 }}
                />
              )}
              {Boolean(icon) && (
                <FontAwesomeIcon icon={icon} className="me-2" />
              )}{' '}
              {title}
            </Col>
            <Col xs={4} className="d-flex justify-content-end">
              {Boolean(url) && (
                <Button
                  as="a"
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  size="sm"
                  className="me-2"
                  variant="info"
                >
                  {showUrl && url.replace(/https?:\/\//, '').replace(/\/$/, '')}{' '}
                  <FontAwesomeIcon icon={faExternalLinkSquare} />
                </Button>
              )}
              {Boolean(githubUrl) && (
                <Button
                  as="a"
                  href={githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  size="sm"
                  variant="info"
                >
                  <FontAwesomeIcon icon={faGithub} />
                </Button>
              )}
            </Col>
          </Row>
        </Container>
      </Card.Title>
      <Card.Body>{children}</Card.Body>
    </Card>
  );
}

GridCard.propTypes = {
  title: PropTypes.string.isRequired,
  category: PropTypes.string.isRequired,
  icon: PropTypes.object,
  svgIcon: PropTypes.object,
  children: PropTypes.node.isRequired,
  githubUrl: PropTypes.string,
  url: PropTypes.string,
  showUrl: PropTypes.bool
};
