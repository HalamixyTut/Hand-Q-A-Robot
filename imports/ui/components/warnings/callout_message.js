import React from 'react';
import PropTypes from 'prop-types';

const CallOutMessage = ({ title, description, isSuccess }) => (
  <div className={isSuccess ? 'callout callout-success':'callout callout-danger'} >
    {title && <h4>{title}</h4>}
    <p>{description}</p>
  </div>

);

CallOutMessage.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  isSuccess:PropTypes.bool,
};

export default CallOutMessage;
