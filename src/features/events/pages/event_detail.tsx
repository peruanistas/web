// src/pages/EventDetailBasic.tsx
import { Header } from '@common/components/header';
import { Footer } from '@common/components/footer';
import { Layout } from '@common/components/layout';

type Props = {
  id: string;
};

export function EventDetailBasic({ id }: Props) {
  return (
    <Layout>
      <Header />

      <main className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-2">
          Reparación de pistas en la intersección Los Zafiros, La Victoria
        </h1>
        <p className="text-gray-600 mb-1">Evento ID: {id}</p>
        <p className="text-gray-600 mb-4">Sábado, Mayo 17</p>

        <p className="mb-6">
          Reparaciones en la intersección Los Zafiros, clave para la movilidad en La Victoria y actualmente
          deteriorada por años de abandono.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        </div>
      </main>

      <Footer />
    </Layout>
  );
}
