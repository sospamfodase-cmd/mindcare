import pako from 'pako';

/**
 * Compresses a base64 string or ArrayBuffer using GZIP.
 * Returns a base64 string with a 'GZIP:' prefix.
 */
export const compressData = async (data: string | ArrayBuffer): Promise<string> => {
  try {
    let uint8Array: Uint8Array;

    if (typeof data === 'string') {
      // If it's a data URL (e.g. "data:application/pdf;base64,..."), extract the base64 part
      const base64Content = data.includes(',') ? data.split(',')[1] : data;
      const binaryString = window.atob(base64Content);
      const len = binaryString.length;
      uint8Array = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        uint8Array[i] = binaryString.charCodeAt(i);
      }
    } else {
      uint8Array = new Uint8Array(data);
    }

    const compressed = pako.gzip(uint8Array, { level: 9 });
    
    // Convert compressed Uint8Array to base64 efficiently
    const len = compressed.byteLength;
    let binary = '';
    const CHUNK_SIZE = 0x8000; // 32k chunks
    
    for (let i = 0; i < len; i += CHUNK_SIZE) {
      // @ts-ignore - Uint8Array subarray is compatible
      binary += String.fromCharCode.apply(null, compressed.subarray(i, Math.min(i + CHUNK_SIZE, len)));
    }
    
    return 'GZIP:' + window.btoa(binary);
  } catch (error) {
    console.error('Compression error:', error);
    throw error;
  }
};

/**
 * Decompresses a 'GZIP:' prefixed base64 string back to a Blob URL.
 * If not prefixed, assumes it's a regular data URL and returns it as is.
 */
export const decompressData = async (data: string): Promise<string> => {
  if (!data.startsWith('GZIP:')) {
    return data; // Return original if not compressed by us
  }

  try {
    const base64 = data.slice(5); // Remove 'GZIP:'
    const binaryString = window.atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    const decompressed = pako.ungzip(bytes);
    const blob = new Blob([decompressed], { type: 'application/pdf' });
    return URL.createObjectURL(blob);
  } catch (error) {
    console.error('Decompression error:', error);
    throw error;
  }
};
