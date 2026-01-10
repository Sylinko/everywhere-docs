'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import {
  buttonVariants,
  cardVariants,
  headingVariants,
} from '@/components/variants';
import Link from 'next/link';
import { cn } from '@/lib/cn';
import { Monitor, Layers, Laptop, Box, ArrowRight } from 'lucide-react';
import { getLocalePath } from '@/lib/i18n';

const FluidMaskedGradient = dynamic(
  () => import('@/components/shader').then((m) => m.FluidMaskedGradient),
  { ssr: false }
);

type ShaderProfile = {
  delayMs: number;
  idleTimeoutMs: number;
  reduceMotion: boolean;
};

const DEFAULT_SHADER_PROFILE: ShaderProfile = {
  delayMs: 500,
  idleTimeoutMs: 1200,
  reduceMotion: false,
};

function detectShaderProfile(): ShaderProfile {
  if (typeof window === 'undefined') {
    // Must be consistent between SSR and the client's first render.
    return DEFAULT_SHADER_PROFILE;
  }

  const reduceMotion =
    window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false;

  const navAny = navigator as unknown as {
    deviceMemory?: number;
    hardwareConcurrency?: number;
  };

  const memory =
    typeof navAny.deviceMemory === 'number' ? navAny.deviceMemory : 8;
  const cores =
    typeof navAny.hardwareConcurrency === 'number'
      ? navAny.hardwareConcurrency
      : 8;
  const isSmallScreen =
    window.matchMedia?.('(max-width: 1023px)')?.matches ?? false;

  // Always render shaders, but adapt quality to reduce jank on low-end / small screens.
  const lowEnd = memory <= 4 || cores <= 4;

  if (reduceMotion) {
    return {
      delayMs: 350,
      idleTimeoutMs: 1200,
      reduceMotion: true,
    };
  }

  if (lowEnd || isSmallScreen) {
    return {
      delayMs: 550,
      idleTimeoutMs: 1600,
      reduceMotion: false,
    };
  }

  return {
    delayMs: 250,
    idleTimeoutMs: 1000,
    reduceMotion: false,
  };
}

export function Hero() {
  const { resolvedTheme } = useTheme();
  const [showShaders, setShowShaders] = useState(false);
  const [imageReady, setImageReady] = useState(false);
  const [logoReady, setLogoReady] = useState(false);
  const [mounted, setMounted] = useState(false);
  // Avoid hydration mismatch: the first client render must match SSR output.
  const [profile, setProfile] = useState<ShaderProfile>(DEFAULT_SHADER_PROFILE);

  useEffect(() => {
    const t = setTimeout(() => {
      setMounted(true);
      setProfile(detectShaderProfile());
    }, 0);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    let cancelled = false;
    let idleId: number | undefined;
    const start = () => {
      if (!cancelled) setShowShaders(true);
    };

    const win = window as unknown as {
      requestIdleCallback?: (
        cb: () => void,
        options?: { timeout?: number }
      ) => number;
      cancelIdleCallback?: (id: number) => void;
    };

    // Always keep the effect, but start it after first paint/idle to minimize jank.
    const t = window.setTimeout(() => {
      if (cancelled) return;
      if (typeof win.requestIdleCallback === 'function') {
        idleId = win.requestIdleCallback(start, {
          timeout: profile.idleTimeoutMs,
        });
        return;
      }
      start();
    }, profile.delayMs);

    return () => {
      cancelled = true;
      window.clearTimeout(t);
      if (typeof idleId === 'number') {
        win.cancelIdleCallback?.(idleId);
      }
    };
  }, [mounted, profile.delayMs, profile.idleTimeoutMs]);

  return (
    <>
      {/* Lightweight fallback while shader bundle loads */}
      <div
        className="absolute inset-0"
        style={{
          background: 'var(--hero-bg)',
        }}
      />

      {showShaders && (
        <FluidMaskedGradient
          className={cn(
            'absolute inset-0 animate-fd-fade-in',
          )}
          colors={resolvedTheme === 'dark' ? 
            ["#3183c6", "#cfc984", "#c12a8c"] : 
            ["#74b8ef", "#edeac7", "#eb65bc"]}
        />
      )}

      {/* Logo */}
      {mounted && (
        <div
          className={cn(
            'absolute hidden lg:top-[10%] lg:right-[10%] lg:block',
            logoReady
              ? 'animate-in fade-in zoom-in-95 duration-700'
              : 'invisible'
          )}
        >
          <Image
            src="/Everywhere.webp"
            alt="logo"
            width={288}
            height={288}
            className="size-32 drop-shadow-2xl sm:size-40 md:size-56 lg:size-72"
            onLoad={() => setLogoReady(true)}
            priority
          />
        </div>
      )}

      {/* {mounted && (
        <Image
          src={
            resolvedTheme === 'dark'
              ? '/assets/dashboard-dark.png'
              : '/assets/dashboard-light.png'
          }
          alt="dashboard-preview"
          width={1200}
          height={800}
          className={cn(
            'absolute top-[460px] left-[20%] max-w-[1200px] rounded-xl border-2',
            'lg:top-[400px]',
            imageReady ? 'animate-in fade-in duration-400' : 'invisible'
          )}
          onLoad={() => setImageReady(true)}
          loading="lazy"
          fetchPriority="low"
          sizes="(min-width: 1024px) 1200px, 100vw"
        />
      )} */}
    </>
  );
}

