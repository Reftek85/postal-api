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
const randomSymbols = customAlphabet("!$%&*", 2);

export function generateCredentialKey2(length: number): string {
  let key: string;
  let symbolCount: number;

  do {
    key = randomAlphaNumSymbol(length);
    symbolCount = (key.match(/[^a-zA-Z0-9]/g) || []).length;
  } while (!(symbolCount >= 3 && /[a-z]/.test(key) && /[A-Z]/.test(key) && /\d/.test(key)));

  return key;
}

function generateKey(length: number): string {
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

// Generate 15 keys with a length of 24 characters each
function generateKeys(numKeys: number, keyLength: number): string[] {
  const keys: string[] = [];
  for (let i = 0; i < numKeys; i++) {
    const key = generateKey(keyLength);
    keys.push(key);
  }
  return keys;
}
// Test the key generation
const keys = generateKeys(15, 24);
keys.forEach((key, index) => console.log(`${index + 1}. ${key}`));

// Test function to generate and output keys
function testGenerateCredentialKeys(numKeys: number, keyLength: number) {
  console.log(`Generating ${numKeys} keys with a length of ${keyLength} characters:`);
  for (let i = 0; i < numKeys; i++) {
    console.log(`${i + 1}. ${generateKey(keyLength)}`);
  }
}

// Call the function with the desired parameters
testGenerateCredentialKeys(15, 16);
