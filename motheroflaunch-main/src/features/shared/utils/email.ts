// lib/email.ts
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);
const FROM = "Mot <no-reply@basicutils.com>";

export async function sendVerificationEmail({
  to,
  url
}: { to: string; url: string }) {
    console.log("📧 Sending email to:", to);
    console.log("🔗 Verification link:", url);
    const result = await resend.emails.send({
    from: FROM,
    to,
    subject: "Verify your email",
    html: `<p>Please verify your email by clicking <a href="${url}">this link</a>.</p>`
  });
  console.log("📬 Resend response:", result);

}

export async function sendResetPasswordEmail({
  to,
  url
}: { to: string; url: string }) {
  await resend.emails.send({
    from: FROM,
    to,
    subject: "Reset your password",
    html: `<p>Reset your password by clicking <a href="${url}">this link</a>.</p>`
  });
}
export async function sendWelcomeEmail({
  to,
  name,
  provider,
  githubUsername,
  avatarUrl,
}: {
  to: string;
  name?: string;
  provider?: string;
  githubUsername?: string | null;
  avatarUrl?: string | null;
}) {
  console.log("sendin")
  const displayName = name ?? githubUsername ?? "there";
  const greeting = `Hi ${displayName},`;

  const intro =
    provider === "github"
      ? `Thanks for signing up with GitHub!`
      : `Thanks for signing up with your email!`;

  const avatar = avatarUrl
    ? `<img src="${avatarUrl}" alt="avatar" width="64" height="64" style="border-radius: 50%; margin-bottom: 10px;" />`
    : "";

  const profileLink = githubUsername
    ? `<p>You're also welcome to star us on <a href="https://github.com/${githubUsername}" target="_blank">GitHub</a> 😊</p>`
    : "";

  await resend.emails.send({
    from: FROM,
    to,
    subject: "🎉 Welcome to BasicUtils!",
    html: `
      ${avatar}
      <p>${greeting}</p>
      <p>${intro}</p>
      <p>We're thrilled to have you on board. Explore your account or check out the tools we've built just for you.</p>
      <p><a href="https://basicutils.com/account" target="_blank">→ Go to your dashboard</a></p>
      ${profileLink}
      <p>— The BasicUtils Team</p>
    `,
  });
}

