/**
 * Wrapper de fetching para interceptar errores de la API sin romper el servidor
 * y devolver un estado manejable (usado de forma unificada en todas las páginas).
 */
export async function safeFetch<T>(
  fetcher: Promise<T>,
): Promise<{ data: T | null; error: boolean }> {
  try {
    const data = await fetcher;
    return { data, error: false };
  } catch {
    return { data: null, error: true };
  }
}
