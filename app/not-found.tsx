'use client';

import { buttonVariants } from '@/components/ui/button';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const i18nMap = {
  'en-US': {
    title: 'Page Not Found',
    description: 'We searched Everywhere, but this place remains untouched.',
    action: 'Take me home',
  },
  'zh-CN': {
    title: '页面未找到',
    description: '我们寻遍了 Everywhere，唯独此处是无人踏足的秘境。',
    action: '返回主页',
  },
};

export default function NotFound() {
  const pathname = usePathname();
  const langSegment = pathname?.split('/')[1];

  const lang =
    langSegment && Object.keys(i18nMap).includes(langSegment)
      ? (langSegment as keyof typeof i18nMap)
      : 'en-US';

  const content = i18nMap[lang];

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 text-center">
      <h1 className="text-8xl font-bold">404</h1>
      <h2 className="mt-4 text-3xl font-semibold">{content.title}</h2>
      <p className="text-muted-foreground mt-4 mb-8 text-xl">
        {content.description}
      </p>
      <Link
        href={`/${lang}/`}
        className={buttonVariants({
          color: 'primary',
          className: 'w-full sm:w-auto',
        })}
      >
        {content.action}
      </Link>
    </div>
  );
}
