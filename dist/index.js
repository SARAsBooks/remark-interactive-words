import { visitParents } from 'unist-util-visit-parents';
import { getTaggedMatches } from './helper.js';
const remarkInteractiveWords = (options) => {
    const { transformTo, exceptions, helper } = options;
    const helperFunction = helper || getTaggedMatches;
    const exceptionsList = exceptions || ['a', 'an', 'the'];
    const transform = async (tree, file) => {
        visitParents(tree, 'text', visitor);
        return tree;
    };
    const visitor = (node, ancestors) => {
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
        const parent = ancestors[ancestors.length - 1];
        const segments = helperFunction({ input: node.value, exceptions: exceptionsList });
        const newChildren = (segments.map((segment) => {
            if (segment.transform && segment.wordSlug) {
                return createNewNode(segment.text, segment.wordSlug, transformTo);
            }
            return { type: 'text', value: segment.text };
        }));
        const index = parent.children.indexOf(node);
        parent.children.splice(index, 1, ...newChildren);
    };
    return transform;
};
function createNewNode(word, slug, transformTo) {
    if (transformTo === 'link') {
        return {
            type: 'link',
            url: `#${slug}`,
            children: [{ type: 'text', value: word }],
        };
    }
    else {
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
