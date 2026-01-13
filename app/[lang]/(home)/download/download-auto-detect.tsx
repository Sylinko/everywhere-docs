'use client';

import { useEffect, useState } from 'react';
import { Download } from 'lucide-react';
import { buttonVariants } from '@/components/common/variants';
import { cn } from '@/lib/cn';
import Link from 'next/link';
import { WindowsIcon, AppleIcon, LinuxIcon } from '@/components/common/icons';

interface OSInfo {
  id: 'windows' | 'macos' | 'linux' | 'unknown';
  name: string;
  icon: typeof WindowsIcon | typeof AppleIcon | typeof LinuxIcon;
  link: string;
}

export function DownloadAutoDetect({
  dictionary,
}: {
  dictionary: {
    downloadFor: string;
    loading: string;
    otherVersions: string;
  };
}) {
  const [os, setOs] = useState<OSInfo | null>(null);

  useEffect(() => {
    const t = setTimeout(() => {
      const userAgent = window.navigator.userAgent.toLowerCase();

      if (userAgent.indexOf('win') !== -1) {
        setOs({
          id: 'windows',
          name: 'Windows',
          icon: WindowsIcon,
          link: 'https://ghproxy.sylinko.com/download?product=everywhere&os=win-x64&type=setup&version=latest',
        });
      } else if (userAgent.indexOf('mac') !== -1) {
        setOs({
          id: 'macos',
          name: 'macOS',
          icon: AppleIcon,
          link: 'https://github.com/DearVa/Everywhere/releases',
        });
      } else if (
        userAgent.indexOf('linux') !== -1 ||
        userAgent.indexOf('x11') !== -1
      ) {
        setOs({
          id: 'linux',
          name: 'Linux',
          icon: LinuxIcon,
          link: 'https://github.com/DearVa/Everywhere/releases',
        });
      }
    }, 0);

    return () => clearTimeout(t);
  }, []);

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
    <div className="animate-in fade-in slide-in-from-bottom-4 flex flex-col items-center gap-6 duration-700">
      <div className="flex flex-col items-center gap-2">
        <Link
          href={os.link}
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
      </div>
    </div>
  );
}
