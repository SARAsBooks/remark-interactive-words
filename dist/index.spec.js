import test from 'ava';
import { remark } from 'remark';
import remarkInteractiveWords from './index.js';
test('remarkInteractiveWords transforms words into link references', async (t) => {
    const options = {
        transformTo: 'link'
    };
    const input = 'This is a test.';
    const expectedOutput = '[This](#this) [is](#is) a [test](#test).';
    const result = await remark().use(remarkInteractiveWords, options).process(input);
    t.is(String(result).trim().toString(), expectedOutput);
});
test('remarkInteractiveWords handles emphasis', async (t) => {
    const options = {
        transformTo: 'link'
    };
    const input = 'This *is* a test.';
    const expectedOutput = '[This](#this) *[is](#is)* a [test](#test).';
    const result = await remark().use(remarkInteractiveWords, options).process(input);
    t.is(String(result).trim().toString(), expectedOutput);
});
test('remarkInteractiveWords handles strong', async (t) => {
    const options = {
        transformTo: 'link'
    };
    const input = '**This** is a test.';
    const expectedOutput = '**[This](#this)** [is](#is) a [test](#test).';
    const result = await remark().use(remarkInteractiveWords, options).process(input);
    t.is(String(result).trim().toString(), expectedOutput);
});
test('remarkInteractiveWords handles code', async (t) => {
    const options = {
        transformTo: 'link'
    };
    const input = 'This is a `test`.';
    const expectedOutput = '[This](#this) [is](#is) a `test`.';
    const result = await remark().use(remarkInteractiveWords, options).process(input);
    t.is(String(result).trim().toString(), expectedOutput);
});
test('remarkInteractiveWords handles README', async (t) => {
    const options = {
        transformTo: 'linkReference'
    };
    const input = `## Intro

Designed to transform markdown by replacing [words](#slug) with interactive, clickable links with a \`#slug\` for programatic use, \`remark-interactive-words\` is developed by [Russ Fugal](https://sara.ai/about.html) for [SARAs Books LLC](https://sara.ai) to support Aided Reading (AR) automation. This plugin integrates seamlessly with the remark ecosystem.`;
    const expectedOutput = `## [Intro][intro]

[Designed][designed] [to][to] [transform][transform] [markdown][markdown] [by][by] [replacing][replacing] [words](#slug) [with][with] [interactive][interactive], [clickable][clickable] [links][links] [with][with] a \`#slug\` [for][for] [programatic][programatic] [use][use], \`remark-interactive-words\` [is][is] [developed][developed] [by][by] [Russ Fugal](https://sara.ai/about.html) [for][for] [SARAs Books LLC](https://sara.ai) [to][to] [support][support] [Aided][aided] [Reading][reading] ([AR][ar]) [automation][automation]. [This][this] [plugin][plugin] [integrates][integrates] [seamlessly][seamlessly] [with][with] the [remark][remark] [ecosystem][ecosystem].

[intro]: #intro "{ url: #intro, documentCount: 1 }"

[designed]: #designed "{ url: #designed, documentCount: 1 }"

[to]: #to "{ url: #to, documentCount: 2 }"

[transform]: #transform "{ url: #transform, documentCount: 1 }"

[markdown]: #markdown "{ url: #markdown, documentCount: 1 }"

[by]: #by "{ url: #by, documentCount: 2 }"

[replacing]: #replacing "{ url: #replacing, documentCount: 1 }"

[with]: #with "{ url: #with, documentCount: 3 }"

[interactive]: #interactive "{ url: #interactive, documentCount: 1 }"

[clickable]: #clickable "{ url: #clickable, documentCount: 1 }"

[links]: #links "{ url: #links, documentCount: 1 }"

[for]: #for "{ url: #for, documentCount: 2 }"

[programatic]: #programatic "{ url: #programatic, documentCount: 1 }"

[use]: #use "{ url: #use, documentCount: 1 }"

[is]: #is "{ url: #is, documentCount: 1 }"

[developed]: #developed "{ url: #developed, documentCount: 1 }"

[support]: #support "{ url: #support, documentCount: 1 }"

[aided]: #aided "{ url: #aided, documentCount: 1 }"

[reading]: #reading "{ url: #reading, documentCount: 1 }"

[ar]: #ar "{ url: #ar, documentCount: 1 }"

[automation]: #automation "{ url: #automation, documentCount: 1 }"

[this]: #this "{ url: #this, documentCount: 1 }"

[plugin]: #plugin "{ url: #plugin, documentCount: 1 }"

[integrates]: #integrates "{ url: #integrates, documentCount: 1 }"

[seamlessly]: #seamlessly "{ url: #seamlessly, documentCount: 1 }"

[remark]: #remark "{ url: #remark, documentCount: 1 }"

[ecosystem]: #ecosystem "{ url: #ecosystem, documentCount: 1 }"`;
    const result = await remark().use(remarkInteractiveWords, options).process(input);
    t.is(String(result).trim().toString(), expectedOutput);
});
