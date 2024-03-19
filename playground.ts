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
export const randomSymbols = customAlphabet("!$%&*");

export function generateCredentialKey2(length: number): string {
  let key: string;
  let symbolCount: number;

  do {
    key = randomAlphaNumSymbol(length);
    symbolCount = (key.match(/[^a-zA-Z0-9]/g) || []).length;
  } while (!(symbolCount >= 3 && /[a-z]/.test(key) && /[A-Z]/.test(key) && /\d/.test(key)));

  return key;
}

function generateCredentialKey(length: number): string {
  const requiredTypes = ['lowercase', 'uppercase', 'numeric', 'symbol'];

  // Generate at least two characters of each required type
  let key = '';
  for (const type of requiredTypes) {
    key += generateRandomChar(type);
    key += generateRandomChar(type);
  }

  // Generate the rest of the key
  const remainingLength = Math.max(0, length - 8); // Ensure non-negative length after considering required types
  for (let i = 0; i < remainingLength; i++) {
    const randomType = requiredTypes[Math.floor(Math.random() * requiredTypes.length)];
    key += generateRandomChar(randomType);
  }

  // Shuffle the generated key
  key = shuffleString(key);

  // Trim the key to the specified length
  key = key.slice(0, length);

  return key;
}

function generateRandomChar(type: string): string {
  switch (type) {
    case 'lowercase':
      return String.fromCharCode(Math.floor(Math.random() * 26) + 97); // ASCII code for lowercase letters
    case 'uppercase':
      return String.fromCharCode(Math.floor(Math.random() * 26) + 65); // ASCII code for uppercase letters
    case 'numeric':
      return String.fromCharCode(Math.floor(Math.random() * 10) + 48); // ASCII code for digits
    case 'symbol':
      return randomSymbols();
    default:
      return ''; // Return empty string for unknown types
  }
}

function shuffleString(str: string): string {
  const array = str.split('');
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]]; // Swap elements
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
// Call the function with the desired parameters
testGenerateCredentialKeys(15, 24);
