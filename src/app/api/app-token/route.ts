import { cookies } from 'next/headers';
import axios from 'axios';

export async function GET() {
  const cookieStore = await cookies();
  let apiToken = cookieStore.get('api-token')?.value;
  if (!apiToken) {
    try {
      const res = await axios.post(
        process.env.NEXT_PUBLIC_APP_EFICTA + '/api/api-auth/login',
        {
          username: process.env.NEXT_PUBLIC_APP_USERNAME,
          password: process.env.NEXT_PUBLIC_APP_PASSWORD,
        },
      );
      apiToken = res.data.access_token as string;
      console.log('New API Token: apiiToken');
    } catch (error) {
      console.error('Login failed:', error);
      return Response.json({ error: 'Authentication failed' }, { status: 500 });
    }
  }

  return Response.json({ token: apiToken });
}
