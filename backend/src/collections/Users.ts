import type { CollectionConfig } from 'payload';
import { emailTemplate } from '../lib/mail';

export const Users: CollectionConfig = {
  slug: 'users',
  labels: {
    singular: 'Gebruiker',
    plural: 'Gebruikers',
  },
  auth: {
    forgotPassword: {
      generateEmailSubject: () => 'Wachtwoord opnieuw instellen — Shi-Sei Sport',
      generateEmailHTML: async (args) => {
        const token = args?.token ?? ''
        const user = args?.user as { email?: string } | undefined
        const serverURL = process.env.PAYLOAD_PUBLIC_SERVER_URL ?? 'https://www.shi-sei.nl'
        const resetURL = `${serverURL}/admin/reset/${token}`

        const body = `
          <h2 style="margin:0 0 8px;font-size:22px;font-weight:700;color:#1a1a1a;">Wachtwoord opnieuw instellen</h2>
          <p style="margin:0 0 24px;font-size:15px;color:#555;line-height:1.6;">
            We hebben een verzoek ontvangen om het wachtwoord te resetten voor het account gekoppeld aan
            <strong>${user?.email ?? 'uw account'}</strong>.
          </p>
          <p style="margin:0 0 28px;font-size:15px;color:#555;line-height:1.6;">
            Klik op de knop hieronder om een nieuw wachtwoord in te stellen. Deze link is <strong>1 uur geldig</strong>.
          </p>
          <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 28px;">
            <tr>
              <td style="border-radius:6px;background-color:#E60000;">
                <a href="${resetURL}" style="display:inline-block;padding:14px 28px;font-size:15px;font-weight:600;color:#ffffff;text-decoration:none;border-radius:6px;letter-spacing:0.3px;">
                  Wachtwoord instellen
                </a>
              </td>
            </tr>
          </table>
          <p style="margin:0 0 8px;font-size:13px;color:#888;line-height:1.6;">
            Werkt de knop niet? Kopieer en plak deze link in uw browser:
          </p>
          <p style="margin:0 0 24px;font-size:13px;line-height:1.6;">
            <a href="${resetURL}" style="color:#E60000;word-break:break-all;">${resetURL}</a>
          </p>
          <p style="margin:0;font-size:13px;color:#aaa;line-height:1.6;">
            Heeft u dit niet aangevraagd? Dan kunt u deze e-mail veilig negeren.
          </p>
        `

        return emailTemplate(body)
      },
    },
  },
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'createdAt'],
    description: 'Admin gebruikers met toegang tot het CMS',
  },
  access: {
    read: ({ req }: { req: { user?: unknown } }) => !!req.user,
  },
  fields: [

  ],
};