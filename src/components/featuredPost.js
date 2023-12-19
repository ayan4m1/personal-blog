import { format, parseISO } from 'date-fns';
import { Link } from 'gatsby';
import PropTypes from 'prop-types';
import { Row, Col } from 'react-bootstrap';

export default function FeaturedPost({ image, date, path, title, excerpt }) {
  return (
    <Row>
      <Col md={1}></Col>
      <Col md={5}>{image}</Col>
      <Col md={5}>
        <div className="mt-5">
          <Link to={path}>
            <h5>{title}</h5>
          </Link>
          {Boolean(date) && (
            <p>Published on {format(parseISO(date), 'yyyy-MM-dd')}</p>
          )}
          {Boolean(excerpt) && <p>{excerpt}</p>}
        </div>
      </Col>
      <Col md={1}></Col>
    </Row>
  );
}

FeaturedPost.propTypes = {
  image: PropTypes.node,
  date: PropTypes.string,
  path: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  excerpt: PropTypes.string
};
