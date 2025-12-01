'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { joiResolver } from '@hookform/resolvers/joi';
import { signIn, getSession } from 'next-auth/react';
import { Link, useRouter } from '@/i18n/navigation';
import { validationSchema } from '@/validations/auth.validations';
import toast from 'react-hot-toast';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { setCookie } from '@/utils/cookies';

type LoginFormInputs = {
  email: string;
  password: string;
};

const LoginForm = () => {
  const t = useTranslations('Auth.login');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>({
    resolver: joiResolver(validationSchema),
  });

  const onSubmit = async (data: LoginFormInputs) => {
    setIsLoading(true);

    try {
      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        // Handle CredentialsSignin error with friendly message
        if (result.error === 'CredentialsSignin') {
          toast.error(t('invalid_credentials'));
        } else {
          // Handle other errors with the actual error message or fallback
          const errorMessage = result.error.includes(
            'Invalid email or password',
          )
            ? t('invalid_credentials')
            : t('login_failed');
          toast.error(errorMessage);
        }
      } else if (result?.ok) {
        // Get the session to access the token
        const session = await getSession();
        // Set access token as cookie if available
        if (session?.accessToken) {
          setCookie('access-token', session.accessToken, 1); // 1 hour expiry to match session
        }

        toast.success('Login successful!');
        router.push('/');
      }
    } catch (err) {
      toast.error(t('login_failed'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="row y-gap-20" onSubmit={handleSubmit(onSubmit)}>
      <div className="col-12 d-flex flex-column items-center">
        <Image
          src="/img/logo/eficta-text.png"
          alt="logo icon"
          height={100}
          width={100}
          draggable={false}
          style={{ width: '100px' }}
        />
      </div>

      <div className="col-12">
        <div className="form-input">
          <input type="email" {...register('email')} />
          <label className="lh-1 text-14 text-light-1">{t('email')}</label>
        </div>
        {errors.email && (
          <span className="text-red-1 text-14 d-block mt-2">
            {errors.email.message}
          </span>
        )}
      </div>

      <div className="col-12">
        <div className="form-input">
          <input
            type="password"
            {...register('password', {
              required: 'Password is required',
              minLength: {
                value: 6,
                message: 'Password must be at least 6 characters',
              },
            })}
          />
          <label className="lh-1 text-14 text-light-1">{t('password')}</label>
        </div>
        {errors.password && (
          <span className="text-red-1 text-14 d-block mt-2">
            {errors.password.message}
          </span>
        )}
      </div>

      <div className="col-12">
        <Link
          href="/auth/forgot-password"
          className="text-14 fw-500 text-blue-1 underline"
        >
          {t('forgot_password')}
        </Link>
      </div>

      <div className="col-12">
        <button
          type="submit"
          disabled={isLoading}
          className="button py-20 -dark-1 bg-blue-1 text-white w-100"
        >
          {isLoading ? t('signing_in') : t('sign_in')}
          {!isLoading && <div className="icon-arrow-top-right ml-15" />}
        </button>
      </div>
      <span className="mt-10 text-center">
        {t('dont_have_account')}{' '}
        <Link href="/auth/signup" className="text-blue-1">
          {t('sign_up')}
        </Link>
      </span>
    </form>
  );
};

export default LoginForm;
