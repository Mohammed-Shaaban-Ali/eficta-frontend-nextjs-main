import { NextAuthProvider } from '@/contexts/nextAuthProvider';
import ReactQueryProvider from '../providers/React-Query.provider';
import { Provider } from 'react-redux';
import { store } from '@/store/store';

type Props = {
  children: React.ReactNode;
};

const Providers = (props: Props) => {
  const { children } = props;

  return (
    <Provider store={store}>
      <NextAuthProvider basePath={process.env.NEXTAUTH_BASEPATH}>
        <ReactQueryProvider>{children}</ReactQueryProvider>
      </NextAuthProvider>
    </Provider>
  );
};

export default Providers;
