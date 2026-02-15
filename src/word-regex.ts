export const WORD_PATTERN = /([a-z]+[''][a-z]+)|[a-z]{2,}/gi;

export default function createWordRegex(): RegExp {
  return new RegExp(WORD_PATTERN.source, WORD_PATTERN.flags);
}
