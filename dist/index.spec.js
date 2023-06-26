import test from 'ava';
import { remark } from 'remark';
import remarkInteractiveWords from './index.js';
const options = {
    transformTo: 'link'
};
const input = 'This is a test.';
const expectedOutput = '[This](#this) [is](#is) a [test](#test).';
test('remarkInteractiveWords transforms words into link references', async (t) => {
    const result = await remark().use(remarkInteractiveWords, options).process(input);
    t.is(String(result), expectedOutput);
});
