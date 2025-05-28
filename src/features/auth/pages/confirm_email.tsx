import { Footer } from '@common/components/footer';
import { Header } from '@common/components/header';
import '@auth/styles/signup.scss';

export function ConfirmEmailPage() {
  return (
    <main className="signup-wrapper">
      <Header />
      <h1>
        Confirma tu correo electrónico para completar el registro.
      </h1>
      <Footer />
    </main>
  );
}
