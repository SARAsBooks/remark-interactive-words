import wordRegex from './word-regex.js';

export interface HelperInput {
    input: string;
    exceptions?: string[];
}

export interface HelperResult {
    text: string;
    isMatch: boolean;
}

export function getWordSlug(word: string): string {
    return word.toLowerCase().replace("’", "'");
}

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