export function FeatureSection({
  items,
}: {
  items: { title: string; desc: string }[];
}) {
  const icons = [Monitor, Layers, Laptop, Box];

  return (
    <section className="mx-auto mt-24 max-w-[1400px] px-4">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {items.map((item, idx) => {
          const Icon = icons[idx] || Box;
          return (
            <div
              key={idx}
              className={cn(
                cardVariants(),
                'flex h-full flex-col justify-center'
              )}
            >
              <div>
                <div
                  className={cn(
                    'mb-4 inline-flex items-center justify-center rounded-lg',
                    'bg-muted text-muted-foreground'
                  )}
                >
                  <Icon className="size-6" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">{item.title}</h3>
                <p className="text-muted-foreground">{item.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export function ModelProviderSection({
  title,
  description,
  learnMoreDesc,
  models,
  lang,
}: {
  title: string;
  description: string;
  learnMoreDesc: string;
  models: {
    iconUrl: string;
    link: string;
    title: string;
    inversedIconColor?: boolean;
  }[];
  lang: string;
}) {
  const numberOfRows = 5;

  return (
    <section className="mx-auto mt-24 max-w-[1400px] overflow-hidden px-4">
      <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Left Card: Title & Desc */}
        <div
          className={cn(cardVariants(), 'flex flex-col justify-center pr-12')}
        >
          <h3
            className={cn(
              headingVariants({ variant: 'h3', className: 'mb-3' })
            )}
          >
            {title}
          </h3>
          <p className="text-muted-foreground text-lg">{description}</p>
          <Link
            href={getLocalePath(lang, '/docs/model-provider')}
            className={cn(buttonVariants(), 'mt-6 w-fit justify-start')}
          >
            <div className="inline-flex items-center gap-2">
              <span>{learnMoreDesc}</span>
              <ArrowRight className="size-4" />
            </div>
          </Link>
        </div>

        {/* Right: Carousel */}
        <div className="bg-background relative flex flex-col justify-center overflow-hidden rounded-2xl border py-8 lg:col-span-2">
          <div className="flex flex-col gap-5">
            {Array.from({ length: numberOfRows }).map((_, rowIndex) => {
              const centerIndex = Math.floor(numberOfRows / 2); // 2
              const dist = Math.abs(rowIndex - centerIndex);
              // dist: 0 -> clear, 1 -> slight blur, 2 -> more blur

              const opacity = 1 - dist * 0.25;
              const blurAmount = dist * 1.5; // 0px, 1.5px, 3px

              // Offset models to stagger
              const offset = rowIndex * 3;
              const safeModels = models.length > 0 ? models : [];
              const rotated = [
                ...safeModels.slice(offset % safeModels.length),
                ...safeModels.slice(0, offset % safeModels.length),
              ];
              // Triple for infinite scroll
              const seamlessModels = [...rotated, ...rotated, ...rotated];

              const duration = 60 - dist * 10; // Center (dist=0) is slowest (60s), edges (dist=2) are fastest (40s)

              return (
                <div
                  key={rowIndex}
                  className="animate-infinite-scroll flex w-max gap-4"
                  style={
                    {
                      opacity,
                      filter: `blur(${blurAmount}px)`,
                      '--animation-duration': `${duration}s`,
                    } as React.CSSProperties
                  }
                >
                  {seamlessModels.map((model, i) => (
                    <Link
                      key={i}
                      href={model.link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <div className="bg-card flex shrink-0 items-center justify-center gap-2 rounded-xl border px-4 py-2 shadow-sm">
                        <Image
                          src={model.iconUrl}
                          alt={model.title}
                          width={16}
                          height={16}
                          className={cn(
                            'size-5',
                            model.inversedIconColor && 'dark:invert dark:filter'
                          )}
                        />
                        <span className="text-card-foreground text-sm font-medium">
                          {model.title}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <style jsx>{`
        @keyframes infinite-scroll {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-33.33%);
          }
        }
        .animate-infinite-scroll {
          animation: infinite-scroll var(--animation-duration) linear infinite;
        }
      `}</style>
    </section>
  );
}

export function SponsorsSection({
  title,
  description,
  sponsors,
}: {
  title: string;
  description: string;
  sponsors: {
    title: string;
    iconPath: string;
    scale?: number;
    link: string;
    themeDifferentiated?: boolean;
  }[];
}) {
  return (
    <section className="mx-auto mt-16 max-w-[1400px] px-4">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Left: SVGs */}
        <div className="grid grid-cols-2 gap-4">
          {sponsors.map((sponsor, idx) => (
            <a
              key={idx}
              href={sponsor.link}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-card flex items-center justify-center rounded-xl border transition-shadow hover:shadow-md"
            >
              {sponsor.themeDifferentiated ? (
                <>
                  <Image
                    src={`${sponsor.iconPath}-light.svg`}
                    alt={sponsor.title}
                    width={150 * (sponsor.scale || 1)}
                    height={75 * (sponsor.scale || 1)}
                    className="object-contain dark:hidden"
                  />
                  <Image
                    src={`${sponsor.iconPath}-dark.svg`}
                    alt={sponsor.title}
                    width={150 * (sponsor.scale || 1)}
                    height={75 * (sponsor.scale || 1)}
                    className="hidden object-contain dark:block"
                  />
                </>
              ) : (
                <Image
                  src={`${sponsor.iconPath}.svg`}
                  alt={sponsor.title}
                  width={150 * (sponsor.scale || 1)}
                  height={75 * (sponsor.scale || 1)}
                  className="sponsor-img auto-gray object-contain"
                />
              )}
            </a>
          ))}
        </div>

        {/* Right: Text Card */}
        <div
          className={cn(
            cardVariants(),
            'bg-muted/5 flex flex-col justify-center rounded-2xl border p-8'
          )}
        >
          <h3
            className={cn(
              headingVariants({ variant: 'h3', className: 'mb-3' })
            )}
          >
            {title}
          </h3>
          <p className="text-muted-foreground text-lg">{description}</p>
        </div>
      </div>
    </section>
  );
}

export function BoundlessSection({
  title,
  description,
  items,
  lang,
}: {
  title: string;
  description: string;
  items: {
    label: string;
    title: string;
    desc: string;
    warn?: string;
    imgName: string;
  }[];
  lang: string;
}) {
  return (
    <section className="mx-auto mt-24 mb-24 max-w-[1400px] px-4">
      <div className="mx-auto mb-16 text-center">
        <h2 className="mb-4 text-2xl font-semibold md:text-3xl">{title}</h2>
        <p className="text-muted-foreground text-lg">{description}</p>
      </div>

      <div className="flex flex-col gap-16">
        {items.map((item, idx) => (
          <div
            key={idx}
            className={cn(
              'flex flex-col items-center gap-8 md:flex-row md:gap-16',
              idx % 2 !== 0 && 'md:flex-row-reverse'
            )}
          >
            {/* Text Side */}
            <div className="flex flex-1 flex-col items-start gap-4 text-left">
              <span className="text-brand text-sm font-semibold tracking-widest uppercase">
                {item.label}
              </span>
              <h3 className={cn(headingVariants({ variant: 'h3' }))}>
                {item.title}
              </h3>
              <p className="text-muted-foreground text-md leading-relaxed">
                {item.desc}
              </p>
              {item.warn && (
                <p className="text-sm font-medium">
                  {item.warn}
                </p>
              )}
            </div>

            {/* Image Side - Placeholder */}
            <div className="bg-muted/10 text-muted-foreground/50 group relative flex w-full flex-1 items-center justify-center overflow-hidden rounded-2xl border text-xl font-medium">
              <Image
                src={`/showcases/${lang}/${item.imgName}`}
                alt={item.title}
                width={1000}
                height={550}
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function CTASection({
  title,
  description,
  actionText,
  lang,
}: {
  title: string;
  description: string;
  actionText: string;
  lang: string;
}) {
  return (
    <section className="mx-auto mt-24 mb-12 max-w-[1400px] px-4">
      <div className="bg-background/50 relative overflow-hidden rounded-3xl border px-6 py-16 text-center sm:px-16 md:py-24">
        {/* Blurred Gradient Background */}
        <div
          className="absolute inset-0 opacity-30 blur-3xl saturate-150"
          style={{
            backgroundImage:
              'linear-gradient(to bottom right, var(--color-brand), var(--color-brand-alter-1), var(--color-brand-alter-2))',
          }}
        />

        <h2
          className={cn(
            headingVariants({ variant: 'h2' }),
            'relative z-10 mb-6'
          )}
        >
          {title}
        </h2>
        <p className="text-muted-foreground relative z-10 mx-auto mb-10 max-w-2xl text-lg font-light md:text-xl">
          {description}
        </p>
        <Link
          href={getLocalePath(lang, 'docs')}
          className={cn(
            buttonVariants(),
            'relative z-10 items-center gap-2 px-8 py-4 text-lg shadow-lg'
          )}
        >
          {actionText}
          <ArrowRight className="size-5" />
        </Link>
      </div>
    </section>
  );
}
