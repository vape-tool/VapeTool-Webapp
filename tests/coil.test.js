import Coil from '../src/models/coil';

describe('Coil', () => {
  it('coil empty constructor should fill everything', () => {
    const coil = new Coil();
    console.log(coil);
    expect(coil).toBeTruthy();
  });
});
