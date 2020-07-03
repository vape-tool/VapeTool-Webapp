export const dva = {
  config: {
    onError(e) {
      e.preventDefault();
    },
  },
  plugins: [REACT_APP_ENV === 'development' ? require('dva-logger')() : {}],
};
