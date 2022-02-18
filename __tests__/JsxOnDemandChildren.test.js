'use strict';
import JsxOnDemandChildrenPlugin from "../src/index";
import { transformerWithOptions, snapshotSerializer, FIXTURE_TAG } from './transformerWithOptions';
import { readdirSync, readFileSync } from 'fs';
import { join } from 'path';


expect.addSnapshotSerializer(snapshotSerializer);


const fixturesPath = `${__dirname}/fixtures/plugin`;

const validFixturesPath = join(fixturesPath, 'valid');
const validFixtures = readdirSync(validFixturesPath);

const plugin = JsxOnDemandChildrenPlugin;
const pluginOpts = {};
test.each(validFixtures)('matches expected output: %s', file => {
  const input = readFileSync(join(validFixturesPath, file), 'utf8');
  const output = transformerWithOptions([[plugin, pluginOpts]])(input, file);

  expect({
    [FIXTURE_TAG]: true,
    input,
    output,
  }).toMatchSnapshot();
});


const errorFixturesPath = join(fixturesPath, 'error');
const errorFixtures = readdirSync(errorFixturesPath);
test.each(errorFixtures)('matches expected output: %s', file => {
  const input = readFileSync(join(errorFixturesPath, file), 'utf8');

  const outputFunc = () => transformerWithOptions([[plugin, pluginOpts]])(input, file);

  expect(outputFunc).toThrowErrorMatchingSnapshot();
});