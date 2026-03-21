import { API_BASE_URL, REVALIDATE_STANDINGS } from "@/constants/config";
import { z } from "zod";

type FetchOptions = {
  revalidate?: number;
};

export async function apiFetch<T>(
  endpoint: string,
  options: FetchOptions = {},
  schema?: z.ZodSchema<T>
): Promise<T> {
  const [path, query] = endpoint.split("?");
  const url = `${API_BASE_URL}${path}.json${query ? `?${query}` : ""}`;

  try {
    const res = await fetch(url, {
      next: { revalidate: options.revalidate ?? REVALIDATE_STANDINGS },
    });

    if (!res.ok) {
      const errorBody = await res.text().catch(() => "No error body");
      console.error(`API Fetch Error [${res.status}] ${url}:`, errorBody);
      throw new Error(`API error ${res.status}: ${url}`);
    }

    const data = await res.json();

    if (schema) {
      const result = schema.safeParse(data);
      if (!result.success) {
        console.error(`Validation Error for ${url}:`, JSON.stringify(result.error.issues, null, 2));
        throw new Error(`Data validation failed for API response from ${url}`);
      }
      return result.data;
    }

    return data as T;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error(`Unknown error fetching ${url}`);
  }
}
