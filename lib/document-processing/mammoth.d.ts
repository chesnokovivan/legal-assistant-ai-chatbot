/**
 * Type declarations for mammoth.js
 * https://github.com/mwilliamson/mammoth.js
 */

declare module 'mammoth' {
  interface MammothOptions {
    path?: string;
    buffer?: Buffer;
    arrayBuffer?: ArrayBuffer;
    styleMap?: string;
    includeDefaultStyleMap?: boolean;
    includeEmbeddedStyleMap?: boolean;
    convertImage?: (image: any) => Promise<{ src: string }>;
    ignoreEmptyParagraphs?: boolean;
    idPrefix?: string;
    preserveStyles?: boolean;
  }

  interface MammothResult {
    value: string;
    messages: Array<{
      type: string;
      message: string;
      paragraph?: number;
    }>;
  }

  export function extractRawText(options: MammothOptions): Promise<MammothResult>;
  export function convertToHtml(options: MammothOptions): Promise<MammothResult>;
  export function convertToMarkdown(options: MammothOptions): Promise<MammothResult>;
  export function embedStyleMap(docxBuffer: Buffer, styleMap: string): Promise<Buffer>;
} 