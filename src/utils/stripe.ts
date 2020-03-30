import { loadStripe } from '@stripe/stripe-js';

// TODO: Move all the codes to some config (preferably provided from server or added in CI step)

export const stripePromise = loadStripe(
  REACT_APP_ENV === 'dev'
    ? 'pk_test_6R9p2evUHfCUA7SBFSRnVhgn00MRL7n42W'
    : 'pk_live_6aEl5xJfYcjSToceZNFOOzpS00OfFURFXA',
);
