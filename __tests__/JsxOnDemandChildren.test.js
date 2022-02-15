'use strict';

const transformerWithOptions = require('./transformerWithOptions');
const fs = require('fs');
const path = require('path');


/**
 * Extend Jest with a custom snapshot serializer to provide additional context
 * and reduce the amount of escaping that occurs.
 */
const FIXTURE_TAG = Symbol.for('FIXTURE_TAG');
expect.addSnapshotSerializer({
  print(value) {
    return Object.keys(value)
      .map(key => `~~~~~~~~~~ ${key.toUpperCase()} ~~~~~~~~~~\n${value[key]}`)
      .join('\n');
  },
  test(value) {
    return value && value[FIXTURE_TAG] === true;
  },
});


const fixturesPath = `${__dirname}/fixtures`

const validFixturesPath = path.join(fixturesPath, 'valid');
const validFixtures = fs.readdirSync(validFixturesPath);
test.each(validFixtures)('matches expected output: %s', file => {
  const input = fs.readFileSync(path.join(validFixturesPath, file), 'utf8');
  const output = transformerWithOptions({})(input, file);

  expect({
    [FIXTURE_TAG]: true,
    input,
    output,
  }).toMatchSnapshot();
});


const errorFixturesPath = path.join(fixturesPath, 'error');
const errorFixtures = fs.readdirSync(errorFixturesPath);
test.each(errorFixtures)('matches expected output: %s', file => {
  const input = fs.readFileSync(path.join(errorFixturesPath, file), 'utf8');

  const outputFunc = () => transformerWithOptions({})(input, file);

  expect(outputFunc).toThrowErrorMatchingSnapshot();
});