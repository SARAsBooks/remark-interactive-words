# remark-interactive-words
  
![remark][logo]

`remark-interactive-words` is a plugin for `remark`. It's built to facilitate Aided Reading (AR) on digital devices.

## Intro

Designed to transform markdown by replacing [words](#slug) with interactive, clickable links with a `#slug` for programatic use, `remark-interactive-words` is developed by [Russ Fugal](https://sara.ai/about.html) for [SARAs Books LLC](https://sara.ai) to support Aided Reading (AR) automation. This plugin integrates seamlessly with the remarkable ecosystem.

* to learn markdown, see this [cheatsheet and tutorial][cheat]
* for more about the `remark` ecosystem, see [`unifiedjs.com`][site]
* to help, see [contribute] or [sponsor] below

## Contents

* [What is this?](#what-is-this)
* [When should I use this?](#when-should-i-use-this)
* [API](#api)
  * [`remark().use(remarkToc, options)`](#remarkuseremarktoc-options)
  * [`slug`](#slug)
  * [`interface InteractiveWordsOptions`](#interface-interactivewordsoptions)
* [Examples](#examples)
  * [Example: 'This is a test.'](#example-this-is-a-test)
* [Syntax](#syntax)
* [Syntax tree](#syntax-tree)
* [Types](#types)
* [Contribute](#contribute)
* [Sponsor](#sponsor)
* [License](#license)

## What is this?

[unified] is a project that transforms content with abstract syntax trees (ASTs). [remark] adds support for markdown to unified. [mdast] is a specification for representing markdown in a syntax tree. It implements [unist]. It can represent several flavours of markdown, such as CommonMark and GitHub Flavored Markdown.

`remark-interactive-words` leverages `mdast`, inspecting and modifying the AST to create its interactive functionality. This plugin works with markdown as structured data.

## When should I use this?

`remark-interactive-words` is a plugin for `remark`. It's built to facilitate Aided Reading (AR) on digital devices. You can easily integrate it with your existing remark plugins to achieve a word-wise interactivity and functionality in your markdown documents.

## API

To install the `remark-interactive-words` plugin, run the following command in your terminal:

```bash
npm install remark-interactive-words
```

The default export is `remarkInteractiveWords`.

### `remark().use(remarkToc, options)`

Generate markdown with linked words.
Looks for all Text Nodes and transforms all but decendents of `excludingNodes`.

```ts
const excludingNodes = [
    'code',
    'inlineCode',
    'link',
    'linkReference',
    'html'
]
```

### `slug`

Matches words with `wordRegex` and transforms them to `transformTo` Nodes with a `#slug` for programatic use.

```ts
const wordRegex = /([a-z]+['’][a-z]+)|[a-z]{2,}/gi;

function getWordSlug(word: string): string {
    return word.toLowerCase().replace("’", "'");
}
```

### `interface InteractiveWordsOptions`

Via the options object, you can customize the behavior of `remark-interactive-words`. Specific words can be excluded from transformation by passing an array of words to `exceptions`. You can also customize the transformation by passing a `helper` function. The helper function is called with a HelperInput object and should return an array of `HelperResult` objects.

```ts
interface InteractiveWordsOptions {
  transformTo: 'link' | 'linkReference'
  exceptions?: string[] // array of words to exclude from transformation
  helper?: (input: HelperInput) => HelperResult[]
}

interface HelperInput {
    input: string;
    exceptions?: string[];
}

interface HelperResult {
    text: string;
    transform: boolean;
    wordSlug?: string;
}
```

## Examples

### Example: 'This is a test.'

After installation, you can require and use `remark-interactive-words` as follows:

```ts
import { remark } from 'remark';
import remarkInteractiveWords from 'remark-interactive-words';
import { InteractiveWordsOptions } from 'remark-interactive-words';

const options: InteractiveWordsOptions = {
    transformTo: 'link'
};

const input = 'This is a test.';
const expectedOutput = '[This](#this) [is](#is) a [test](#test).';

const processor = remark().use(remarkInteractiveWords);
const output = processor.processSync(input);

expect(String(output)).toEqual(expectedOutput);
```

## Syntax

## Syntax tree

## Types

## Contribute

We welcome contributions to `remark-interactive-words`. Please see the [contributing guidelines] for more information.

## Sponsor

`remark-interactive-words` is an open source project that is supported by the community. If you find it useful, please consider supporting us via [GitHub Sponsors]().

## License

[MIT](license) © [Russ Fugal](https://sara.ai/about.html)

<!-- Definitions -->

[logo]: https://raw.githubusercontent.com/remarkjs/remark/1f338e72/logo.svg?sanitize=true

[site]: https://unifiedjs.com

[cheat]: https://commonmark.org/help/

[unified]: https://github.com/unifiedjs/unified

[remark]: https://github.com/remarkjs/remark

[mdast]: https://github.com/syntax-tree/mdast

[contribute]: #contribute

[sponsor]: #sponsor
