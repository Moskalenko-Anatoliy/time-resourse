function parseJwt(token) {
  return JSON.parse( atob( token.split('.')[1] ) );
};

export { parseJwt };