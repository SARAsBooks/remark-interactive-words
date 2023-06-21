import { visit } from 'unist-util-visit';

function remarkInteractiveWords() {
    return function transformer(/** @type {any} */ tree) {
        visit(tree, 'text', (node) => {
            // Here you would add your code to modify the text node
            const regex = /([a-z]+['’][a-z]+)|[a-z]{2,}/gi;
            const matches = node.value.match(regex);

            if (matches) {
                matches.forEach((/** @type {string} */ match) => {
                    const anchor = match.toLowerCase().replace("’", "'");
                    node.value = node.value.replace(match, `[${match}](#${anchor})`);
                });
            }
        });
    };
}

export default remarkInteractiveWords;