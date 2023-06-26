import { VFile } from 'vfile';
import { Node } from 'unist';
import { visit, SKIP } from 'unist-util-visit';
import { Text, Link, LinkReference, Parent, Root } from 'mdast';
import {
  HelperInput,
  HelperResult,
  getTaggedMatches,
} from './helper.js';

export interface InteractiveWordsOptions {
  transformTo: 'link' | 'linkReference'
  exceptions?: string[]
  helper?: (input: HelperInput) => HelperResult[]
}


const remarkInteractiveWords = (options: InteractiveWordsOptions) => {
  const { transformTo, exceptions, helper } = options;
  const helperFunction = helper || getTaggedMatches;
  const exceptionsList = exceptions || ['a', 'an', 'the'];

  const referenceCount: {
    [key: string]: number
  } = {};

  const transform = async (tree: Node, file: VFile) => {
    visit(tree, (node, index, parent) => {
      index = index as number;
      const excludingNodes = [
        'code',
        'inlineCode',
        'link',
        'linkReference',
        'html'
      ]
      for (const excludingNode of excludingNodes) {
        if (node.type == excludingNode) {
          return SKIP;
        }
      }
      if (node.type === 'text' && index !== null) {
        return visitor(node as Text, index, parent);
      }
    });
    for (const [key, value] of Object.entries(referenceCount)) {
      if (transformTo == 'linkReference' && value > 0) {
        (tree as Root).children.push({
          type: 'definition',
          identifier: key,
          label: key,
          url: `#${key}`,
          title: `{ url: #${key}, documentCount: ${value} }`,
        })
      }
    }
    return tree;
  };

  const visitor = (node: Text, index: number, parent: Parent) => {
    const segments = helperFunction({ input: node.value, exceptions: exceptionsList });
    const newChildren = (segments.map((segment) => {
      if (segment.transform && segment.wordSlug) {
        referenceCount[segment.wordSlug] = referenceCount[segment.wordSlug] + 1 || 1;
        return createNewNode(segment.text, segment.wordSlug, transformTo);
      }
      return { type: 'text', value: segment.text } as Text;
    }));
    parent.children.splice(index, 1, ...newChildren);
    return newChildren.length + index;
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
