const copy = require('../copy');

describe('Module information', () => {
  test('Name', () => {
    expect(copy.name).toEqual('copy');
  });

  test('Display Name', () => {
    expect(copy.display_name).toEqual('Copy');
  });

  test('Description', () => {
    expect(copy.description).toEqual('Copies the contents of the data verbatim');
  });
});

describe('Transformer', () => {
  test('Name', () => {
    const instance = new copy.Transformer();

    expect(instance.name).toEqual('copy');
  });

  test('Transform', () => {
    const instance = new copy.Transformer();
    const data = 'This is sample data';

    expect(instance.transform(data)).toEqual(data);
  });
});