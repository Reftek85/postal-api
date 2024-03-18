import { generateCredentialKey } from "./utils";

export function generateCredentialKey2(length: number): string {
  let key: string;
  let symbolCount: number;

  do {
    key = randomAlphaNumSymbol(length);
    symbolCount = (key.match(/[^a-zA-Z0-9]/g) || []).length;
  } while (!(symbolCount >= 3 && /[a-z]/.test(key) && /[A-Z]/.test(key) && /\d/.test(key)));

  return key;
}

export function generateCredentialKey(length: number): string {
  let key: string = '';

  // Generate at least 2 characters from each type
  key += randomLowercase();
  key += randomLowercase();
  key += randomUppercase();
  key += randomUppercase();
  key += randomNumeric();
  key += randomNumeric();
  key += randomSymbols();
  key += randomSymbols();

  // Fill the rest of the key with random characters
  const remainingLength = length - 8; // 2 from each type
  const allChars = randomLowercase() + randomUppercase() + randomNumeric() + randomSymbols();
  for (let i = 0; i < remainingLength; i++) {
    key += allChars[Math.floor(Math.random() * allChars.length)];
  }

  // Shuffle the generated key
  key = shuffleString(key);

  return key;
}

// Function to shuffle a string
function shuffleString(str: string): string {
  const array = str.split('');
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array.join('');
}

// Test function to generate and output keys
function testGenerateCredentialKeys(numKeys: number, keyLength: number) {
  console.log(`Generating ${numKeys} keys with a length of ${keyLength} characters:`);
  for (let i = 0; i < numKeys; i++) {
    console.log(`${i + 1}. ${generateCredentialKey(keyLength)}`);
  }
}