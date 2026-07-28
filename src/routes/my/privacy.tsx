import { useEffect } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { graniteEvent } from '@apps-in-toss/web-framework';
import { PrivacyPolicyDetail } from '@/features/my/ui';

export const Route = createFileRoute('/my/privacy')({
  component: PrivacyPolicyPage,
});

function PrivacyPolicyPage() {
  useEffect(() => {
    let unsubscribe: (() => void) | null = null;
    try {
      unsubscribe = graniteEvent.addEventListener('backEvent', {
        onEvent: () => {
          window.history.back();
        },
        onError: (error) => {
          console.error('backEvent error', error);
        },
      });
    } catch {
      console.warn('backEvent listener not supported in browser');
    }
    return () => {
      unsubscribe?.();
    };
  }, []);

  return <PrivacyPolicyDetail />;
}
