import { wireGenerator } from '@vapetool/types';
import Coil from '../src/models/coil';

require('util').inspect.defaultOptions.depth = null;

describe('WireGenerator', () => {
  it('coil empty constructor should fill everything', async () => {
    const coil = wireGenerator.normalCoil();
    console.dir(coil);
    coil.instanceOf(Coil);
  });
});
