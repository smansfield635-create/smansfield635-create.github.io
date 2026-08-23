/**
 * /showroom/globe/h-earth/diagnostic/evidence.js
 * Pure browser-evidence mechanisms. No orchestration or authority decisions.
 */

export function isRecord(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

export function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

export function nowIso() {
  return new Date().toISOString();
}

export function deepFreeze(value, seen = new WeakSet()) {
  if (
    value === null ||
    typeof value !== 'object' ||
    Object.isFrozen(value) ||
    seen.has(value)
  ) {
    return value;
  }

  seen.add(value);

  for (const key of Reflect.ownKeys(value)) {
    const descriptor = Object.getOwnPropertyDescriptor(value, key);
    if (descriptor && Object.prototype.hasOwnProperty.call(descriptor, 'value')) {
      deepFreeze(descriptor.value, seen);
    }
  }

  return Object.freeze(value);
}

export function resolveUrl(value, base) {
  try {
    return new URL(value, base).href;
  } catch {
    return null;
  }
}

export function equivalentUrl(left, right) {
  if (!isNonEmptyString(left) || !isNonEmptyString(right)) {
    return false;
  }

  try {
    const a = new URL(left);
    const b = new URL(right);
    a.hash = '';
    b.hash = '';
    return a.href === b.href;
  } catch {
    return left === right;
  }
}

export function projectBrowserExposedHeaders(headers) {
  const output = [];

  if (!headers || typeof headers.entries !== 'function') {
    return output;
  }

  for (const [name, value] of headers.entries()) {
    output.push({
      name: String(name).toLowerCase(),
      value: String(value)
    });
  }

  output.sort((left, right) => {
    const nameOrder = left.name.localeCompare(right.name);
    return nameOrder !== 0 ? nameOrder : left.value.localeCompare(right.value);
  });

  return output;
}

export function projectError(error, phase, evidenceReferences = []) {
  const read = (key) => {
    try {
      return error?.[key] ?? null;
    } catch {
      return null;
    }
  };

  const name = read('name');
  const message = read('message');
  const stack = read('stack');

  return {
    phase,
    name: name === null ? null : String(name),
    message:
      message === null
        ? error === null || error === undefined
          ? null
          : String(error)
        : String(message),
    stack: stack === null ? null : String(stack),
    evidenceReferences: Array.from(evidenceReferences, String)
  };
}

export function arrayBufferToBase64(arrayBuffer) {
  const bytes = new Uint8Array(arrayBuffer);
  const chunkSize = 0x8000;
  let binary = '';

  for (let offset = 0; offset < bytes.length; offset += chunkSize) {
    binary += String.fromCharCode(
      ...bytes.subarray(offset, Math.min(offset + chunkSize, bytes.length))
    );
  }

  return btoa(binary);
}

export async function calculateSha256(
  arrayBuffer,
  cryptoObject = globalThis.crypto
) {
  if (!cryptoObject?.subtle || typeof cryptoObject.subtle.digest !== 'function') {
    throw new Error('WEB_CRYPTO_SUBTLE_DIGEST_UNAVAILABLE');
  }

  const digest = await cryptoObject.subtle.digest('SHA-256', arrayBuffer);

  return Array.from(new Uint8Array(digest), (byte) =>
    byte.toString(16).padStart(2, '0')
  ).join('');
}

export function decodeUtf8Prefix(
  arrayBuffer,
  maximumBytes = 512,
  TextDecoderImpl = globalThis.TextDecoder
) {
  if (typeof TextDecoderImpl !== 'function') {
    throw new Error('TEXT_DECODER_UNAVAILABLE');
  }

  const bytes = new Uint8Array(arrayBuffer);
  const bounded = bytes.subarray(0, Math.min(bytes.length, maximumBytes));
  return new TextDecoderImpl('utf-8', { fatal: false }).decode(bounded);
}

export function decodeUtf8(
  arrayBuffer,
  TextDecoderImpl = globalThis.TextDecoder
) {
  if (typeof TextDecoderImpl !== 'function') {
    throw new Error('TEXT_DECODER_UNAVAILABLE');
  }

  return new TextDecoderImpl('utf-8', { fatal: false }).decode(
    new Uint8Array(arrayBuffer)
  );
}

export function extractContractCandidates(text) {
  if (!isNonEmptyString(text)) {
    return [];
  }

  const candidates = new Set();
  const patterns = [
    /\bH_EARTH_[A-Z0-9_]+(?:_v\d+)?\b/g,
    /\bFD_0[0-9]_[A-Z0-9_]+\b/g
  ];

  for (const pattern of patterns) {
    for (const match of text.matchAll(pattern)) {
      candidates.add(match[0]);
    }
  }

  return Array.from(candidates).sort();
}

export function classifyPayloadShape(prefix, contentType) {
  const type = String(contentType || '').toLowerCase();
  const text = String(prefix || '').trimStart();
  const lower = text.toLowerCase();

  if (text.length === 0) {
    return 'EMPTY_RESPONSE';
  }

  if (
    type.includes('text/html') ||
    /^(?:<!doctype html|<html|<head|<body|<title)/i.test(lower)
  ) {
    return 'HTML_LIKE_RESPONSE';
  }

  if (
    type.includes('application/json') ||
    type.includes('+json') ||
    /^[\[{]/.test(text)
  ) {
    return 'JSON_LIKE_RESPONSE';
  }

  if (
    type.includes('javascript') ||
    type.includes('ecmascript') ||
    /^(?:\/\*|\/\/|import\s|export\s|const\s|let\s|var\s|class\s|function\s|async\s+function\s|['"]use strict['"])/.test(
      text
    )
  ) {
    return 'JAVASCRIPT_LIKE_RESPONSE';
  }

  return 'UNRECOGNIZED_TEXT_RESPONSE';
}

function canonicalizeNumber(value) {
  if (!Number.isFinite(value)) {
    throw new TypeError('RFC8785_NON_FINITE_NUMBER');
  }

  return JSON.stringify(value);
}

export function canonicalizeRfc8785(value) {
  const stack = new Set();

  const serialize = (current) => {
    if (current === null) {
      return 'null';
    }

    switch (typeof current) {
      case 'string':
        return JSON.stringify(current);
      case 'boolean':
        return current ? 'true' : 'false';
      case 'number':
        return canonicalizeNumber(current);
      case 'object':
        break;
      default:
        throw new TypeError(`RFC8785_UNSUPPORTED_TYPE:${typeof current}`);
    }

    if (stack.has(current)) {
      throw new TypeError('RFC8785_CYCLIC_VALUE');
    }

    stack.add(current);

    let result;

    if (Array.isArray(current)) {
      result = `[${current.map((item) => serialize(item)).join(',')}]`;
    } else {
      const prototype = Object.getPrototypeOf(current);
      if (prototype !== Object.prototype && prototype !== null) {
        stack.delete(current);
        throw new TypeError('RFC8785_NON_PLAIN_OBJECT');
      }

      const keys = Object.keys(current).sort();
      const members = [];

      for (const key of keys) {
        const item = current[key];
        if (
          item === undefined ||
          typeof item === 'function' ||
          typeof item === 'symbol' ||
          typeof item === 'bigint'
        ) {
          stack.delete(current);
          throw new TypeError(`RFC8785_INVALID_MEMBER:${key}`);
        }

        members.push(`${JSON.stringify(key)}:${serialize(item)}`);
      }

      result = `{${members.join(',')}}`;
    }

    stack.delete(current);
    return result;
  };

  return serialize(value);
}

export async function digestCanonicalObject(
  value,
  cryptoObject = globalThis.crypto,
  TextEncoderImpl = globalThis.TextEncoder
) {
  if (typeof TextEncoderImpl !== 'function') {
    throw new Error('TEXT_ENCODER_UNAVAILABLE');
  }

  const canonicalText = canonicalizeRfc8785(value);
  const bytes = new TextEncoderImpl().encode(canonicalText);
  const digest = await calculateSha256(bytes.buffer, cryptoObject);

  return {
    canonicalText,
    digest
  };
}

export function boundedText(value, maximumLength = 1200) {
  if (value === null || value === undefined) {
    return null;
  }

  const text = String(value);
  return text.length <= maximumLength
    ? text
    : `${text.slice(0, maximumLength)}…`;
}
