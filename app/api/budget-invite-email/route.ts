import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resendApiKey = process.env.RESEND_API_KEY;
const resendFrom = process.env.BUDGET_INVITE_FROM_EMAIL;

const resendClient = resendApiKey ? new Resend(resendApiKey) : null;

const resolveBaseUrl = () => {
  if (process.env.BUDGET_INVITE_APP_URL) {
    return process.env.BUDGET_INVITE_APP_URL;
  }
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL;
  }
  const vercelUrl = process.env.NEXT_PUBLIC_VERCEL_URL ?? process.env.VERCEL_URL;
  if (vercelUrl) {
    const hasProtocol = vercelUrl.startsWith('http://') || vercelUrl.startsWith('https://');
    return hasProtocol ? vercelUrl : `https://${vercelUrl}`;
  }
  return 'http://localhost:3000';
};

const formatRoleLabel = (role: string) => {
  switch (role) {
    case 'owner':
      return 'administración';
    case 'editor':
      return 'ver y editar';
    case 'viewer':
      return 'solo ver';
    default:
      return role;
  }
};

export async function POST(request: Request) {
  if (!resendClient || !resendFrom) {
    return NextResponse.json(
      {
        error: 'Email service not configured.',
        configured: {
          RESEND_API_KEY: Boolean(resendApiKey),
          BUDGET_INVITE_FROM_EMAIL: Boolean(resendFrom),
        },
      },
      { status: 500 },
    );
  }

  let payload: {
    email?: string;
    inviteToken?: string | null;
    budgetName?: string | null;
    role?: string | null;
    invitedByEmail?: string | null;
  };

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON payload.' }, { status: 400 });
  }

  const { email, inviteToken, budgetName, role, invitedByEmail } = payload ?? {};

  if (!email || typeof email !== 'string') {
    return NextResponse.json({ error: 'Missing invite email.' }, { status: 400 });
  }

  if (!inviteToken || typeof inviteToken !== 'string') {
    return NextResponse.json({ error: 'Missing invite token.' }, { status: 400 });
  }

  const baseUrl = resolveBaseUrl();
  const inviteUrl = `${baseUrl}?invite=${encodeURIComponent(inviteToken)}`;
  const safeBudgetName = budgetName?.trim() || 'un presupuesto compartido';
  const roleLabel = formatRoleLabel(role ?? '');

  const subject = `Invitación para colaborar en ${safeBudgetName}`;
  const textBody = [
    `Hola,`,
    ``,
    `Te invitaron a sumarte al presupuesto "${safeBudgetName}".`,
    `Rol asignado: ${roleLabel}.`,
    ``,
    `1. Iniciá sesión en mindful con este correo.`,
    `2. Aceptá la invitación desde la sección de invitaciones pendientes.`,
    ``,
    `También podés abrir directamente: ${inviteUrl}`,
    ``,
    invitedByEmail ? `Invitó: ${invitedByEmail}` : null,
    `Si no esperabas este mensaje, podés ignorarlo.`,
  ]
    .filter(Boolean)
    .join('\n');

  const htmlBody = `
    <div style="font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #1f2933; line-height: 1.5;">
      <p>Hola,</p>
      <p>Te invitaron a sumarte al presupuesto <strong>${safeBudgetName}</strong>.</p>
      <p><strong>Rol asignado:</strong> ${roleLabel}.</p>
      <p>
        Para aceptarla:
        <ol style="padding-left: 20px; margin: 12px 0;">
          <li>Iniciá sesión en mindful con este correo.</li>
          <li>Desde la sección de invitaciones pendientes, confirmá tu acceso.</li>
        </ol>
      </p>
      <p>
        También podés abrir directamente el siguiente enlace:<br/>
        <a href="${inviteUrl}" style="color: #0f766e;">Aceptar invitación</a>
      </p>
      ${invitedByEmail ? `<p>Invitó: ${invitedByEmail}</p>` : ''}
      <p style="color: #64748b; font-size: 12px; margin-top: 24px;">
        Si no esperabas este mensaje, podés ignorarlo.
      </p>
    </div>
  `;

  try {
    await resendClient.emails.send({
      from: resendFrom,
      to: email,
      subject,
      text: textBody,
      html: htmlBody,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('No se pudo enviar el correo de invitación:', error);
    return NextResponse.json(
      {
        error: 'No se pudo enviar el correo de invitación.',
      },
      { status: 500 },
    );
  }
}
