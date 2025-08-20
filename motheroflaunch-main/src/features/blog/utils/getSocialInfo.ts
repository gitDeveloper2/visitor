// @features/users/utils/getSocialInfo.ts
import { ISocialAccount } from '@features/users/schemas/Use';
import {
  GitHub,
  Twitter,
  LinkedIn,
  Facebook,
  Language,
} from '@mui/icons-material';

export function getSocialInfo(account: ISocialAccount) {
  const { type, username, url } = account;

  const platforms: Record<
    string,
    { baseUrl: string; Icon: React.ElementType }
  > = {
    github: { baseUrl: 'https://github.com/', Icon: GitHub },
    twitter: { baseUrl: 'https://twitter.com/', Icon: Twitter },
    linkedin: { baseUrl: 'https://linkedin.com/in/', Icon: LinkedIn },
    facebook: { baseUrl: 'https://facebook.com/', Icon: Facebook },
  };

  const platform = platforms[type.toLowerCase()];

  if (platform && username) {
    return {
      href: platform.baseUrl + username,
      Icon: platform.Icon,
      label: username,
    };
  }

  return {
    href: url,
    Icon: Language,
    label: url?.replace(/^https?:\/\//, '') ?? '',
  };
}
