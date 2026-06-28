import { setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { LegalShell, LegalSection } from '@/components/legal/LegalShell';
import type { Metadata } from 'next';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const metadata: Metadata = {
  title: 'Eliminación de datos — Minibox',
  description: 'Cómo solicitar la eliminación de tus datos en Minibox.',
};

export default async function DataDeletionPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <LegalShell title="Eliminación de datos" updatedAt="27 de junio de 2026">
      <p>
        En <strong>Minibox</strong> (operado por Alexander Eberle, CUIT 20-38674516-2, Argentina)
        podés solicitar la eliminación de tus datos en cualquier momento. Acá te explicamos cómo y
        qué se elimina.
      </p>

      <LegalSection title="1. Si sos Cliente de Minibox">
        <p>Tenés dos opciones:</p>
        <ul className="list-disc pl-5 flex flex-col gap-1">
          <li>
            <strong>Desconectar tus cuentas</strong> desde la aplicación. Al desconectar, dejamos de
            recibir mensajes y revocamos el acceso a tus redes.
          </li>
          <li>
            <strong>Pedir la eliminación total</strong> enviando un correo a{' '}
            <a className="underline" href="mailto:alexander171294@gmail.com?subject=Eliminaci%C3%B3n%20de%20datos">
              alexander171294@gmail.com
            </a>{' '}
            con el asunto <em>&ldquo;Eliminación de datos&rdquo;</em>, indicando el nombre de la
            cuenta o de la Página/cuenta de Instagram conectada.
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="2. Qué se elimina">
        <p>Ante un pedido de eliminación, borramos de forma permanente:</p>
        <ul className="list-disc pl-5 flex flex-col gap-1">
          <li>los tokens de acceso de Meta asociados a tu cuenta;</li>
          <li>el perfil y resumen del negocio, las preguntas frecuentes y la configuración;</li>
          <li>las conversaciones y mensajes almacenados;</li>
          <li>las representaciones vectoriales (embeddings) derivadas de tus datos.</li>
        </ul>
        <p>
          La eliminación se completa en un plazo máximo de <strong>30 días</strong>. Podremos
          conservar registros mínimos cuando una obligación legal lo exija (por ejemplo,
          comprobantes de facturación), por el plazo que la ley disponga.
        </p>
      </LegalSection>

      <LegalSection title="3. Si sos cliente final (le escribiste a un comercio)">
        <p>
          Si conversaste con un comercio que usa Minibox y querés que se eliminen tus mensajes,
          podés contactar directamente a ese comercio (responsable de tus datos) o escribirnos a{' '}
          <a className="underline" href="mailto:alexander171294@gmail.com?subject=Eliminaci%C3%B3n%20de%20datos">
            alexander171294@gmail.com
          </a>{' '}
          y lo gestionamos junto con él.
        </p>
      </LegalSection>

      <LegalSection title="4. Confirmación">
        <p>
          Una vez procesada la eliminación, te enviaremos una confirmación al correo desde el que
          hiciste la solicitud.
        </p>
      </LegalSection>
    </LegalShell>
  );
}
