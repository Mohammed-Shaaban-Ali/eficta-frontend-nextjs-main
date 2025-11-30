import { signOut as nextAuthSignOut } from 'next-auth/react';
import { deleteCookie } from './cookies';

/**
 * Custom signOut function that clears the access token cookie
 */
export const signOut = async (
  options?: Parameters<typeof nextAuthSignOut>[0],
) => {
  // Clear the access token cookie
  deleteCookie('access-token');

  // Call the original signOut function
  return nextAuthSignOut(options);
};
