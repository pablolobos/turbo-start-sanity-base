import { isPortableTextTextBlock, type StringOptions } from "sanity";

export const isRelativeUrl = (url: string) =>
  url.startsWith("/") || url.startsWith("#") || url.startsWith("?");

export const isValidUrl = (url: string) => {
  try {
    new URL(url);
    return true;
  } catch (e) {
    return isRelativeUrl(url);
  }
};

export const capitalize = (str: string) =>
  str.charAt(0).toUpperCase() + str.slice(1);

export const getTitleCase = (name: string) => {
  const titleTemp = name.replace(/([A-Z])/g, " $1");
  return titleTemp.charAt(0).toUpperCase() + titleTemp.slice(1);
};

export const createRadioListLayout = (
  items: Array<string | { title: string; value: string }>,
  options?: StringOptions
): StringOptions => {
  const list = items.map((item) => {
    if (typeof item === "string") {
      return {
        title: getTitleCase(item),
        value: item,
      };
    }
    return item;
  });
  return {
    layout: "radio",
    list,
    ...options,
  };
};

export const parseRichTextToString = (
  value: unknown,
  maxWords: number | undefined = undefined
) => {
  if (!Array.isArray(value)) return "No Content";

  const text = value.map((val) => {
    const test = isPortableTextTextBlock(val);
    if (!test) return "";
    return val.children
      .map((child) => child.text)
      .filter(Boolean)
      .join(" ");
  });
  if (maxWords)
    return `${text.join(" ").split(" ").slice(0, maxWords).join(" ")}...`;
  return text.join(" ");
};


export function splitArray<T>(array: T[], numChunks: number): T[][] {
  const result: T[][] = Array.from({ length: numChunks }, () => []);
  for (let i = 0; i < array.length; i++) {
    result[i % numChunks].push(array[i]);
  }
  return result;
}



export interface RetryOptions {
  maxRetries?: number;
  initialDelay?: number;
  maxDelay?: number;
  onRetry?: (error: Error, attempt: number) => void;
}

export async function retryPromise<T>(
  promiseFn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const {
    maxRetries = 3,
    initialDelay = 1000,
    maxDelay = 30000,
    onRetry,
  } = options;

  let attempts = 0;

  while (true) {
    try {
      return await promiseFn();
    } catch (error) {
      attempts++;

      if (attempts >= maxRetries) {
        throw error instanceof Error
          ? error
          : new Error("Promise retry failed");
      }

      if (onRetry) {
        onRetry(
          error instanceof Error ? error : new Error("Unknown error"),
          attempts
        );
      }

      const backoffDelay = Math.min(
        initialDelay * 2 ** (attempts - 1),
        maxDelay
      );

      await new Promise((resolve) =>
        setTimeout(resolve, backoffDelay)
      );
    }
  }
}
