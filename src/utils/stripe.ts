import { loadStripe } from '@stripe/stripe-js';
import { IS_PRODUCTION } from './utils';

// TODO: Move all the codes to some config (preferably provided from server or added in CI step)

export const stripePromise = loadStripe(
  IS_PRODUCTION
    ? 'pk_live_6aEl5xJfYcjSToceZNFOOzpS00OfFURFXA'
    : 'pk_test_6R9p2evUHfCUA7SBFSRnVhgn00MRL7n42W',
);
