import { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { supabase } from '@/lib/supabase';
// Form schema with zod
const formSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

type FormValues = z.infer<typeof formSchema>;

export default function ForgotPasswordPage() {
  // Local state for success message
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Initialize react-hook-form with zod validation
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    },
  });

  const { isSubmitting, isSubmitSuccessful, errors } = form.formState;

  const onSubmit = async (values: FormValues) => {
    try {
      await supabase.auth.resetPasswordForEmail(values.email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      // Set success message in local state
      setSuccessMessage(
        'Password reset instructions have been sent to your email.',
      );

      form.reset({}, { keepValues: false, keepIsSubmitSuccessful: true });
    } catch (error) {
      if (error instanceof Error) {
        form.setError('root', {
          type: 'manual',
          message: error.message,
        });
        return;
      }
      form.setError('root', {
        type: 'manual',
        message: 'An error occurred while sending the email.',
      });
    }
  };

  // Function to reset the form completely
  const handleReset = () => {
    form.reset();
    form.clearErrors();
    setSuccessMessage(null);
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Forgot Password</CardTitle>
          <CardDescription>
            Enter your email address and we&apos;ll send you instructions to
            reset your password.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isSubmitSuccessful && successMessage ? (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>{successMessage}</AlertDescription>
            </Alert>
          ) : errors.root ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{errors.root.message}</AlertDescription>
            </Alert>
          ) : (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="your.email@example.com"
                          type="email"
                          disabled={isSubmitting}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending Instructions
                    </>
                  ) : (
                    'Reset Password'
                  )}
                </Button>
              </form>
            </Form>
          )}
        </CardContent>
        <CardFooter className="flex justify-center border-t p-4">
          {isSubmitSuccessful || errors.root ? (
            <Button variant="outline" onClick={handleReset}>
              Reset Form
            </Button>
          ) : (
            <Button
              variant="link"
              className="px-2"
              onClick={() => window.history.back()}
            >
              Back to Login
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
