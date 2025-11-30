import { USER_ENUMS } from './enums/roles.enum';
import { userInterfaceTypes } from './app/userTypes';

declare module 'next-auth' {
  interface User {
    token?: string;
    user?: any;
    // roles: USER_ENUMS[];
    // access_interface: userInterfaceTypes[];
  }

  interface Session {
    user: any;
    accessToken?: string;
    // roles: USER_ENUMS[];
    // access_interface: userInterfaceTypes[];
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    user: any;
    accessToken?: string;
    // roles: USER_ENUMS[];
    // access_interface: userInterfaceTypes[];
  }
}
