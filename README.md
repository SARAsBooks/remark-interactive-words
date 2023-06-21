# ![remark][logo]

[![Build][build-badge]][build]
[![Coverage][coverage-badge]][coverage]
[![Downloads][downloads-badge]][downloads]
[![Size][size-badge]][size]
[![Sponsors][sponsors-badge]][collective]
[![Backers][backers-badge]][collective]
[![Chat][chat-badge]][chat]

**remark-interactive-words** is a plugin for remark, a tool that transforms markdown with plugins. This plugin is designed to transform specified words into interactive, clickable links that point to an API with a #slug. It's built to facilitate Engaged Aided Reading (EAR), thereby improving literacy development by enhancing word-specific fluency and comprehension.

## Feature highlights

*   [x] **Easy Integration** - Seamlessly integrate with existing remark projects.
*   [x] **Interactivity** - Enhances engagement with interactive word links.
*   [x] **Educational Tool** - Assists in literacy development in an engaging manner.
*   [x] **ASTs** - Manipulates and modifies abstract syntax trees with ease.

## Intro

Like remark, remark-interactive-words also works with markdown as structured data, specifically abstract syntax trees (ASTs). This plugin can inspect and modify these trees to provide the interactive functionality. You can integrate it with your existing remark plugins to achieve greater functionality.

*   to learn markdown, see this [cheatsheet and tutorial][cheat]
*   for more about us, see [`unifiedjs.com`][site]
*   for updates, see [Twitter][]
*   for questions, see [support][]
*   to help, see [contribute][] or [sponsor][] below

## Contents

*   [What is this?](#what-is-this)
*   [When should I use this?](#when-should-i-use-this)
*   [Installation](#installation)
*   [Usage](#usage)
*   [Example](#example)
*   [Compatibility](#compatibility)
*   [Security](#security)
*   [Contribute](#contribute)
*   [Sponsor](#sponsor)
*   [License](#license)

## What is this?

With this plugin, you can turn regular words in your markdown into clickable links that point to an API with a #slug:

```markdown
The quick brown fox jumps over the lazy dog.
```

…into the following HTML with interactive words:

```html
<p>The <a href="api_url/#quick">quick</a> brown <a href="api_url/#fox">fox</a> jumps over the lazy <a href="api_url/#dog">dog</a>.</p>
```

<details><summary>Show example code</summary>

```js
import {unified} from 'unified'
import remarkParse from 'remark-parse'
import remarkInteractiveWords from 'remark-interactive-words'
import remarkHtml from 'remark-html'

const file = await unified()
    .use(remarkParse)
    .use(remarkInteractiveWords, {apiUrl: 'your_api_url'})
    .use(remarkHtml)
    .process('The quick brown fox jumps over the lazy dog.')

console.log(String(file)) // => '<p>The <a href="your_api_url/#quick">quick</a> brown <a href="your_api_url/#fox">fox</a> jumps over the lazy <a href="your_api_url/#dog">dog</a>.</p>'
```

</details>

## When should I use this?

Use this plugin when you want to enhance the readability of your content and promote interactive reading. It's particularly useful in educational and learning contexts where you want readers to learn

 more about specific words.

## Installation

This package is ESM only. In Node.js (version 12.20+, 14.14+, or 16.0+), install with [npm](https://docs.npmjs.com/cli/install):

```sh
npm install remark-interactive-words
```

## Usage

Say we have the following file, `example.md`:

```markdown
The quick brown fox jumps over the lazy dog.
```

And our script, `example.js`, looks as follows:

```js
import {unified} from 'unified'
import remarkParse from 'remark-parse'
import remarkInteractiveWords from 'remark-interactive-words'
import remarkHtml from 'remark-html'
import {read} from 'to-vfile'

main()

async function main() {
  const file = await unified()
    .use(remarkParse)
    .use(remarkInteractiveWords, {apiUrl: 'your_api_url'})
    .use(remarkHtml)
    .process(await read('example.md'))

  console.log(String(file))
}
```

Now, running `node example` yields:

```html
<p>The <a href="your_api_url/#quick">quick</a> brown <a href="your_api_url/#fox">fox</a> jumps over the lazy <a href="your_api_url/#dog">dog</a>.</p>
```

## Compatibility

This project is compatible with all maintained versions of Node.js. As of now, that is Node.js 12.20+, 14.14+, and 16.0+. It may work with older versions, but this is not guaranteed.

## Contribute

See [`contributing.md`][contributing] in [`remarkjs/.github`][health] for ways to get started. See [`support.md`][support] for ways to get help. Join us in [Discussions][chat] to chat with the community and contributors.

This project has a [code of conduct][coc]. By interacting with this repository, organization, or community you agree to abide by its terms.

## Sponsor

Support this effort and give back by sponsoring on [OpenCollective][collective]!

## License

[MIT](license) © [Russ Fugal](https://sara.ai/about.html)
