import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import './InteractiveTile.css';

const InteractiveTile = ({ to, icon, title, subtitle, onClick }) => {
  const [ripples, setRipples] = useState([]);
  const tileRef = useRef(null);

  const handleClick = (e) => {
    const rect = tileRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newRipple = {
      x,
      y,
      id: Date.now(),
    };

    setRipples([...ripples, newRipple]);

    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
    }, 600);

    if (onClick) onClick(e);
  };

  const content = (
    <>
      <div className="tile-icon-chip" aria-hidden="true">
        {icon}
      </div>
      <div className="tile-content">
        <div className="tile-title">{title}</div>
        {subtitle && <div className="tile-subtitle">{subtitle}</div>}
      </div>
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="tile-ripple"
          style={{
            left: ripple.x,
            top: ripple.y,
          }}
        />
      ))}
    </>
  );

  const commonProps = {
    ref: tileRef,
    className: 'interactive-tile',
    onClick: handleClick,
    role: 'button',
    tabIndex: 0,
    'aria-label': subtitle ? `${title}: ${subtitle}` : title,
    onKeyDown: (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleClick(e);
      }
    },
  };

  if (to) {
    return (
      <Link to={to} {...commonProps}>
        {content}
      </Link>
    );
  }

  return <button {...commonProps}>{content}</button>;
};

InteractiveTile.propTypes = {
  to: PropTypes.string,
  icon: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  onClick: PropTypes.func,
};

InteractiveTile.defaultProps = {
  to: null,
  subtitle: null,
  onClick: null,
};

export default InteractiveTile;
