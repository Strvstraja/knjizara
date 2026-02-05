/**
 * Serbian Cyrillic to Latin transliteration utility
 * Based on official Serbian transliteration rules
 */

// Cyrillic to Latin mapping
const cyrillicToLatinMap: Record<string, string> = {
  'А': 'A', 'а': 'a',
  'Б': 'B', 'б': 'b',
  'В': 'V', 'в': 'v',
  'Г': 'G', 'г': 'g',
  'Д': 'D', 'д': 'd',
  'Ђ': 'Đ', 'ђ': 'đ',
  'Е': 'E', 'е': 'e',
  'Ж': 'Ž', 'ж': 'ž',
  'З': 'Z', 'з': 'z',
  'И': 'I', 'и': 'i',
  'Ј': 'J', 'ј': 'j',
  'К': 'K', 'к': 'k',
  'Л': 'L', 'л': 'l',
  'Љ': 'Lj', 'љ': 'lj',
  'М': 'M', 'м': 'm',
  'Н': 'N', 'н': 'n',
  'Њ': 'Nj', 'њ': 'nj',
  'О': 'O', 'о': 'o',
  'П': 'P', 'п': 'p',
  'Р': 'R', 'р': 'r',
  'С': 'S', 'с': 's',
  'Т': 'T', 'т': 't',
  'Ћ': 'Ć', 'ћ': 'ć',
  'У': 'U', 'у': 'u',
  'Ф': 'F', 'ф': 'f',
  'Х': 'H', 'х': 'h',
  'Ц': 'C', 'ц': 'c',
  'Ч': 'Č', 'ч': 'č',
  'Џ': 'Dž', 'џ': 'dž',
  'Ш': 'Š', 'ш': 'š',
};

// Latin to Cyrillic mapping (reverse of above)
const latinToCyrillicMap: Record<string, string> = {
  'A': 'А', 'a': 'а',
  'B': 'Б', 'b': 'б',
  'V': 'В', 'v': 'в',
  'G': 'Г', 'g': 'г',
  'D': 'Д', 'd': 'д',
  'Đ': 'Ђ', 'đ': 'ђ',
  'E': 'Е', 'e': 'е',
  'Ž': 'Ж', 'ž': 'ж',
  'Z': 'З', 'z': 'з',
  'I': 'И', 'i': 'и',
  'J': 'Ј', 'j': 'ј',
  'K': 'К', 'k': 'к',
  'L': 'Л', 'l': 'л',
  'M': 'М', 'm': 'м',
  'N': 'Н', 'n': 'н',
  'O': 'О', 'o': 'о',
  'P': 'П', 'p': 'п',
  'R': 'Р', 'r': 'р',
  'S': 'С', 's': 'с',
  'T': 'Т', 't': 'т',
  'Ć': 'Ћ', 'ć': 'ћ',
  'U': 'У', 'u': 'у',
  'F': 'Ф', 'f': 'ф',
  'H': 'Х', 'h': 'х',
  'C': 'Ц', 'c': 'ц',
  'Č': 'Ч', 'č': 'ч',
  'Š': 'Ш', 'š': 'ш',
};

/**
 * Convert Cyrillic text to Latin
 */
export function cyrillicToLatin(text: string): string {
  if (!text) return text;
  
  let result = '';
  let i = 0;
  
  while (i < text.length) {
    const char = text[i];
    
    // Check for digraphs (two-letter combinations)
    if (i < text.length - 1) {
      const twoChar = text.substr(i, 2);
      if (cyrillicToLatinMap[twoChar]) {
        result += cyrillicToLatinMap[twoChar];
        i += 2;
        continue;
      }
    }
    
    // Single character mapping
    if (cyrillicToLatinMap[char]) {
      result += cyrillicToLatinMap[char];
    } else {
      result += char; // Keep non-Cyrillic characters as-is
    }
    i++;
  }
  
  return result;
}

/**
 * Convert Latin text to Cyrillic
 */
export function latinToCyrillic(text: string): string {
  if (!text) return text;
  
  let result = '';
  let i = 0;
  
  while (i < text.length) {
    // Check for digraphs in specific order (longer first)
    // Dž/dž
    if (i < text.length - 1) {
      const twoChar = text.substr(i, 2);
      if (twoChar === 'Dž') {
        result += 'Џ';
        i += 2;
        continue;
      }
      if (twoChar === 'dž') {
        result += 'џ';
        i += 2;
        continue;
      }
      if (twoChar === 'Lj') {
        result += 'Љ';
        i += 2;
        continue;
      }
      if (twoChar === 'lj') {
        result += 'љ';
        i += 2;
        continue;
      }
      if (twoChar === 'Nj') {
        result += 'Њ';
        i += 2;
        continue;
      }
      if (twoChar === 'nj') {
        result += 'њ';
        i += 2;
        continue;
      }
    }
    
    // Single character mapping
    const char = text[i];
    if (latinToCyrillicMap[char]) {
      result += latinToCyrillicMap[char];
    } else {
      result += char; // Keep non-Latin characters as-is
    }
    i++;
  }
  
  return result;
}

/**
 * Detect if text is primarily Cyrillic
 */
export function isCyrillic(text: string): boolean {
  if (!text) return false;
  
  const cyrillicChars = text.match(/[А-Яа-яЁё]/g);
  const latinChars = text.match(/[A-Za-zČčĆćŽžŠšĐđ]/g);
  
  const cyrillicCount = cyrillicChars ? cyrillicChars.length : 0;
  const latinCount = latinChars ? latinChars.length : 0;
  
  // If more than 50% of alphabetic characters are Cyrillic
  return cyrillicCount > latinCount;
}

/**
 * Auto-transliterate text based on detection
 * If text is Cyrillic, convert to Latin
 * If text is Latin, convert to Cyrillic
 */
export function autoTransliterate(text: string): { latin: string; cyrillic: string } {
  if (!text) {
    return { latin: '', cyrillic: '' };
  }
  
  if (isCyrillic(text)) {
    // Text is Cyrillic, convert to Latin
    return {
      latin: cyrillicToLatin(text),
      cyrillic: text,
    };
  } else {
    // Text is Latin, convert to Cyrillic
    return {
      latin: text,
      cyrillic: latinToCyrillic(text),
    };
  }
}
