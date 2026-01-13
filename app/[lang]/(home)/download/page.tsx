import Link from 'next/link';
import { Clock } from 'lucide-react';
import { buttonVariants, cardVariants } from '@/components/common/variants';
import { cn } from '@/lib/cn';
import { i18n } from '@/lib/i18n';
import type { Metadata } from 'next';
import { DownloadAutoDetect } from './download-auto-detect';
import { DynamicLink } from 'fumadocs-core/dynamic-link';
import {
  WindowsIcon,
  AppleIcon,
  LinuxIcon,
  GithubIcon,
} from '@/components/common/icons';

const DOWNLOAD_LINKS = {
  windows: {
    installer:
      'https://ghproxy.sylinko.com/download?product=everywhere&os=win-x64&type=setup&version=latest',
    portable:
      'https://ghproxy.sylinko.com/download?product=everywhere&os=win-x64&type=zip&version=latest',
  },
  macos: {
    silicon: '',
    intel: '',
  },
  linux: {
    deb: '',
    rpm: '',
    aur: '',
  },
} as const;

const contentMap = {
  'en-US': {
    title: 'Download',
    policies: {
      prefix: 'By downloading and using Everywhere, you agree to our ',
      terms: 'Terms of Service',
      and: ' and ',
      privacy: 'Privacy Policy',
      suffix: '.',
    },
    autoDetect: {
      downloadFor: 'Download for {os}',
      loading: 'Detecting your system...',
      otherVersions: 'View other versions',
    },
    comingSoon: 'Coming Soon',
    windows: {
      title: 'Windows',
      desc: 'Requires Windows 10 (19041) or later.',
      action: 'Download',
      distros: [
        { name: 'Installer', note: '.msi', key: 'installer' },
        { name: 'Portable', note: '.zip', key: 'portable' },
      ],
    },
    macos: {
      title: 'macOS',
      desc: 'Native support for Apple Silicon and Intel.',
      action: 'Download',
      distros: [
        { name: 'Apple Silicon (for M Series)', note: '.pkg', key: 'silicon' },
        { name: 'Intel (x64)', note: '.pkg', key: 'intel' },
      ],
    },
    linux: {
      title: 'Linux',
      desc: 'Community maintained distributions.',
      action: 'Download',
      distros: [
        { name: 'Debian / Ubuntu', note: '.deb', key: 'deb' },
        { name: 'Fedora / RedHat', note: '.rpm', key: 'rpm' },
        { name: 'Arch Linux', note: 'AUR', key: 'aur' },
      ],
    },
    history: {
      title: 'Release History',
      desc: 'View all past releases on GitHub.',
      action: 'View on GitHub',
    },
  },
  'zh-CN': {
    title: '下载',
    policies: {
      prefix: '下载并使用 Everywhere 即表示您同意我们的 ',
      terms: '服务条款',
      and: ' 和 ',
      privacy: '隐私政策',
      suffix: '。',
    },
    autoDetect: {
      downloadFor: '下载 {os} 版本',
      loading: '正在检测您的系统...',
      otherVersions: '查看其他版本',
    },
    comingSoon: '敬请期待',
    windows: {
      title: 'Windows',
      desc: '需要 Windows 10 (19041) 或更高版本。',
      action: '下载',
      distros: [
        { name: '便携版', note: '.zip', key: 'portable' },
        { name: '安装包', note: '.exe', key: 'installer' },
      ],
    },
    macos: {
      title: 'macOS',
      desc: '原生支持 Apple Silicon 和 Intel 芯片。',
      action: '下载',
      distros: [
        { name: 'Apple Silicon (M 系列芯片)', note: '.pkg', key: 'silicon' },
        { name: 'Intel (x64)', note: '.pkg', key: 'intel' },
      ],
    },
    linux: {
      title: 'Linux',
      desc: '社区维护版本。',
      action: '下载',
      distros: [
        { name: 'Debian / Ubuntu', note: '.deb', key: 'deb' },
        { name: 'Fedora / RedHat', note: '.rpm', key: 'rpm' },
        { name: 'Arch Linux', note: 'AUR', key: 'aur' },
      ],
    },
    history: {
      title: '版本历史',
      desc: '在 GitHub 上查看所有历史版本。',
      action: '查看 GitHub Releases',
    },
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const content =
    contentMap[lang as keyof typeof contentMap] || contentMap['en-US'];
  return {
    title: content.title,
    description: content.windows.desc,
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const content =
    contentMap[lang as keyof typeof contentMap] || contentMap['en-US'];

  const platforms = [
    {
      id: 'windows',
      icon: WindowsIcon,
      name: 'Windows',
      data: content.windows,
      link: 'https://github.com/DearVa/Everywhere/releases/latest',
      comingSoon: false,
    },
    {
      id: 'macos',
      icon: AppleIcon,
      name: 'macOS',
      data: content.macos,
      link: 'https://github.com/DearVa/Everywhere/releases',
      comingSoon: true,
    },
    {
      id: 'linux',
      icon: LinuxIcon,
      name: 'Linux',
      data: content.linux,
      link: 'https://github.com/DearVa/Everywhere/releases',
      comingSoon: true,
    },
  ];

  return (
    <main className="text-landing-foreground dark:text-landing-foreground-dark min-h-[calc(100vh-4rem)] pt-24 pb-16">
      <div className="mx-auto max-w-[1200px] px-6">
        {/* Hero Section */}
        <div className="mb-24 flex flex-col items-center text-center">
          <h1 className="text-foreground mb-6 text-4xl font-bold tracking-tight sm:text-6xl">
            <span>{content.title}</span>
            <span className="text-brand"> Everywhere</span>
          </h1>

          <div className="text-muted-foreground mb-10 text-sm">
            {content.policies.prefix}
            <DynamicLink
              href="/[lang]/terms"
              className="hover:text-foreground underline underline-offset-4"
            >
              {content.policies.terms}
            </DynamicLink>
            {content.policies.and}
            <DynamicLink
              href="/[lang]/privacy"
              className="hover:text-foreground underline underline-offset-4"
            >
              {content.policies.privacy}
            </DynamicLink>
            {content.policies.suffix}
          </div>

          <div className="w-full max-w-md">
            <DownloadAutoDetect dictionary={content.autoDetect} />
          </div>
        </div>

        {/* All Platforms Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {platforms.map((platform) => (
            <div
              key={platform.id}
              className={cn(
                cardVariants(),
                'hover:border-brand/50 relative flex flex-col overflow-hidden p-8 transition-all hover:shadow-lg'
              )}
            >
              <div className="bg-muted/50 mb-6 flex size-6 items-center justify-between justify-center">
                {platform.icon}
              </div>

              <h3 className="mb-2 text-xl font-semibold">
                {platform.data.title}
              </h3>
              <p className="text-muted-foreground mb-8 min-h-[40px] text-sm">
                {platform.data.desc}
              </p>

              <div className="relative mt-auto">
                {platform.comingSoon && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-md text-foreground font-medium">
                      {content.comingSoon}
                    </span>
                  </div>
                )}
                <div
                  className={cn(
                    'space-y-3',
                    platform.comingSoon &&
                      'pointer-events-none opacity-50 blur-sm select-none'
                  )}
                >
                  {platform.data.distros.map((distro, i) => {
                    const platformLinks = DOWNLOAD_LINKS[
                      platform.id as keyof typeof DOWNLOAD_LINKS
                    ] as Record<string, string>;
                    const href =
                      platformLinks[distro.key as keyof typeof platformLinks] ||
                      '#';

                    return (
                      <Link
                        key={i}
                        href={href}
                        className="bg-muted/50 ring-foreground/5 hover:bg-muted flex items-center justify-between rounded-lg px-3 py-2 text-sm ring-1 transition-colors ring-inset"
                      >
                        <span className="text-foreground/80 font-medium">
                          {distro.name}
                        </span>
                        <span className="text-muted-foreground text-xs">
                          {distro.note}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Release History */}
        <div className="border-border/50 mt-48 flex flex-col items-center justify-center border-t py-12">
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="text-muted-foreground flex items-center gap-2">
              <Clock className="size-4" />
              <span className="text-sm font-medium">
                {content.history.title}
              </span>
            </div>
            <p className="text-muted-foreground/80 text-sm">
              {content.history.desc}
            </p>
            <Link
              href="https://github.com/DearVa/Everywhere/releases"
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                buttonVariants({ variant: 'outline', size: 'sm' }),
                'gap-2 rounded-full px-4'
              )}
            >
              {GithubIcon}
              {content.history.action}
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

export async function generateStaticParams() {
  return i18n.languages.map((lang) => ({ lang }));
}
