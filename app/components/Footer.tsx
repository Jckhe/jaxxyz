import type {ReactElement} from 'react';
import {Suspense} from 'react';
import {Await, NavLink} from '@remix-run/react';
import NewsletterSignupForm from './NewsletterSignupForm';
import type {FooterQuery, HeaderQuery} from 'storefrontapi.generated';

interface FooterProps {
  footer: Promise<FooterQuery | null>;
  header: HeaderQuery;
  publicStoreDomain: string;
}

export function Footer({
  footer: footerPromise,
  header,
  publicStoreDomain,
}: FooterProps) {
  return (
    <Suspense>
      <Await resolve={footerPromise}>
        {(footer) => (
          <footer className="footer">
            {footer?.menu && header.shop.primaryDomain?.url && (
              <FooterMenu
                menu={footer.menu}
                primaryDomainUrl={header.shop.primaryDomain.url}
                publicStoreDomain={publicStoreDomain}
              />
            )}
          </footer>
        )}
      </Await>
    </Suspense>
  );
}

function FooterMenu({
  menu,
  primaryDomainUrl,
  publicStoreDomain,
}: {
  menu: FooterQuery['menu'];
  primaryDomainUrl: FooterProps['header']['shop']['primaryDomain']['url'];
  publicStoreDomain: string;
}) {
  const socialLinks = [
    {type: 'INSTAGRAM', url: 'https://instagram.com/jaxxyz.co/'},
    {type: 'YOUTUBE', url: 'https://www.youtube.com/watch?v=QrR_gm6RqCo'},
    {type: 'SPOTIFY', url: '#'},
  ];
  return (
    <nav className="footer-menu" role="navigation">
      <div className="left-footer-container">
        <div className="newsletter-caption-container">
          <span>NEWSLETTER</span>
          <p>
            SUBSCRIBE FOR EXCLUSIVE OFFERS, MEMBER EVENTS
            <br />
            AND DROP ANNOUNCEMENTS
          </p>
        </div>
        <div className="footer-menu-social-container">
          {socialLinks.map(({type, url}): ReactElement => {
            const isDisabled = url === '#';
            return (
              <NavLink
                to={url}
                key={type}
                onClick={(e) => {
                  if (isDisabled) e.preventDefault();
                }}
                style={{
                  pointerEvents: isDisabled ? 'none' : 'auto',
                  color: isDisabled ? 'gray' : 'inherit',
                  cursor: isDisabled ? 'default' : 'pointer',
                }}
                aria-disabled={isDisabled}
              >
                {type}
              </NavLink>
            );
          })}
        </div>
      </div>
      <div className="right-footer-container">
        <NewsletterSignupForm />
        <div className="footer-policy-container">
          {(menu || FALLBACK_FOOTER_MENU).items.map((item) => {
            if (!item.url) return null;
            // if the url is internal, we strip the domain
            const url =
              item.url.includes('myshopify.com') ||
              item.url.includes(publicStoreDomain) ||
              item.url.includes(primaryDomainUrl)
                ? new URL(item.url).pathname
                : item.url;
            const isExternal = !url.startsWith('/');
            return isExternal ? (
              <a
                href={url}
                key={item.id}
                rel="noopener noreferrer"
                target="_blank"
              >
                {item.title}
              </a>
            ) : (
              <NavLink
                end
                key={item.id}
                prefetch="intent"
                style={activeLinkStyle}
                to={url}
              >
                {item.title}
              </NavLink>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

const FALLBACK_FOOTER_MENU = {
  id: 'gid://shopify/Menu/199655620664',
  items: [
    {
      id: 'gid://shopify/MenuItem/461633060920',
      resourceId: 'gid://shopify/ShopPolicy/23358046264',
      tags: [],
      title: 'Privacy Policy',
      type: 'SHOP_POLICY',
      url: '/policies/privacy-policy',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461633093688',
      resourceId: 'gid://shopify/ShopPolicy/23358013496',
      tags: [],
      title: 'Refund Policy',
      type: 'SHOP_POLICY',
      url: '/policies/refund-policy',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461633126456',
      resourceId: 'gid://shopify/ShopPolicy/23358111800',
      tags: [],
      title: 'Shipping Policy',
      type: 'SHOP_POLICY',
      url: '/policies/shipping-policy',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461633159224',
      resourceId: 'gid://shopify/ShopPolicy/23358079032',
      tags: [],
      title: 'Terms of Service',
      type: 'SHOP_POLICY',
      url: '/policies/terms-of-service',
      items: [],
    },
  ],
};

function activeLinkStyle({
  isActive,
  isPending,
}: {
  isActive: boolean;
  isPending: boolean;
}) {
  return {
    textTransform: 'uppercase',
    fontWeight: isActive ? 'bold' : undefined,
    color: isPending ? 'grey' : 'black',
  };
}
