import {RemixBrowser} from '@remix-run/react';
import {startTransition, StrictMode} from 'react';
import {hydrateRoot} from 'react-dom/client';
import {Theme} from '@radix-ui/themes';
import '@radix-ui/themes/styles.css';

if (!window.location.origin.includes('webcache.googleusercontent.com')) {
  startTransition(() => {
    hydrateRoot(
      document,
      <StrictMode>
        <Theme>
          <RemixBrowser />
        </Theme>
      </StrictMode>,
    );
  });
}
