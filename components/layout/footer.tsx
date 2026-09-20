import Image from "next/image";

import {
  communityNetworks,
  footerLinks,
  legalNotice,
  socialGroups,
  storeBadges,
  type FooterIcon,
  type StoreBadge,
} from "@/lib/data/footer";

function IconButton({ icon }: { icon: FooterIcon }) {
  return (
    <button type="button" className="flex size-4 shrink-0 cursor-pointer">
      <Image src={icon.iconSrc} alt="" width={16} height={16} className="size-4" />
      <span className="sr-only">{icon.label}</span>
    </button>
  );
}

function Divider() {
  return <span aria-hidden className="hidden h-6 w-px bg-foreground/10 desktop:block" />;
}

function StoreButton({ store }: { store: StoreBadge }) {
  return (
    <button
      type="button"
      className="flex h-9 w-26 cursor-pointer items-center justify-center gap-1.5 rounded-sm border border-border-muted bg-black text-left text-foreground"
    >
      <Image
        src={store.iconSrc}
        alt=""
        width={store.iconWidth}
        height={store.iconHeight}
        className="shrink-0"
      />
      <span className="flex flex-col gap-0.5">
        <span className="whitespace-nowrap text-3xs">{store.eyebrow}</span>
        {store.wordmarkSrc ? (
          <Image
            src={store.wordmarkSrc}
            alt={store.name}
            width={59}
            height={12}
            className="-scale-y-100"
          />
        ) : (
          <span className="text-reward font-medium tracking-tight">{store.name}</span>
        )}
      </span>
    </button>
  );
}

export function Footer() {
  return (
    /* no tocar: overflow-x-clip evita el scroll lateral entre 391 y 860 */
    <footer className="flex flex-col items-center gap-6 overflow-x-clip px-gutter pt-section-gap-mobile pb-nav-clearance desktop:gap-4 desktop:px-0 desktop:pt-16 desktop:pb-5">
      <div className="flex flex-col items-center gap-6 desktop:flex-row desktop:gap-12">
        <Image
          src="/assets/home/footer/logo-mark.svg"
          alt="Sura Gaming"
          width={40}
          height={24}
          className="h-6 w-10"
        />

        <nav
          aria-label="Enlaces del sitio"
          className="flex flex-col items-center gap-3 desktop:flex-row desktop:gap-4"
        >
          {footerLinks.map((link, index) => (
            <span key={link.id} className="contents">
              {index > 0 && <Divider />}
              <span className="flex items-center gap-4 text-sm text-foreground/80">
                <button type="button" className="cursor-pointer whitespace-nowrap">
                  {link.label}
                </button>
                {link.icons?.map((icon) => (
                  <IconButton key={icon.id} icon={icon} />
                ))}
              </span>
            </span>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          {storeBadges.map((store) => (
            <StoreButton key={store.id} store={store} />
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
        {socialGroups.map((group, index) => (
          <span key={group.id} className="contents">
            {index > 0 && <Divider />}
            <span className="flex items-center gap-4">
              <span className="text-2xs leading-4 text-muted-foreground">{group.label}</span>
              {group.networks.map((network) => (
                <IconButton key={network.id} icon={network} />
              ))}
            </span>
          </span>
        ))}
        <Divider />
        <span className="flex w-full items-center justify-center gap-6 desktop:w-auto">
          {communityNetworks.map((network) => (
            <IconButton key={network.id} icon={network} />
          ))}
        </span>
      </div>

      <hr className="-mt-px h-px w-full border-0 bg-foreground/10" />

      <p className="text-legal text-center text-foreground/60">{legalNotice}</p>
    </footer>
  );
}
