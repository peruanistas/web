import { Footer } from '@common/components/footer';
import { Header } from '@common/components/header';
import { SignUpForm } from '@auth/components/signup_form';
import '@auth/styles/signup.scss';
import { Layout } from '@common/components/layout';

export function SignUpPage() {
  return (
    <Layout>
      <main className="signup-wrapper">
        <Header />
        <SignUpForm />
        <Footer />
      </main>
    </Layout>
  );
}
