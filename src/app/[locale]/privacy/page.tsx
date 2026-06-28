import { setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { LegalShell, LegalSection } from '@/components/legal/LegalShell';
import type { Metadata } from 'next';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const metadata: Metadata = {
  title: 'Política de Privacidad — Minibox',
  description: 'Cómo Minibox trata los datos personales y de las cuentas conectadas.',
};

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <LegalShell title="Política de Privacidad" updatedAt="27 de junio de 2026">
      <p>
        Esta Política de Privacidad describe cómo <strong>Minibox</strong>, operado por{' '}
        <strong>Alexander Eberle</strong> (CUIT 20-38674516-2), con domicilio en la República
        Argentina (en adelante, &ldquo;Minibox&rdquo;, &ldquo;nosotros&rdquo;), trata la información
        personal en el marco del servicio de respuestas automáticas para mensajes directos de
        Instagram y Facebook. Para cualquier consulta sobre privacidad podés escribirnos a{' '}
        <a className="underline" href="mailto:alexander171294@gmail.com">
          alexander171294@gmail.com
        </a>
        .
      </p>

      <LegalSection title="1. Roles: quién es responsable de qué">
        <p>
          Minibox se ofrece a comercios, emprendedores y empresas (&ldquo;el Cliente&rdquo;) para
          automatizar respuestas a sus clientes finales. Respecto de los datos de los{' '}
          <strong>clientes finales</strong> (las personas que escriben a las cuentas conectadas),
          el Cliente es el <strong>responsable del tratamiento</strong> y Minibox actúa como{' '}
          <strong>encargado</strong>, procesando esos datos por cuenta y orden del Cliente. Respecto
          de los datos de la cuenta del propio Cliente, Minibox es responsable.
        </p>
      </LegalSection>

      <LegalSection title="2. Qué datos tratamos">
        <p>Tratamos únicamente los datos necesarios para prestar el servicio:</p>
        <ul className="list-disc pl-5 flex flex-col gap-1">
          <li>
            <strong>Datos de la cuenta del Cliente:</strong> nombre y correo electrónico, e
            identificadores de las Páginas de Facebook y/o cuentas de Instagram que conecta.
          </li>
          <li>
            <strong>Tokens de acceso de Meta:</strong> credenciales que Meta nos otorga para leer y
            responder mensajes en nombre del Cliente. Se almacenan <strong>cifrados</strong> y nunca
            se muestran ni se registran en logs.
          </li>
          <li>
            <strong>Perfil público del negocio:</strong> biografía, descripción y textos de
            publicaciones, utilizados para generar automáticamente preguntas y respuestas
            sugeridas.
          </li>
          <li>
            <strong>Mensajes (DMs):</strong> el contenido de las conversaciones entre los clientes
            finales y las cuentas conectadas, procesado para generar y enviar respuestas
            automáticas.
          </li>
          <li>
            <strong>Datos de uso:</strong> cantidad de respuestas generadas, métricas de resolución
            y registros técnicos necesarios para operar y facturar.
          </li>
        </ul>
        <p>
          No solicitamos ni almacenamos datos de tarjetas: los pagos los procesan terceros (ver
          punto 5).
        </p>
      </LegalSection>

      <LegalSection title="3. Para qué los usamos y base legal">
        <p>
          Usamos los datos para: (a) conectar las cuentas y autenticar al Cliente; (b) generar y
          enviar respuestas automáticas a los DMs; (c) mejorar la calidad de las respuestas
          (mediante búsqueda semántica sobre las preguntas frecuentes del propio Cliente); (d)
          medir el uso y facturar; y (e) comunicarnos con el Cliente. La base legal es el{' '}
          <strong>consentimiento</strong> otorgado al conectar las cuentas y la{' '}
          <strong>ejecución del contrato</strong> de servicio, conforme a la Ley 25.326 de
          Protección de los Datos Personales de la República Argentina.
        </p>
      </LegalSection>

      <LegalSection title="4. Inteligencia artificial">
        <p>
          Las respuestas se generan con modelos de lenguaje. Para ello, el texto del mensaje
          entrante y el contexto del negocio (resumen y preguntas frecuentes) se envían a nuestro
          proveedor de IA, que los procesa únicamente para producir la respuesta y no los utiliza
          para entrenar modelos. Las respuestas pueden contener errores; el Cliente es responsable
          de revisarlas y de la comunicación final con sus clientes.
        </p>
      </LegalSection>

      <LegalSection title="5. Con quién compartimos datos (encargados / subprocesadores)">
        <p>
          No vendemos datos. Los compartimos sólo con proveedores que nos ayudan a prestar el
          servicio, bajo obligaciones de confidencialidad:
        </p>
        <ul className="list-disc pl-5 flex flex-col gap-1">
          <li>
            <strong>Meta Platforms, Inc.</strong> (Facebook / Instagram) — para recibir y enviar
            los mensajes.
          </li>
          <li>
            <strong>Proveedor de IA</strong> (AtlasCloud / Groq) — para generar las respuestas.
          </li>
          <li>
            <strong>Cloudflare, Inc.</strong> — alojamiento del sitio y generación de
            representaciones vectoriales (embeddings) para la búsqueda semántica.
          </li>
          <li>
            <strong>DigitalOcean, LLC</strong> — alojamiento de la aplicación y base de datos.
          </li>
          <li>
            <strong>Resend</strong> — envío de correos transaccionales.
          </li>
          <li>
            <strong>Creem</strong> y <strong>Mercado Pago</strong> — procesamiento de pagos.
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="6. Transferencias internacionales">
        <p>
          Algunos de estos proveedores operan fuera de la Argentina (por ejemplo, en los Estados
          Unidos o la Unión Europea). Al utilizar el servicio, el Cliente presta su consentimiento
          para dichas transferencias, que se realizan con resguardos de confidencialidad y
          seguridad adecuados.
        </p>
      </LegalSection>

      <LegalSection title="7. Seguridad">
        <p>
          Aplicamos medidas técnicas y organizativas razonables: cifrado de los tokens de acceso en
          reposo, transmisión cifrada (HTTPS), aislamiento estricto de los datos de cada Cliente
          (multi-tenant) y la política de no registrar tokens ni datos sensibles en logs. Ningún
          sistema es 100% infalible, pero trabajamos para proteger la información.
        </p>
      </LegalSection>

      <LegalSection title="8. Conservación">
        <p>
          Conservamos los datos mientras la cuenta del Cliente esté activa y durante el plazo
          necesario para cumplir obligaciones legales. Ante la baja de la cuenta o un pedido de
          eliminación, los datos se eliminan según se describe en la página de{' '}
          <a className="underline" href="/data-deletion">
            Eliminación de datos
          </a>
          .
        </p>
      </LegalSection>

      <LegalSection title="9. Tus derechos">
        <p>
          El titular de los datos puede ejercer en cualquier momento sus derechos de acceso,
          rectificación, actualización y supresión escribiéndonos a{' '}
          <a className="underline" href="mailto:alexander171294@gmail.com">
            alexander171294@gmail.com
          </a>
          . La <strong>Agencia de Acceso a la Información Pública (AAIP)</strong>, órgano de control
          de la Ley 25.326, tiene la atribución de atender denuncias y reclamos respecto del
          incumplimiento de las normas sobre protección de datos personales.
        </p>
        <p>
          Si sos un cliente final y querés que se eliminen tus datos, podés contactar directamente
          al comercio con el que conversaste o escribirnos a nosotros y lo gestionamos con él.
        </p>
      </LegalSection>

      <LegalSection title="10. Cookies">
        <p>
          Utilizamos una única cookie técnica de sesión, necesaria para mantener al Cliente
          autenticado. No usamos cookies de seguimiento publicitario de terceros.
        </p>
      </LegalSection>

      <LegalSection title="11. Cambios">
        <p>
          Podemos actualizar esta política. Publicaremos la versión vigente en esta misma dirección
          con su fecha de última actualización. El uso continuado del servicio implica la
          aceptación de los cambios.
        </p>
      </LegalSection>
    </LegalShell>
  );
}
