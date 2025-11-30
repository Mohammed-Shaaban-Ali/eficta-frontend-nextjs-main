import LoginWithSocial from '@/views/common/LoginWithSocial';
import SignUpForm from '@/views/common/SignUpForm';

export const metadata = {
  title: 'Sign Up || Efica ',
  description: 'Efica ',
};

const SignUp = () => {
  return (
    <>
      <section
        className="bg-blue-2 d-flex items-center justify-center"
        style={{ minHeight: '100vh' }}
      >
        <div className="container">
          <div className="row justify-center">
            <div className="col-xl-6 col-lg-7 col-md-9">
              <div className="px-50 py-50 sm:px-20 sm:py-20 bg-white shadow-4 rounded-4">
                <SignUpForm />
                <div className="row y-gap-20 pt-30">
                  <div className="col-12">
                    <div className="text-center">or sign in with</div>
                  </div>
                  <LoginWithSocial />
                  <div className="col-12">
                    <div className="text-center px-30">
                      By creating an account, you agree to our Terms of Service
                      and Privacy Statement.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default SignUp;
