'use client';

import { useEffect, useState } from 'react';
import { Download, ChevronDown } from 'lucide-react';
import { buttonVariants } from '@/components/common/variants';
import { cn } from '@/lib/cn';
import Link from 'next/link';
import { WindowsIcon, AppleIcon, LinuxIcon } from '@/components/common/icons';
import { DownloadLinks } from '@/lib/constants';

interface Variant {
  name: string;
  note: string;
  key: string;
  link: string;
}

interface OSInfo {
  id: 'windows' | 'macos' | 'linux';
  name: string;
  icon: typeof WindowsIcon | typeof AppleIcon | typeof LinuxIcon;
  primaryVariant: Variant;
  otherVariants: Variant[];
}

export function DownloadAutoDetect({
  dictionary,
}: {
  dictionary: {
    downloadFor: string;
    loading: string;
    otherVersions: string;
    variants: {
      windows: { installer: string; portable: string };
      macos: { silicon: string; intel: string };
      linux: { deb: string; rpm: string; aur: string };
    };
  };
}) {
  const [os, setOs] = useState<OSInfo | null>(null);
  const [showVariants, setShowVariants] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => {
      const userAgent = window.navigator.userAgent.toLowerCase();

      if (userAgent.indexOf('win') !== -1) {
        setOs({
          id: 'windows',
          name: 'Windows',
          icon: WindowsIcon,
          primaryVariant: {
            name: dictionary.variants.windows.installer,
            note: '.msi',
            key: 'installer',
            link: DownloadLinks.windows.installer,
          },
          otherVariants: [
            {
              name: dictionary.variants.windows.portable,
              note: '.zip',
              key: 'portable',
              link: DownloadLinks.windows.portable,
            },
          ],
        });
      } else if (userAgent.indexOf('mac') !== -1) {
        // 默认推荐 Apple Silicon，因为大多数新 Mac 都是 M 系列芯片
        setOs({
          id: 'macos',
          name: 'macOS',
          icon: AppleIcon,
          primaryVariant: {
            name: dictionary.variants.macos.silicon,
            note: '.pkg',
            key: 'silicon',
            link: DownloadLinks.macos.silicon,
          },
          otherVariants: [
            {
              name: dictionary.variants.macos.intel,
              note: '.pkg',
              key: 'intel',
              link: DownloadLinks.macos.intel,
            },
          ],
        });
      } else if (
        userAgent.indexOf('linux') !== -1 ||
        userAgent.indexOf('x11') !== -1
      ) {
        const fallbackLink = 'https://github.com/DearVa/Everywhere/releases';
        setOs({
          id: 'linux',
          name: 'Linux',
          icon: LinuxIcon,
          primaryVariant: {
            name: dictionary.variants.linux.deb,
            note: '.deb',
            key: 'deb',
            link: DownloadLinks.linux.deb || fallbackLink,
          },
          otherVariants: [
            {
              name: dictionary.variants.linux.rpm,
              note: '.rpm',
              key: 'rpm',
              link: DownloadLinks.linux.rpm || fallbackLink,
            },
            {
              name: dictionary.variants.linux.aur,
              note: 'AUR',
              key: 'aur',
              link: DownloadLinks.linux.aur || fallbackLink,
            },
          ],
        });
      }
    }, 0);

    return () => clearTimeout(t);
  }, [dictionary.variants]);

  if (!os) {
    return (
      <div className="flex h-24 items-center justify-center">
        <span className="text-muted-foreground animate-pulse">
          {dictionary.loading}
        </span>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 flex flex-col items-center gap-4 duration-700">
      <div className="flex flex-col items-center gap-2">
        <Link
          href={os.primaryVariant.link}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            buttonVariants({ size: 'lg' }),
            'h-14 gap-3 rounded-full px-8 text-lg'
          )}
        >
          {os.icon}
          {dictionary.downloadFor.replace('{os}', os.name)}
          <Download className="size-5" />
        </Link>

        <span className="text-muted-foreground text-sm">
          {os.primaryVariant.name}{' '}
          <span className="text-muted-foreground/60">
            ({os.primaryVariant.note})
          </span>
        </span>
      </div>

      {os.otherVariants.length > 0 && (
        <div className="relative z-20 flex flex-col items-center">
          <button
            onClick={() => setShowVariants(!showVariants)}
            className="text-muted-foreground hover:text-foreground flex items-center gap-1 text-sm transition-colors"
          >
            {dictionary.otherVersions}
            <ChevronDown
              className={cn(
                'size-4 transition-transform duration-200',
                showVariants && 'rotate-180'
              )}
            />
          </button>

          {showVariants && (
            <div className="animate-in fade-in slide-in-from-top-2 bg-background absolute top-8 flex min-w-max flex-col gap-2 rounded-xl border p-3 shadow-lg duration-200">
              {os.otherVariants.map((variant) => (
                <Link
                  key={variant.key}
                  href={variant.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    buttonVariants({ variant: 'outline', size: 'sm' }),
                    'justify-between gap-4 rounded-full whitespace-nowrap'
                  )}
                >
                  <span>{variant.name}</span>
                  <span className="text-muted-foreground flex items-center gap-2 text-xs">
                    {variant.note}
                    <Download className="size-3" />
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
