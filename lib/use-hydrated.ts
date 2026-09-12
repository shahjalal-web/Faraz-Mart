import { useSyncExternalStore } from "react";

const emptySubscribe = () => () => {};

/**
 * True once the app has hydrated on the client, false during SSR and the
 * first hydration pass. Used to defer client-only work (like portals) without
 * the setState-in-effect anti-pattern — the boolean snapshot is stable, so
 * there's no "new value on every call" risk that a computed object would have.
 */
export function useHydrated(): boolean {
  return useSyncExternalStore(emptySubscribe, () => true, () => false);
}
