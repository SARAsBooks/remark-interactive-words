import { VFile } from 'vfile';
import { Node } from 'unist';
import { visitParents } from 'unist-util-visit-parents';
import { Text, Link, LinkReference, Parent, Root } from 'mdast';
import {
  HelperInput,
  HelperResult,
  getTaggedMatches,
  getWordSlug
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

  const transform = async (tree: Node, file: VFile) => {
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
      if (segment.transform && segment.wordSlug) {
        return createNewNode(segment.text, segment.wordSlug, transformTo);
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
