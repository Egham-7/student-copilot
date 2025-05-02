import { createFileRoute } from '@tanstack/react-router';
import PasswordResetPage from '@/pages/reset-password-page';

export const Route = createFileRoute('/reset-password')({
  component: PasswordResetPage,
});
