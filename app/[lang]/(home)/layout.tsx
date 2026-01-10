import { HomeLayout } from 'fumadocs-ui/layouts/home';
import { baseOptions, linkItems } from '@/components/layout.shared';
import {
  NavbarMenu,
  NavbarMenuContent,
  NavbarMenuLink,
  NavbarMenuTrigger,
} from 'fumadocs-ui/layouts/home/navbar';
import { Footer } from '@/components/footer';
import Link from 'fumadocs-core/link';
import Image from 'next/image';
import Preview from '@/public/banner.webp';
import {
  Rocket,
  CircleQuestionMark,
  Sparkles,
  PlugIcon,
  HelpCircle,
  type LucideIcon,
  Download,
  Gem,
  Users,
} from 'lucide-react';
import { getLocalePath } from '@/lib/i18n';

const docsSubNavItems = [
  { key: 'getting-started', icon: Rocket, path: '' },
  { key: 'faq', icon: CircleQuestionMark, path: '/faq' },
  { key: 'model-provider', icon: Sparkles, path: '/model-provider' },
  { key: 'chat-plugin', icon: PlugIcon, path: '/chat-plugin' },
  { key: 'support', icon: HelpCircle, path: '/community/support' },
] as const;

// Internationalization text
const i18nText: Record<
  string,
  Record<string, { text: string; desc: string }>
> = {
  'en-US': {
    title: { text: 'Docs', desc: '' },
    download: { text: 'Download', desc: '' },
    pricing: { text: 'Pricing', desc: '' },
    community: { text: 'Community', desc: '' },
    'getting-started': {
      text: 'Getting Started',
      desc: 'How to use and configure Everywhere.',
    },
    faq: {
      text: 'FAQ',
      desc: 'Frequently Asked Questions about Everywhere.',
    },
    'model-provider': {
      text: 'Model Providers',
      desc: 'Configure and use each supported model provider.',
    },
    'chat-plugin': {
      text: 'Chat Plugins',
      desc: 'Allow your assistant to accomplish more complex tasks.',
    },
    support: {
      text: 'Support',
      desc: 'Get support from community or our team.',
    },
  },
  'zh-CN': {
    title: { text: '文档', desc: '' },
    download: { text: '下载', desc: '' },
    pricing: { text: '定价', desc: '' },
    community: { text: '社区', desc: '' },
    'getting-started': {
      text: '快速开始',
      desc: '学习如何使用并配置 Everywhere。',
    },
    faq: {
      text: '常见问题',
      desc: '关于 Everywhere 的常见问题解答。',
    },
    'model-provider': {
      text: '模型提供商',
      desc: '配置和使用每个支持的模型提供商。',
    },
    'chat-plugin': {
      text: '聊天插件',
      desc: '让您的助手完成更复杂的任务。',
    },
    support: {
      text: '支持',
      desc: '从社区或我们的团队获得支持。',
    },
  },
};

const getTexts = (lang: string) => i18nText[lang] || i18nText['en-US'];

const buildNavItems = (lang: string, docsUrl: string) => {
  const texts = getTexts(lang);
  return docsSubNavItems.map(({ key, icon: Icon, path }) => ({
    text: texts[key].text,
    desc: texts[key].desc,
    url: `${docsUrl}${path}`,
    Icon,
  }));
};

function MenuLinkItem({
  item,
  className,
}: {
  item: { text: string; desc: string; url: string; Icon: LucideIcon };
  className?: string;
}) {
  const { Icon, text, desc, url } = item;
  return (
    <NavbarMenuLink href={url} className={className}>
      <Icon className="bg-fd-primary text-fd-primary-foreground mb-2 rounded-md p-1" />
      <p className="font-medium">{text}</p>
      <p className="text-fd-muted-foreground text-sm">{desc}</p>
    </NavbarMenuLink>
  );
}

export default async function Layout({
  params,
  children,
}: {
  params: Promise<{ lang: string }>;
  children: React.ReactNode;
}) {
  const { lang } = await params;
  const texts = getTexts(lang);
  const docsUrl = getLocalePath(lang, 'docs');
  const navItems = buildNavItems(lang, docsUrl);

  return (
    <div className="flex min-h-screen flex-col">
      <HomeLayout
        {...baseOptions(lang)}
        links={[
          // Mobile navigation
          {
            type: 'menu',
            on: 'menu',
            text: texts.title.text,
            items: navItems.map(({ text, url, Icon }) => ({
              text,
              url,
              icon: <Icon />,
            })),
          },
          {
            type: 'main',
            on: 'menu',
            text: texts.download.text,
            url: getLocalePath(lang, 'download'),
            icon: <Download />,
          },
          // {
          //   type: 'main',
          //   on: 'menu',
          //   text: texts.pricing.text,
          //   url: getLocalePath(lang, 'pricing'),
          //   icon: <Gem />,
          // },
          {
            type: 'main',
            on: 'menu',
            text: texts.community.text,
            url: getLocalePath(lang, 'docs/community/about'),
            icon: <Users />,
          },
          // Desktop navigation
          {
            type: 'custom',
            on: 'nav',
            children: (
              <NavbarMenu>
                <NavbarMenuTrigger>
                  <Link href={docsUrl}>{texts.title.text}</Link>
                </NavbarMenuTrigger>
                <NavbarMenuContent className="text-[15px]">
                  {/* First item with preview image */}
                  <NavbarMenuLink href={docsUrl} className="md:row-span-2">
                    <div className="-mx-3 -mt-3">
                      <Image
                        src={Preview}
                        alt="Preview"
                        className="rounded-t-lg object-cover"
                        loading="lazy"
                        fetchPriority="low"
                        style={{
                          maskImage:
                            'linear-gradient(to bottom,white 50%,transparent)',
                        }}
                      />
                    </div>
                    <p className="font-medium">{navItems[0].text}</p>
                    <p className="text-fd-muted-foreground text-sm">
                      {navItems[0].desc}
                    </p>
                  </NavbarMenuLink>
                  {/* Second column */}
                  <MenuLinkItem item={navItems[1]} className="lg:col-start-2" />
                  <MenuLinkItem item={navItems[2]} className="lg:col-start-2" />
                  {/* Third column */}
                  <MenuLinkItem
                    item={navItems[3]}
                    className="lg:col-start-3 lg:row-start-1"
                  />
                  <MenuLinkItem
                    item={navItems[4]}
                    className="lg:col-start-3 lg:row-start-2"
                  />
                </NavbarMenuContent>
              </NavbarMenu>
            ),
          },
          {
            type: 'main',
            on: 'nav',
            text: texts.download.text,
            url: getLocalePath(lang, 'download'),
            icon: <Download />,
          },
          // {
          //   type: 'main',
          //   on: 'nav',
          //   text: texts.pricing.text,
          //   url: getLocalePath(lang, 'pricing'),
          //   icon: <Gem />,
          // },
          {
            type: 'main',
            on: 'nav',
            text: texts.community.text,
            url: getLocalePath(lang, 'docs/community'),
            icon: <Users />,
          },
          ...linkItems,
        ]}
        className="flex-1 dark:bg-neutral-950 dark:[--color-fd-background:var(--color-neutral-950)]"
      >
        {children}
      </HomeLayout>
      <Footer lang={lang} />
    </div>
  );
}
