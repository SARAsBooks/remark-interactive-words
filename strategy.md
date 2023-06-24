# Strategy

**remark-interactive-words** is a plugin for remark, a tool that transforms markdown with plugins. It's built to facilitate Engaged Aided Reading (EAR), thereby improving literacy development by enhancing word-specific fluency and comprehension.

Using `remark-a11y-emoji` as a starting point, we will create a plugin that will transform specified words into interactive, clickable links that point to an API with a #slug. 

```js
// index.js
import wordRegex from './word-regex';
import findAndReplace from 'mdast-util-find-and-replace';
import { getWordSlug } from './helper';

function remarkInteractiveWords() {
  function replace(match) {
    return {
      type: 'link',
      url: `#${getWordSlug(match)}`,
      children: [{ type: 'text', value: match }],
    };
  }

  function transform(markdownAST) {
    findAndReplace(markdownAST, wordRegex(), replace);
    return markdownAST;
  }

  return transform;
}

export default remarkInteractiveWords;
```

However, this plugin will incorrectly handle words that are part of a link or code block. We will need a strategy to handle these cases.

## Markdown AST

Consider first the Nodes of `mdast`:

```markdown
*   [Nodes](#nodes)
    *   [`Parent`](#parent)
    *   [`Literal`](#literal)
    *   [`Root`](#root)
    *   [`Paragraph`](#paragraph)
    *   [`Heading`](#heading)
    *   [`ThematicBreak`](#thematicbreak)
    *   [`Blockquote`](#blockquote)
    *   [`List`](#list)
    *   [`ListItem`](#listitem)
    *   [`HTML`](#html)
    *   [`Code`](#code)
    *   [`Definition`](#definition)
    *   [`Text`](#text)
    *   [`Emphasis`](#emphasis)
    *   [`Strong`](#strong)
    *   [`InlineCode`](#inlinecode)
    *   [`Break`](#break)
    *   [`Link`](#link)
    *   [`Image`](#image)
    *   [`LinkReference`](#linkreference)
    *   [`ImageReference`](#imagereference)
```

Our plugin should only transform values in Text Nodes.

```js
interface Literal <: UnistLiteral {
  value: string
}

interface Text <: Literal {
  type: 'text'
}

type PhrasingContent = Break | Emphasis | HTML | Image | ImageReference
  | InlineCode | Link | LinkReference | Strong | Text

type FlowContent =
  Blockquote | Code | Heading | HTML | List | ThematicBreak | Content
```

Because Text Nodes are children of other Nodes, transforming all text nodes will correctly handle words that are in the following Nodes because they are parents of Text Nodes:

- `Paragraph`

   ```js
   interface Paragraph <: Parent {
     type: 'paragraph'
     children: [PhrasingContent]
   }
   ```

- `Heading`

    ```js
    interface Heading <: Parent {
      type: 'heading'
      depth: 1 <= number <= 6
      children: [PhrasingContent]
    }
    ```

- `Blockquote`

    ```js
    interface Blockquote <: Parent {
      type: 'blockquote'
      children: [FlowContent]
    }
    ```

- `ListItem`

    ```js
    interface ListItem <: Parent {
      type: 'listItem'
      spread: boolean?
      children: [FlowContent]
    }
    ```

- `Emphasis`

    ```js
    interface Emphasis <: Parent {
      type: 'emphasis'
      children: [PhrasingContent]
    }
    ```

- `Strong`

    ```js
    interface Strong <: Parent {
      type: 'strong'
      children: [PhrasingContent]
    }
    ```

However, we will need to handle words that are in the following Nodes that shouldn't be transformed because they are also parents of Text Nodes, or may be confused with Text Nodes because they are also Literal Nodes:

- `Code`

    ```js
    interface Code <: Literal {
        type: 'code'
        lang: string?
        meta: string?
    }
    ```

- `InlineCode`

   ```js
   interface InlineCode <: Literal {
     type: 'inlineCode'
   }
   ```

- `Link`

   ```js
   interface Link <: Parent {
     type: 'link'
     children: [PhrasingContent]
   }

   Link includes Resource
   ```

- `Link Reference`

    ```js
    interface LinkReference <: Parent {
      type: 'linkReference'
      children: [PhrasingContent]
    }
    
    LinkReference includes Reference
    ```

- `HTML`

    ```js
    interface HTML <: Literal {
      type: 'html'
    }
    ```

We should also consider if the following Nodes will be affected by the plugin (they shouldn't be):

-  `Definition`

   ```js
   interface Definition <: Node {
     type: 'definition'
   }

   Definition includes Association
   Definition includes Resource
   ```

- `ImageReference`

    ```js
    interface ImageReference <: Parent {
      type: 'imageReference'
    }
    
    ImageReference includes Reference
    ImageReference includes Alternative
    ```

The following Nodes are not parents of Text Nodes, and therefore should not be transformed:

- `ThematicBreak`
- `Break`
- `Image`

## Options

An option should be able to be passed to the plugin to specify which Node to transform to, Link or LinkReference.

```js
// if option is 'link'
function remarkInteractiveWords() {
  function replace(match) {
    return {
      type: 'link',
      url: `#${getWordSlug(match)}`,
      children: [{ type: 'text', value: match }],
    };
  }

  function transform(markdownAST) {
    findAndReplace(markdownAST, wordRegex(), replace);
    return markdownAST;
  }

  return transform;
}
```

```js
// if option is 'linkReference'
function remarkInteractiveWords() {
  function replace(match) {
    const identifier = getWordIdentifier(match);
    const label = getWordLabel(match);
    addDefinition({
        type: 'definition',
        identifier: identifier,
        label: label,
        url: `#${identifier}`,
    });
    return {
      type: 'linkReference',
      identifier: identifier,
      label: label,
      referenceType: 'full',
      children: [{type: 'text', value: match}]
    };
  }

  function transform(markdownAST) {
    findAndReplace(markdownAST, wordRegex(), replace);
    return markdownAST;
  }

  return transform;
}

// TODO: handle adding definitions to the AST
```

## Helper Function

A default helper function specifies which words to transform. The default should be to transform all words longer than 1 character. The helper function should be able to be passed an optional array of exceptions, which should be able to be passed to the plugin as an option.

The default helper function should be able to be overridden by passing a custom helper function to the plugin as an option. The helper function should conform to the following interfaces:

- Input

    ```ts
    interface HelperInput {
      input: string;
      exceptions?: string[];
    }
    ```

- Result

    ```ts
    interface HelperResult {
      text: string;
      isMatch: boolean;
    }
    ```

- returns

    ```ts
    HelperResult[]
    ```

```ts
const wordRegex = /([a-z]+['’][a-z]+)|[a-z]{2,}/gi;

export function getTaggedMatches(
    { input, exceptions }: HelperInput
): HelperResult[] {
    let lastIndex = 0;
    const results: HelperResult[] = [];
    let match: RegExpExecArray | null;

    while ((match = wordRegex.exec(input)) !== null) {
        const isException = exceptions ? exceptions.includes(match[0].toLowerCase()) : false;

        // If it's not an exception, handle it as a match
        if (!isException) {
            // Get the unmatched text before this match
            if (match.index > lastIndex) {
                const nonMatch = input.slice(lastIndex, match.index);
                results.push({ text: nonMatch, isMatch: false });
            }

            // Push the match to the results array
            results.push({ text: match[0], isMatch: true });

            // Update lastIndex to be the end of this match
            lastIndex = match.index + match[0].length;
        }
        // If it's an exception, don't do anything (it will be included in the next non-match)
    }

    // Get any remaining non-matching text after the last match (or exception)
    if (lastIndex < input.length) {
        const nonMatch = input.slice(lastIndex);
        results.push({ text: nonMatch, isMatch: false });
    }

    return results;
}
```

## Implementation

First, import the necessary libraries:

```ts
import { visitParents } from 'unist-util-visit-parents';
import { VFile } from 'vfile';
import { Node } from 'unist';
import { Text, Link, LinkReference, Parent } from 'mdast';
import {
  HelperInput,
  HelperResult,
  getTaggedMatches,
  getWordSlug
} from './helper';
```

Next, define the plugin:

```ts
export interface InteractiveWordsOptions {
  transformTo: 'link' | 'linkReference'
  exceptions?: string[]
  helper?: (input: HelperInput) => HelperResult[]
}

const remarkInteractiveWords = (options: InteractiveWordsOptions) => {
  const { transformTo, exceptions, helper } = options;
  const helperFunction = helper || getTaggedMatches;
  const exceptionsList = exceptions || ['a', 'an', 'the'];

  const transform = (tree: Node, file: VFile) => {
    visitParents(tree, 'text', visitor);
    return tree;
  };

  const visitor = (node: Text, ancestors: Node[]) => {
    for (const excludingNode in [
      'code',
      'inlineCode',
      'link',
      'linkReference',
      'html'
    ]) {
      if (ancestors.some((ancestor) => ancestor.type === excludingNode)) {
        return;
      }
    }
    const parent = ancestors[ancestors.length - 1] as Parent;
    const segments = helperFunction({ input: node.value, exceptions: exceptionsList });
    const newChildren = (segments.map((segment) => {
      if (segment.isMatch) {
        const wordSlug = getWordSlug(segment.text);
        return createNewNode(segment.text, wordSlug, transformTo);
      }
      return { type: 'text', value: segment.text } as Text;
    }));
    const index = parent.children.indexOf(node);
    parent.children.splice(index, 1, ...newChildren);
  };

  return transform;
}

function createNewNode(
  word: string, slug: string, transformTo: 'link' | 'linkReference'
): Link | LinkReference {
  if (transformTo === 'link') {
    return {
      type: 'link',
      url: `#${slug}`,
      children: [{ type: 'text', value: word }],
    };
  } else {
    return {
      type: 'linkReference',
      identifier: slug,
      label: slug,
      referenceType: 'full',
      children: [{ type: 'text', value: word }],
    };
  }
}

export default remarkInteractiveWords;
```

## Testing

The plugin should be tested with AVA. First test:

```ts
const input = 'This is a test.';
const expectedOutput = '[This](#this) [is](#is) a [test](#test).';
String(await remark()
  .use(remarkInteractiveWords, { transformTo: 'linkReference' })
  .process(input)) == expectedOutput
```

Let's write the index.spec.ts file:

```ts
import test from 'ava';
import { remark } from 'remark';
import remarkInteractiveWords, { InteractiveWordsOptions } from './index.js';

test('remarkInteractiveWords transforms words into link references', async (t) => {
    const options: InteractiveWordsOptions = {
        transformTo: 'link'
    };

    const input = 'This is a test.';
    const expectedOutput = '[This](#this) [is](#is) a [test](#test).';

    const result = await remark().use(remarkInteractiveWords, options).process(input);

    t.is(String(result), expectedOutput);
});
```