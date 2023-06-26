import { visit, SKIP } from 'unist-util-visit';
import { getTaggedMatches, } from './helper.js';
const remarkInteractiveWords = (options) => {
    const { transformTo, exceptions, helper } = options;
    const helperFunction = helper || getTaggedMatches;
    const exceptionsList = exceptions || ['a', 'an', 'the'];
    const referenceCount = {};
    const transform = async (tree, file) => {
        visit(tree, (node, index, parent) => {
            index = index;
            const excludingNodes = [
                'code',
                'inlineCode',
                'link',
                'linkReference',
                'html'
            ];
            for (const excludingNode of excludingNodes) {
                if (node.type == excludingNode) {
                    return SKIP;
                }
            }
            if (node.type === 'text' && index !== null) {
                return visitor(node, index, parent);
            }
        });
        for (const [key, value] of Object.entries(referenceCount)) {
            if (transformTo == 'linkReference' && value > 0) {
                tree.children.push({
                    type: 'definition',
                    identifier: key,
                    label: key,
                    url: `#${key}`,
                    title: `{ url: #${key}, documentCount: ${value} }`,
                });
            }
        }
        return tree;
    };
    const visitor = (node, index, parent) => {
        const segments = helperFunction({ input: node.value, exceptions: exceptionsList });
        const newChildren = (segments.map((segment) => {
            if (segment.transform && segment.wordSlug) {
                referenceCount[segment.wordSlug] = referenceCount[segment.wordSlug] + 1 || 1;
                return createNewNode(segment.text, segment.wordSlug, transformTo);
            }
            return { type: 'text', value: segment.text };
        }));
        parent.children.splice(index, 1, ...newChildren);
        return newChildren.length + index;
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
