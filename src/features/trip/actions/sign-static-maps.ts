"use server";

import crypto from "crypto";
import url from "url";

/**
 * Convert from 'web safe' base64 to true base64.
 *
 * @param safeEncodedString The code you want to translate
 *                                    from a web safe form.
 */
function removeWebSafe(safeEncodedString: string) {
  return safeEncodedString.replace(/-/g, "+").replace(/_/g, "/");
}

/**
 * Convert from true base64 to 'web safe' base64
 *
 * @param encodedString The code you want to translate to a
 *                                web safe form.
 */
function makeWebSafe(encodedString: string) {
  return encodedString.replace(/\+/g, "-").replace(/\//g, "_");
}

/**
 * Takes a base64 code and decodes it.
 *
 * @param code The encoded data.
 */
function decodeBase64Hash(code: string) {
  // "new Buffer(...)" is deprecated. Use Buffer.from if it exists.
  return Buffer.from ? Buffer.from(code, "base64") : new Buffer(code, "base64");
}

/**
 * Takes a key and signs the data with it.
 *
 * @param key  Your unique secret key.
 * @param data The url to sign.
 */
function encodeBase64Hash(key: Buffer<ArrayBuffer>, data: string) {
  return crypto.createHmac("sha1", key).update(data).digest("base64");
}

/**
 * Sign a URL using a secret key.
 *
 * @param path   The url you want to sign.
 * @param secret Your unique secret key.
 */
export async function sign(path: string) {
  const secret = process.env.NEXT_PUBLIC_SIGNING_SECRET as string;

  const uri = url.parse(path);
  const safeSecret = decodeBase64Hash(removeWebSafe(secret));

  if (!uri.path) {
    throw new Error("uri.path is null");
  }

  return makeWebSafe(encodeBase64Hash(safeSecret, uri.path));
}
