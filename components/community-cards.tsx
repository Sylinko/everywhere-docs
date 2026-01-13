'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/cn'; // Assuming cn utility exists here
import { cardVariants } from './variants';
import { GithubIcon } from '@/components/icons';

// --- Types ---

export interface SocialLink {
  icon: React.ReactNode;
  href: string;
  label?: string; // For a11y
}

export interface SponsorInfo {
  platform: string;
  href: string;
}

export interface CoreTeamCardProps {
  avatar?: string;
  name?: string;
  github?: string;
  role: string;
  links: SocialLink[];
  sponsor?: SponsorInfo;
  className?: string; // allow overrides
}

export interface CommunityMemberCardProps {
  avatar?: string;
  name?: string;
  github?: string;
  githubUrl?: string; // fallback or override
  className?: string;
}

export interface Sponsor {
  url?: string;
  name?: string;
  avatar?: string;
  login?: string;
  source?: 'afdian' | 'manual';
}

export interface SponsorCardProps {
  sponsor: Sponsor;
  className?: string;
}

interface SponsorResponse {
  total_count: number;
  data: {
    afdian: Sponsor[];
    manual: Sponsor[];
  };
}

// --- Components ---

/**
 * Core Team Member Card
 * Vertical layout: Avatar -> Username -> Role -> Social Links -> Sponsor Button
 */
export const CoreTeamCard: React.FC<CoreTeamCardProps> = ({
  avatar,
  name,
  github,
  role,
  links,
  className,
}) => {
  const displayAvatar =
    avatar ?? (github ? `https://github.com/${github}.png` : '');
  const displayName = name ?? github;

  return (
    <div
      className={cn(
        cardVariants(),
        'flex flex-col items-center justify-center text-center',
        className
      )}
    >
      <div className="relative mt-3 size-16 overflow-hidden rounded-full">
        {displayAvatar && (
          <Image
            src={displayAvatar}
            alt={displayName || 'User'}
            fill
            className="object-cover"
            unoptimized
          />
        )}
      </div>

      <div className="flex flex-col">
        <h3 className="mt-4 mb-1 text-lg font-semibold">{displayName}</h3>
        <p className="text-fd-muted-foreground text-sm">{role}</p>
      </div>

      <div className="mb-6 flex items-center gap-4">
        {links.map((link, idx) => (
          <Link
            key={idx}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label={link.label}
          >
            {link.icon}
          </Link>
        ))}
      </div>
    </div>
  );
};

/**
 * Community Member Card
 * Left: Github Avatar
 * Right Column: Username (Top Right), Github Icon (Bottom Right)
 */
export const CommunityMemberCard: React.FC<CommunityMemberCardProps> = ({
  avatar,
  name,
  github,
  githubUrl,
  className,
}) => {
  const displayAvatar =
    avatar ?? (github ? `https://github.com/${github}.png` : '');
  const displayName = name ?? github;
  const displayUrl =
    githubUrl ?? (github ? `https://github.com/${github}` : '#');

  return (
    <div
      className={cn(
        cardVariants(),
        'flex flex-row items-center gap-4',
        className
      )}
    >
      <div className="relative size-16 shrink-0 overflow-hidden rounded-full">
        {displayAvatar && (
          <Image
            src={displayAvatar}
            alt={displayName || 'Member'}
            fill
            className="object-cover"
            unoptimized
          />
        )}
      </div>
      <div className="flex flex-1 flex-col justify-between gap-1">
        <div className="text-lg font-medium">{displayName}</div>
        <Link
          href={displayUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          {GithubIcon}
        </Link>
      </div>
    </div>
  );
};

/**
 * Community Sponsor Card
 * Small card.
 * Left: Avatar
 * Right: Name and Source
 */
export const SponsorCard: React.FC<SponsorCardProps> = ({
  sponsor,
  className,
}) => {
  const displayAvatar =
    sponsor.avatar ??
    (sponsor.login ? `https://github.com/${sponsor.login}.png` : '');
  const displayName = sponsor.name ?? sponsor.login;
  const displayUrl =
    sponsor.url ??
    (sponsor.login ? `https://github.com/${sponsor.login}` : '#');

  let sourceLabel = '';
  let sourceClassName = '';
  if (sponsor.source === 'afdian') {
    sourceLabel = '爱发电';
    sourceClassName =
      'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-300';
  } else {
    sourceLabel = '';
    sourceClassName = '';
  }

  return (
    <Link
      href={displayUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        cardVariants(),
        // Override padding for small size
        'hover:bg-fd-accent/50 flex flex-row items-center gap-3 p-3 transition-colors',
        className
      )}
    >
      <div className="bg-muted relative flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-full border">
        {/* Handle cases where avatar might be empty or broken? assuming provided */}
        {displayAvatar ? (
          <Image
            src={displayAvatar}
            alt={displayName || 'Sponsor'}
            fill
            className="object-cover"
            unoptimized
          />
        ) : (
          <div className="text-muted-foreground text-xs">?</div>
        )}
      </div>
      <div className="flex min-w-0 flex-col gap-0.5 overflow-hidden">
        <span className="truncate text-sm leading-none font-medium">
          {displayName}
        </span>
        {sourceLabel && sponsor.source !== 'manual' && (
          <span
            className={`mt-1 w-fit rounded-full px-1.5 py-0.5 text-xs leading-none ${sourceClassName}`}
          >
            {sourceLabel}
          </span>
        )}
      </div>
    </Link>
  );
};

export const SponsorList: React.FC = () => {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchSponsors = async () => {
      try {
        const response = await fetch('https://sponsor-api.sylinko.com/');
        if (!response.ok) throw new Error('Failed to fetch');
        const data: SponsorResponse = await response.json();

        const afdianSponsors = (data.data.afdian || []).map((s) => ({
          ...s,
          source: 'afdian' as const,
        }));
        const manualSponsors = (data.data.manual || []).map((s) => ({
          ...s,
          source: 'manual' as const,
        }));

        setSponsors([...manualSponsors, ...afdianSponsors]);
      } catch (e) {
        console.error(e);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchSponsors();
  }, []);

  if (loading) {
    return (
      <div className="text-muted-foreground animate-pulse text-center">
        Loading contributors...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500">Failed to load sponsors.</div>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      {sponsors.map((sponsor, idx) => (
        <SponsorCard key={`${sponsor.url}-${idx}`} sponsor={sponsor} />
      ))}
    </div>
  );
};
