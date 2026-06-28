import { setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { Link } from '@/i18n/navigation';
import { LegalShell, LegalSection } from '@/components/legal/LegalShell';
import type { Metadata } from 'next';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const metadata: Metadata = {
  title: 'Términos y Condiciones — Minibox',
  description: 'Condiciones de uso del servicio Minibox.',
};

export default async function TermsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <LegalShell title="Términos y Condiciones" updatedAt="27 de junio de 2026">
      <p>
        Estos Términos y Condiciones regulan el uso de <strong>Minibox</strong>, operado por{' '}
        <strong>Alexander Eberle</strong> (CUIT 20-38674516-2), con domicilio en la República
        Argentina. Al crear una cuenta o conectar tus redes, aceptás estos Términos. Si no estás de
        acuerdo, no utilices el servicio.
      </p>

      <LegalSection title="1. El servicio">
        <p>
          Minibox es un servicio de software como servicio (SaaS) que ayuda a comercios y
          emprendedores a <strong>responder automáticamente</strong> los mensajes directos (DMs)
          de sus cuentas de Instagram y Facebook. El sistema analiza el perfil del negocio, propone
          preguntas frecuentes y respuestas, y —una vez activado por el Cliente— responde de forma
          automática las consultas dentro del alcance configurado.
        </p>
      </LegalSection>

      <LegalSection title="2. Requisitos y cuenta">
        <p>
          Para usar Minibox necesitás una cuenta de Meta con una Página de Facebook y/o una cuenta
          profesional de Instagram, y autorizar la conexión mediante el inicio de sesión de Meta.
          Sos responsable de la veracidad de los datos que proporcionás y de mantener la
          confidencialidad de tu acceso. Debés tener capacidad legal para contratar.
        </p>
      </LegalSection>

      <LegalSection title="3. Uso aceptable">
        <p>Al usar Minibox te comprometés a no utilizarlo para:</p>
        <ul className="list-disc pl-5 flex flex-col gap-1">
          <li>enviar spam, mensajes masivos no solicitados o contenido engañoso;</li>
          <li>difundir contenido ilegal, difamatorio, que infrinja derechos de terceros o dañino;</li>
          <li>
            violar las políticas de Meta (Plataforma, Mensajería y Comunidad) ni las leyes
            aplicables;
          </li>
          <li>intentar vulnerar la seguridad del servicio o acceder a datos de otros Clientes.</li>
        </ul>
        <p>
          El incumplimiento puede derivar en la suspensión o baja inmediata de la cuenta, sin
          perjuicio de las acciones que correspondan.
        </p>
      </LegalSection>

      <LegalSection title="4. Respuestas automáticas e inteligencia artificial">
        <p>
          Las respuestas son generadas por modelos de inteligencia artificial a partir de la
          configuración del Cliente. <strong>Pueden contener errores o imprecisiones.</strong> El
          Cliente es el único responsable de revisar la configuración, supervisar el
          comportamiento del asistente y de toda comunicación que se envíe a sus clientes finales.
          Minibox no garantiza que las respuestas sean exactas, completas o adecuadas para cada
          caso.
        </p>
      </LegalSection>

      <LegalSection title="5. Planes, precios y pagos">
        <p>
          Minibox ofrece un nivel de uso <strong>gratuito y limitado</strong> y planes pagos. Los
          precios, límites y condiciones vigentes se muestran dentro de la aplicación al momento de
          la contratación. Los pagos se procesan a través de proveedores externos (Creem y Mercado
          Pago); Minibox no almacena los datos de tu medio de pago. Salvo que la ley disponga lo
          contrario, los importes abonados no son reembolsables una vez prestado el servicio del
          período.
        </p>
      </LegalSection>

      <LegalSection title="6. Baja y cancelación">
        <p>
          Podés dejar de usar el servicio y desconectar tus cuentas en cualquier momento desde la
          aplicación o escribiéndonos. La cancelación detiene la facturación de períodos futuros.
          Podemos suspender o discontinuar el servicio (total o parcialmente) avisando con
          antelación razonable cuando sea posible.
        </p>
      </LegalSection>

      <LegalSection title="7. Propiedad intelectual">
        <p>
          El software, la marca y los contenidos de Minibox son de su titular. Estos Términos no te
          otorgan ningún derecho sobre ellos más allá del uso del servicio. El contenido que el
          Cliente genera o carga (preguntas, respuestas, configuración) sigue siendo suyo; nos
          otorga una licencia limitada para procesarlo con el fin de prestar el servicio.
        </p>
      </LegalSection>

      <LegalSection title="8. Limitación de responsabilidad">
        <p>
          El servicio se presta &ldquo;tal cual&rdquo; y &ldquo;según disponibilidad&rdquo;, sin
          garantías de funcionamiento ininterrumpido o libre de errores. En la máxima medida
          permitida por la ley, Minibox y su operador no serán responsables por daños indirectos,
          lucro cesante, pérdida de datos o perjuicios derivados del uso o la imposibilidad de uso
          del servicio, ni por el contenido de las respuestas automáticas. La responsabilidad total
          se limita a los importes efectivamente abonados por el Cliente en los tres (3) meses
          previos al hecho que origina el reclamo.
        </p>
      </LegalSection>

      <LegalSection title="9. Privacidad">
        <p>
          El tratamiento de datos se rige por nuestra{' '}
          <Link className="underline" href="/privacy">
            Política de Privacidad
          </Link>
          , que forma parte integrante de estos Términos.
        </p>
      </LegalSection>

      <LegalSection title="10. Ley aplicable y jurisdicción">
        <p>
          Estos Términos se rigen por las leyes de la República Argentina. Ante cualquier
          controversia, las partes se someten a los tribunales ordinarios competentes de la
          República Argentina, renunciando a cualquier otro fuero o jurisdicción.
        </p>
      </LegalSection>

      <LegalSection title="11. Contacto">
        <p>
          Por cualquier consulta sobre estos Términos, escribinos a{' '}
          <a className="underline" href="mailto:alexander171294@gmail.com">
            alexander171294@gmail.com
          </a>
          .
        </p>
      </LegalSection>
    </LegalShell>
  );
}
