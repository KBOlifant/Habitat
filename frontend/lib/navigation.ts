import type { useRouter } from 'expo-router';

type Router = ReturnType<typeof useRouter>;

export function goBackOrHome(router: Router): void {
  if (router.canGoBack()) {
    router.back();
    return;
  }

  router.replace('/home');
}