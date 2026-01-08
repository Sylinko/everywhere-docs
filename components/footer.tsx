import {
  GithubIcon,
  DiscordIcon,
  QQIcon,
  ProductHuntIcon,
  BilibiliIcon,
  YoutubeIcon,
  XiaohongshuIcon,
} from '@/lib/icons';
import { getLocalePath } from '@/lib/i18n';
import Link from 'fumadocs-core/link';

interface FooterProps {
  lang: string;
}

const communityLinks: { name: string; href: string; icon: React.ReactNode }[] =
  [
    {
      name: 'GitHub',
      href: 'https://github.com/DearVa/Everywhere',
      icon: GithubIcon,
    },
    {
      name: 'Discord',
      href: 'https://discord.gg/5fyg6nE3yn',
      icon: DiscordIcon,
    },
    {
      name: 'QQ',
      href: 'https://qm.qq.com/cgi-bin/qm/qr?k=wp9aDBBnLc7pYATqT99tB-N2ZP2ETmJC&jump_from=webapi&authKey=97qUJfsQoI70dUNcgBZ0C3HCZeiEn8inLT7pzg8x+KinbQwfIrHFu3dB2+aHMbRD',
      icon: QQIcon,
    },
    {
      name: 'Product Hunt',
      href: 'https://www.producthunt.com/products/everywhere',
      icon: ProductHuntIcon,
    },
  ];

const followUsLinks: { name: string; href: string; icon: React.ReactNode }[] = [
  {
    name: 'Bilibili',
    href: 'https://space.bilibili.com/12879829',
    icon: BilibiliIcon,
  },
  {
    name: 'Youtube',
    href: 'https://www.youtube.com/@everywhere_official',
    icon: YoutubeIcon,
  },
  {
    name: 'Xiaohongshu',
    href: 'https://www.xiaohongshu.com/user/profile/60261d54000000000101f684',
    icon: XiaohongshuIcon,
  },
];

const relatedProjectLinks: { label: string; href: string }[] = [
  {
    label: 'LiveMarkdown.Avalonia',
    href: 'https://github.com/DearVa/LiveMarkdown.Avalonia',
  },
];

const sylinkoLinks: {
  key: keyof FooterTranslation['sections']['aboutSylinko'];
  href: string;
}[] = [
  {
    key: 'officialWebsite',
    href: 'https://sylinko.com',
  },
  {
    key: 'contactUs',
    href: 'mailto:contact@sylinko.com',
  },
];

const legalLinks: {
  key: keyof FooterTranslation['sections']['legalAndPolicies'];
  href: string;
  external?: boolean;
}[] = [
  {
    key: 'privacyPolicy',
    href: '/privacy',
  },
  {
    key: 'termsOfService',
    href: '/terms',
  },
  {
    key: 'contributorLicenseAgreement',
    href: 'https://github.com/DearVa/Everywhere/blob/main/CLA.md',
    external: true,
  },
];

interface FooterTranslation {
  sections: {
    joinOurCommunity: {
      title: string;
    };
    followUs: {
      title: string;
    };
    sponsorUs: {
      title: string;
      afdian: string;
      buyMeACoffee: string;
    };
    relatedProjects: string;
    legalAndPolicies: {
      title: string;
      privacyPolicy: string;
      termsOfService: string;
      contributorLicenseAgreement: string;
    };
    aboutSylinko: {
      title: string;
      officialWebsite: string;
      contactUs: string;
    };
  };
  license: {
    prefix: string;
    linkText: string;
    suffix: string;
  };
  copyright: {
    prefix: string;
    suffix: string;
  };
}

const translations: Record<string, FooterTranslation> = {
  'en-US': {
    sections: {
      joinOurCommunity: {
        title: 'Join Our Community',
      },
      followUs: {
        title: 'Follow Us',
      },
      sponsorUs: {
        title: 'Sponsor Us',
        afdian: 'Afdian',
        buyMeACoffee: 'Buy Me A Coffee',
      },
      relatedProjects: 'Related Projects',
      legalAndPolicies: {
        title: 'Legal & Policies',
        privacyPolicy: 'Privacy Policy',
        termsOfService: 'Terms of Service',
        contributorLicenseAgreement: 'Contributor License Agreement',
      },
      aboutSylinko: {
        title: 'About Sylinko',
        officialWebsite: 'Official Website',
        contactUs: 'Contact Us',
      },
    },
    license: {
      prefix: 'Released under the ',
      linkText: 'Business Source License 1.1',
      suffix: '.',
    },
    copyright: {
      prefix: 'Copyright © ',
      suffix: ' Sylinko Inc. All rights reserved.',
    },
  },
  'zh-CN': {
    sections: {
      joinOurCommunity: {
        title: '加入社群',
      },
      followUs: {
        title: '关注我们',
      },
      sponsorUs: {
        title: '赞助我们',
        afdian: '爱发电',
        buyMeACoffee: 'Buy Me A Coffee',
      },
      relatedProjects: '相关项目',
      legalAndPolicies: {
        title: '法律与政策',
        privacyPolicy: '隐私政策',
        termsOfService: '服务条款',
        contributorLicenseAgreement: '贡献者许可协议',
      },
      aboutSylinko: {
        title: '关于 Sylinko',
        officialWebsite: '官方网站',
        contactUs: '联系我们',
      },
    },
    license: {
      prefix: '基于 ',
      linkText: 'Business Source License 1.1',
      suffix: ' 许可发布',
    },
    copyright: {
      prefix: '版权所有 © ',
      suffix: ' Sylinko Inc. 保留所有权利。',
    },
  },
};

