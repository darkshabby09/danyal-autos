'use client';
export default function ConfirmForm({ action, children, message = 'Delete this?' }) {
  return <form action={action} onSubmit={(e) => { if (!confirm(message)) e.preventDefault(); }}>{children}</form>;
}
