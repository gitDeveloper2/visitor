const FACEBOOK_ACCESS_TOKEN = process.env.NEXT_PUBLIC_FACEBOOK_ACCESS_TOKEN;
const FACEBOOK_PAGE_ID = process.env.NEXT_PUBLIC_FACEBOOK_PAGE_ID;

export const handlePostToMultiplePlatforms = async ({
  message,
  link,
  platforms,
}: {
  message: string;
  link: string;
  platforms: string[];
}) => {
  for (const platform of platforms) {
    if (platform === 'facebook') {
      await postToFacebook(message, link); // Facebook API request
    } else if (platform === 'twitter') {
      await postToTwitter(message, link); // Twitter API request
    }
    // Add more platforms as needed
  }
};

const postToFacebook = async (message: string, link: string) => {
  const url = `https://graph.facebook.com/v17.0/${FACEBOOK_PAGE_ID}/feed`;
  

  const payload = {
    message,
    access_token: FACEBOOK_ACCESS_TOKEN, // Directly use the environment variable
    link,
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error('Failed to post to Facebook');
  }

  const data = await response.json();
};

const getBearerToken = async () => {
  const credentials = `${process.env.NEXT_PUBLIC_TWITTER_CLIENTID}:${process.env.NEXT_PUBLIC_CLIENT_SECRET}`;
  const base64Credentials = Buffer.from(credentials).toString('base64');

  const response = await fetch('https://api.twitter.com/oauth2/token', {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${base64Credentials}`,
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    },
    body: 'grant_type=client_credentials',
  });

  if (!response.ok) {
    throw new Error('Failed to get Bearer Token');
  }

  const data = await response.json();
  return data.access_token; // This is the Bearer Token
};

const postToTwitter = async (message: string, link: string) => {
  const response = await fetch('/api/twitter', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ message, link }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Failed to post to Twitter: ${errorData.error}`);
  }

  const data = await response.json();
};


