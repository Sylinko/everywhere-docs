import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import Image from 'next/image';
import { i18n, getLocalePath } from '../lib/i18n';
import { GithubIcon, DiscordIcon, QQIcon } from './common/icons';

export const linkItems = [
  {
    type: 'icon',
    url: 'https://github.com/DearVa/Everywhere',
    label: 'GitHub',
    text: 'GitHub',
    icon: GithubIcon,
    external: true,
  },
  {
    type: 'icon',
    url: 'https://discord.gg/5fyg6nE3yn',
    label: 'Discord',
    text: 'Discord',
    icon: DiscordIcon,
    external: true,
  },
  {
    type: 'icon',
    url: 'https://qm.qq.com/cgi-bin/qm/qr?k=wp9aDBBnLc7pYATqT99tB-N2ZP2ETmJC&jump_from=webapi&authKey=97qUJfsQoI70dUNcgBZ0C3HCZeiEn8inLT7pzg8x+KinbQwfIrHFu3dB2+aHMbRD',
    label: 'QQ',
    text: 'QQ',
    icon: QQIcon,
    external: true,
  },
] as const;

export const logo = (
  <Image
    src="/favicon.ico"
    alt="Everywhere"
    width={20}
    height={20}
    className="size-6"
  />
);

export function baseOptions(locale: string): BaseLayoutProps {
  return {
    nav: {
      title: (
        <>
          {logo}
          <span className="font-medium in-[header]:text-[15px] [.uwu_&]:hidden">
            Everywhere
          </span>
        </>
      ),
      url: getLocalePath(locale),
    },
    i18n,
  };
}
