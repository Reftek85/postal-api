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

function generateRandomChars(length: number, chars: string): string {
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

function generateCredentialKey(length: number): string {
  const requiredTypes = ['lowercase', 'uppercase', 'numeric', 'symbol'];

  // Generate random key with all types of characters
  let key = generateRandomChars(length - 8, "!$%&*0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz");

  // Add two characters of each required type
  requiredTypes.forEach(type => {
    key += generateRandomChars(2, type === 'lowercase' ? randomLowercase()
          : type === 'uppercase' ? randomUppercase()
          : type === 'numeric' ? randomNumeric()
          : randomSymbols());
  });

  // Shuffle the generated key
  key = shuffleString(key);

  return key;
}

function shuffleString(str: string): string {
  const array = str.split('');
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]]; // Swap elements
  }
  return array.join('');
}

function testGenerateCredentialKeys(numKeys: number, keyLength: number) {
  console.log(`Generating ${numKeys} keys with a length of ${keyLength} characters:`);
  for (let i = 0; i < numKeys; i++) {
    console.log(`${i + 1}. ${generateCredentialKey(keyLength)}`);
  }
}

// Call the function with the desired parameters
testGenerateCredentialKeys(15, 24);