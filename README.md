# remark-interactive-words
  
![remark][logo]

`remark-interactive-words` is a plugin for `remark`. It's built to facilitate Aided Reading (AR) on digital devices.

## Intro

Designed to transform markdown by replacing [words](#) with interactive, clickable links with a `#slug` for programatic use, `remark-interactive-words` is developed by [Russ Fugal](https://sara.ai/about.html) for [SARAs Books LLC](https://sara.ai) to support Aided Reading (AR) automation. This plugin integrates seamlessly with the remarkable ecosystem.

* to learn markdown, see this [cheatsheet and tutorial][cheat]
* for more about the `remark` ecosystem, see [`unifiedjs.com`][site]
* to help, see [contribute][] or [sponsor][] below

## Contents

*   [What is this?](#what-is-this)
*   [When should I use this?](#when-should-i-use-this)
*   [API](#api)
*   [Examples](#examples)
    *   [Example: turning markdown into HTML](#example-turning-markdown-into-html)
    *   [Example: support for GFM and frontmatter](#example-support-for-gfm-and-frontmatter)
    *   [Example: checking markdown](#example-checking-markdown)
    *   [Example: checking and formatting markdown on the CLI](#example-checking-and-formatting-markdown-on-the-cli)
*   [Syntax](#syntax)
*   [Syntax tree](#syntax-tree)
*   [Types](#types)
*   [Contribute](#contribute)
*   [Sponsor](#sponsor)
*   [License](#license)

## What is this?

[unified] is a project that transforms content with abstract syntax trees (ASTs). [remark] adds support for markdown to unified. mdast is the markdown AST that remark uses. This is a remark plugin that transforms mdast.

`remark-interactive-words` leverages abstract syntax trees (ASTs), inspecting and modifying these trees to create its interactive functionality. This plugin works with markdown as structured data, similar to how the parent tool, `remark`, operates. You can easily integrate it with your existing remark plugins to achieve a higher level of interactivity and functionality in your markdown documents.

## When should I use this?

To install the `remark-interactive-words` plugin, run the following command in your terminal:

```shell
npm install remark-interactive-words
```

## API

After installation, you can require and use `remark-interactive-words` as follows:

```javascript
var remark = require('remark');
var interactiveWords = require('remark-interactive-words');

remark()
  .use(interactiveWords)
  .process(yourMarkdownString, function(err, file) {
    if (err) throw err;
    console.log(String(file));
  });
```

## Examples

You can customize the behavior of `remark-interactive-words` by passing an options object when calling `remark().use(interactiveWords, options)`. The options are:

## Syntax

## Syntax tree

## Types

## Contribute

We welcome contributions to `remark-interactive-words`. Please see the [contributing guidelines](CONTRIBUTING.md) for more information.

## Sponsor

`remark-interactive-words` is an open source project that is supported by the community. If you find it useful, please consider supporting us via [GitHub Sponsors]().

## License

[MIT](license) © [Russ Fugal](https://sara.ai/about.html)

<!-- Definitions -->

[logo]: https://raw.githubusercontent.com/remarkjs/remark/1f338e72/logo.svg?sanitize=true

[site]: https://unifiedjs.com

[cheat]: https://commonmark.org/help/

[contributing]: https://github.com/remarkjs/.github/blob/main/contributing.md

[coc]: https://github.com/remarkjs/.github/blob/main/code-of-conduct.md

[typescript]: https://www.typescriptlang.org

[topic]: https://github.com/topics/remark-plugin

[popular]: https://www.npmtrends.com/remark-parse-vs-marked-vs-micromark-vs-markdown-it

[types-mdast]: https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/mdast

[unified]: https://github.com/unifiedjs/unified

[remark]: https://github.com/remarkjs/remark

[remark-toc]: https://github.com/remarkjs/remark-toc

[remark-rehype]: https://github.com/remarkjs/remark-rehype

[remark-html]: https://github.com/remarkjs/remark-html

[rehype]: https://github.com/rehypejs/rehype

[mdast]: https://github.com/syntax-tree/mdast

[remark-parse]: packages/remark-parse/

[remark-stringify]: packages/remark-stringify/

[syntax]: #syntax

[syntax-tree]: #syntax-tree

[plugins]: #plugins

[contribute]: #contribute

[sponsor]: #sponsor