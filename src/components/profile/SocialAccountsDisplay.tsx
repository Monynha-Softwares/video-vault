import React from 'react';
import { useTranslation } from 'react-i18next';
import { UserSocialAccount } from '@/features/user_social_accounts';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { getIcon, type IconName } from '@/flyweights/IconFactory';

interface SocialAccountsDisplayProps {
  socialAccounts: UserSocialAccount[];
}

const platformIconMap: Record<string, IconName> = {
  instagram: 'Instagram',
  github: 'Github',
  youtube: 'Youtube',
  twitter: 'Twitter',
  linkedin: 'Linkedin',
  facebook: 'Facebook',
  website: 'Globe',
};

const getPlatformName = (platform: string, t: (key: string) => string) => {
  switch (platform) {
    case 'instagram': return t('profile.social.platform.instagram');
    case 'github': return t('profile.social.platform.github');
    case 'youtube': return t('profile.social.platform.youtube');
    case 'twitter': return t('profile.social.platform.twitter');
    case 'linkedin': return t('profile.social.platform.linkedin');
    case 'facebook': return t('profile.social.platform.facebook');
    case 'website': return t('profile.social.platform.website');
    default: return platform;
  }
};

export const SocialAccountsDisplay: React.FC<SocialAccountsDisplayProps> = ({ socialAccounts }) => {
  const { t } = useTranslation();

  if (!socialAccounts || socialAccounts.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-3">
      <TooltipProvider>
        {socialAccounts.map((account) => {
          const Icon = getIcon(platformIconMap[account.platform] ?? 'Link');
          const platformName = getPlatformName(account.platform, t);

          return (
            <Tooltip key={account.id}>
              <TooltipTrigger asChild>
                <Button asChild variant="outline" size="icon" className="rounded-full">
                  <a href={account.url} target="_blank" rel="noopener noreferrer" aria-label={platformName}>
                    <Icon className="w-5 h-5" />
                  </a>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{platformName}</p>
              </TooltipContent>
            </Tooltip>
          );
        })}
      </TooltipProvider>
    </div>
  );
};
