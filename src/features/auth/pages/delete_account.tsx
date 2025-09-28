import { Footer } from '@common/components/footer';
import { Header } from '@common/components/header';
import { Layout } from '@common/components/layout';
import { PageBanner } from '@common/components/page_banner';
import { Mail, AlertTriangle } from 'lucide-react';

export function DeleteAccountPage() {
  return (
    <Layout>
      <Header />
      <PageBanner
        title="Eliminar Cuenta"
        description="Solicita la eliminación de tu cuenta de Peruanista"
        variant="event"
      />

      <main className="flex-1 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Warning Section */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 mb-8">
            <div className="flex items-start">
              <AlertTriangle className="h-6 w-6 text-amber-600 mt-1 mr-3 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-semibold text-amber-800 mb-2">
                  Importante
                </h3>
                <p className="text-amber-700">
                  La eliminación de tu cuenta es permanente y no se puede deshacer.
                  Se eliminarán todos tus datos, proyectos, eventos y publicaciones asociados a tu cuenta.
                </p>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <div className="text-center mb-8">
              <Mail className="h-12 w-12 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                ¿Cómo eliminar tu cuenta?
              </h2>
              <p className="text-gray-600 text-lg">
                Para solicitar la eliminación de tu cuenta, envía un correo electrónico con los siguientes datos:
              </p>
            </div>

            <div className="space-y-6">
              {/* Email Instructions */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Instrucciones:
                </h3>
                <div className="space-y-4">
                  <div>
                    <p className="font-medium text-gray-900 mb-2">1. Envía un correo a:</p>
                    <div className="bg-white border border-gray-300 rounded-md p-3 font-mono text-primary">
                      peruanista.pe@gmail.com
                    </div>
                  </div>

                  <div>
                    <p className="font-medium text-gray-900 mb-2">2. Con el asunto:</p>
                    <div className="bg-white border border-gray-300 rounded-md p-3 font-mono text-primary">
                      Eliminación de cuenta
                    </div>
                  </div>

                  <div>
                    <p className="font-medium text-gray-900 mb-2">3. Desde tu correo registrado:</p>
                    <p className="text-gray-600">
                      El correo debe ser enviado desde la misma dirección de correo electrónico
                      que utilizaste para registrarte en Peruanista.
                    </p>
                  </div>

                  <div>
                    <p className="font-medium text-gray-900 mb-2">4. No es necesario incluir:</p>
                    <p className="text-gray-600">
                      No necesitas proporcionar una razón para la eliminación de tu cuenta.
                    </p>
                  </div>
                </div>
              </div>

              {/* Process Information */}
              <div className="bg-blue-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-4">
                  ¿Qué sucede después?
                </h3>
                <div className="space-y-3 text-blue-800">
                  <p>• Recibirás una confirmación por correo electrónico</p>
                  <p>• Tu cuenta será eliminada en un plazo de 7 días hábiles</p>
                  <p>• Todos tus datos serán eliminados permanentemente</p>
                  <p>• No podrás recuperar tu cuenta una vez eliminada</p>
                </div>
              </div>

              {/* Contact Information */}
              <div className="text-center pt-6 border-t border-gray-200">
                <p className="text-gray-600">
                  Si tienes alguna pregunta sobre este proceso, puedes contactarnos en{' '}
                  <a
                    href="mailto:peruanista.pe@gmail.com"
                    className="text-primary hover:text-primary/80 font-medium"
                  >
                    peruanista.pe@gmail.com
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </Layout>
  );
}
