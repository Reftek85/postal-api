import { customAlphabet } from "nanoid";

export const randomAlphaNumeric = customAlphabet(
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
);
export const randomAlphabetic = customAlphabet(
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
);
export const randomAlphaNumSymbol = customAlphabet(
  "!$%&*0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
);
export const randomLowercase = customAlphabet("abcdefghijklmnopqrstuvwxyz");
export const randomUppercase = customAlphabet("ABCDEFGHIJKLMNOPQRSTUVWXYZ");
export const randomNumeric = customAlphabet("0123456789");
export const randomSymbols = customAlphabet("!$%&*", 2);

export function generatekey(length: number): string {
  // Generate a random key of the required length
  let key = randomAlphaNumeric(length);

  // Extract characters from the generated key
  const chars = key.split("");

  // Shuffle the characters to increase randomness
  for (let i = chars.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [chars[i], chars[j]] = [chars[j], chars[i]]; // Swap elements
  }

  // Ensure at least three random symbols are included
  const symbolIndex1 = Math.floor(Math.random() * length);
  const symbolIndex2 = Math.floor(Math.random() * length);
  const symbolIndex3 = Math.floor(Math.random() * length);
  chars[symbolIndex1] = randomSymbols(1); // Replace a character with a random symbol
  chars[symbolIndex2] = randomSymbols(1); // Replace another character with a random symbol
  chars[symbolIndex3] = randomSymbols(1); // Replace another character with a random symbol

  // Join the characters to form the final key
  key = chars.join("");

  return key;
}