import { Footer } from '@common/components/footer';
import { Header } from '@common/components/header';
import { CompleteProfileForm } from '@auth/components/complete_register_form';
import '@auth/styles/signup.scss';

export function CompleteRegisterPage() {
  return (
    <main className="signup-wrapper">
      <Header />
      <CompleteProfileForm />
      <Footer />
    </main>
  );
}
