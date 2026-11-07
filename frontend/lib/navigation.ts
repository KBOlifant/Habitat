import type { Router } from 'expo-router';

export function goBackOrHome(router: Router): void {
  if (router.canGoBack()) {
    router.back();
    return;
  }

  router.replace('/home');
}