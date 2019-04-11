const parseURL = (url) => {
  const parser = document.createElement('a');
  parser.href = url;

  /*
  parser.protocol; // => "http:"
  parser.hostname; // => "example.com"
  parser.port;     // => "3000"
  parser.pathname; // => "/pathname/"
  parser.search;   // => "?search=test"
  parser.hash;     // => "#hash"
  parser.host;     // => "example.com:3000"
  */

  return parser;
};

export default parseURL;