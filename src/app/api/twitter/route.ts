import { NextResponse } from 'next/server';

const getBearerToken = async () => {
  console.log('Fetching bearer token...');
  const credentials = `${process.env.NEXT_PUBLIC_TWITTER_CLIENTID}:${process.env.NEXT_PUBLIC_CLIENT_SECRET}`;
  const base64Credentials = Buffer.from(credentials).toString('base64');
  console.log('Encoded credentials:', base64Credentials);

  try {
    const response = await fetch('https://api.twitter.com/oauth2/token', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${base64Credentials}`,
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      },
      body: 'grant_type=client_credentials',
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error response from Twitter token endpoint:', errorData);
      throw new Error('Failed to get Bearer Token');
    }

    const data = await response.json();
    console.log('Bearer token fetched successfully:', data.access_token);
    return data.access_token;
  } catch (error) {
    console.error('Error fetching bearer token:', error);
    throw error;
  }
};

const postToTwitter = async (message: string, link: string) => {
  console.log('Preparing to post to Twitter...');
  const bearerToken = await getBearerToken();

  console.log('Bearer token acquired:', bearerToken);

  const url = 'https://api.twitter.com/2/tweets';
  const payload = {
    text: `${message} ${link}`,
  };

  console.log('Payload for Twitter API:', payload);

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${bearerToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error response from Twitter API:', errorData);
      throw new Error('Failed to post to Twitter');
    }

    const data = await response.json();
    console.log('Successfully posted to Twitter:', data);
    return data;
  } catch (error) {
    console.error('Error posting to Twitter:', error);
    throw error;
  }
};

export async function POST(req: Request) {
  console.log('Received a POST request to /api/twitter');
  try {
    const body = await req.json();
    const { message, link } = body;

    console.log('Request body:', body);

    if (!message || !link) {
      console.error('Validation failed: Missing message or link');
      return NextResponse.json({ error: 'Message and link are required' }, { status: 400 });
    }

    const data = await postToTwitter(message, link);
    console.log('Twitter API response:', data);

    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    console.error('Unhandled error in /api/twitter:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
