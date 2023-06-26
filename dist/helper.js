import wordRegex from './word-regex.js';
export function getWordSlug(word) {
    return word.toLowerCase().replace("’", "'");
}
export function getTaggedMatches({ input, exceptions }) {
    let lastIndex = 0;
    const results = [];
    let match;
    while ((match = wordRegex.exec(input)) !== null) {
        const isException = exceptions ? exceptions.includes(match[0].toLowerCase()) : false;
        // If it's not an exception, handle it as a match
        if (!isException) {
            // Get the unmatched text before this match
            if (match.index > lastIndex) {
                const nonMatch = input.slice(lastIndex, match.index);
                results.push({ text: nonMatch, transform: false });
            }
            // Push the match to the results array
            results.push({ text: match[0], transform: true, wordSlug: getWordSlug(match[0]) });
            // Update lastIndex to be the end of this match
            lastIndex = match.index + match[0].length;
        }
        // If it's an exception, don't do anything (it will be included in the next non-match)
    }
    // Get any remaining non-matching text after the last match (or exception)
    if (lastIndex < input.length) {
        const nonMatch = input.slice(lastIndex);
        results.push({ text: nonMatch, transform: false });
    }
    return results;
}
