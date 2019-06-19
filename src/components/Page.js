import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withRouter } from 'react-router-dom';
import { connect } from "react-redux";

function Page({
  children, 
  color, 
  background,
  location: {
    state,
  },
}) {
  const cx = classNames({
    page: true,
    'page--prev': state && state.prev,
  });
  return (
    <section 
      className={cx}
      style={{
        color,
        background,
      }}
    >
    TESTblahblah!
      {children}
    </section>
  );
}

Page.propTypes = {
  children: PropTypes.node.isRequired,
  color: PropTypes.string,
  background: PropTypes.string,
};

Page.defaultProps = {
};

const mapStateToProps = state => ({
  pathname: state.router.location.pathname,
  search: state.router.location.search,
  hash: state.router.location.hash,
  location: state.router.location,
})

export default connect(mapStateToProps)(Page)