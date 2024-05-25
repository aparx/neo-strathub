import { DASHBOARD_QUERY_PARAMS } from "@/app/(app)/dashboard/_utils";

/**
 * Modal parameter is a URL search parameter, supplied through the URL to add
 * values and context to modals. A popular example would be the `teamId`.
 */
export module ModalParameter {
  export function createToken<const T extends string>(name: T) {
    return `${DASHBOARD_QUERY_PARAMS.modal}_${name}` as const;
  }

  export function get(params: URLSearchParams, name: string) {
    return params.get(createToken(name));
  }

  export function apply(params: URLSearchParams, name: string, value: string) {
    params.set(createToken(name), value);
  }

  export function remove(params: URLSearchParams, name: string) {
    params.delete(createToken(name));
  }

  export function isToken(name: string) {
    return name.startsWith(DASHBOARD_QUERY_PARAMS.modal);
  }

  export function deleteAll(params: URLSearchParams) {
    params.forEach((_, key) => isToken(key) && params.delete(key));
  }
}
