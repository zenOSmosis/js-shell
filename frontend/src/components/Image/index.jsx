import React  from 'react';

// TODO: Incorporate react-svg for better SVG manipulation
// @see https://www.npmjs.com/package/react-svg

export default Image = (props = {}) => {
  let {alt, title, src} = props;
  alt = alt || '';
  title = title || alt;

  return (
    <img
      {...props}
      alt={alt}
      title={title}
      src={src}
    />
  );
};