// ============================================
// Footer Component
// ============================================
export function Footer({ lang }: FooterProps) {
  const t = translations[lang] || translations['en-US'];

  return (
    <footer className="border-fd-border bg-fd-card/30 mt-auto border-t backdrop-blur-sm">
      <div className="mx-auto max-w-[1400px] px-6 py-12">
        {/* Top: Links Grid */}
        <div className="grid grid-cols-2 gap-x-8 gap-y-10 pb-10 md:grid-cols-5 lg:gap-x-12">
          {/* Section 1: Community & Follow Us (Icons) */}
          <div className="flex flex-col gap-6">
            <div>
              <h3 className="text-fd-foreground mb-4 text-sm font-semibold">
                {t.sections.joinOurCommunity.title}
              </h3>
              <div className="flex flex-wrap gap-4">
                {communityLinks.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-fd-muted-foreground hover:text-fd-foreground transition-colors"
                    aria-label={item.name}
                    title={item.name}
                  >
                    {item.icon}
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-fd-foreground mb-4 text-sm font-semibold">
                {t.sections.followUs.title}
              </h3>
              <div className="flex flex-wrap gap-4">
                {followUsLinks.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-fd-muted-foreground hover:text-fd-foreground transition-colors"
                    aria-label={item.name}
                    title={item.name}
                  >
                    {item.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Section 2: Sponsor Us (Text) */}
          <div>
            <h3 className="text-fd-foreground mb-4 text-sm font-semibold">
              {t.sections.sponsorUs.title}
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="https://afdian.tv/a/DearVa"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-fd-muted-foreground hover:text-fd-foreground text-sm transition-colors"
                >
                  {t.sections.sponsorUs.afdian}
                </a>
              </li>
              <li>
                <a
                  href="https://buymeacoffee.com/artemisli"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-fd-muted-foreground hover:text-fd-foreground text-sm transition-colors"
                >
                  {t.sections.sponsorUs.buyMeACoffee}
                </a>
              </li>
            </ul>
          </div>

          {/* Section 3: Related Projects (Text) */}
          <div>
            <h3 className="text-fd-foreground mb-4 text-sm font-semibold">
              {t.sections.relatedProjects}
            </h3>
            <ul className="space-y-3">
              {relatedProjectLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-fd-muted-foreground hover:text-fd-foreground text-sm transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Section 4: Legal & Policies (Text) */}
          <div>
            <h3 className="text-fd-foreground mb-4 text-sm font-semibold">
              {t.sections.legalAndPolicies.title}
            </h3>
            <ul className="space-y-3">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={
                      link.external ? link.href : getLocalePath(lang, link.href)
                    }
                    target={link.external ? '_blank' : undefined}
                    rel={link.external ? 'noopener noreferrer' : undefined}
                    className="text-fd-muted-foreground hover:text-fd-foreground text-sm transition-colors"
                  >
                    {t.sections.legalAndPolicies[link.key]}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Section 5: About Sylinko (Text) */}
          <div>
            <h3 className="text-fd-foreground mb-4 text-sm font-semibold">
              {t.sections.aboutSylinko.title}
            </h3>
            <ul className="space-y-3">
              {sylinkoLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-fd-muted-foreground hover:text-fd-foreground text-sm transition-colors"
                  >
                    {t.sections.aboutSylinko[link.key]}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom: License and Copyright */}
        <div className="border-fd-border flex flex-col items-center justify-between gap-4 border-t pt-8 sm:flex-row">
          <p className="text-fd-muted-foreground text-xs">
            {t.license.prefix}
            <a
              href="https://github.com/DearVa/Everywhere/blob/main/LICENSE"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-fd-foreground decoration-fd-muted-foreground/50 hover:decoration-fd-foreground underline transition-colors"
            >
              {t.license.linkText}
            </a>
            {t.license.suffix}
          </p>
          <p className="text-fd-muted-foreground text-xs">
            {t.copyright.prefix}
            {new Date().getFullYear()}
            {t.copyright.suffix}
          </p>
        </div>
      </div>
    </footer>
  );
}
