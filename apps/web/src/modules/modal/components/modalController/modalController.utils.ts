/**
 * Modal parameter is a URL search parameter, supplied through the URL to add
 * values and context to modals. A popular example would be the `teamId`.
 */
export module ModalParameter {
  export const MODAL_PARAMETER_PREFIX = "modal";

  export function createKey<const T extends string>(name: T) {
    return `${MODAL_PARAMETER_PREFIX}_${name}` as const;
  }

  export function get(params: URLSearchParams, name: string) {
    return params.get(createKey(name));
  }

  export function apply(params: URLSearchParams, name: string, value: string) {
    params.set(createKey(name), value);
  }

  export function remove(params: URLSearchParams, name: string) {
    params.delete(createKey(name));
  }

  export function isToken(name: string) {
    return name.startsWith(MODAL_PARAMETER_PREFIX);
  }

  export function deleteAll(params: URLSearchParams) {
    params.forEach((_, key) => isToken(key) && params.delete(key));
  }
}
