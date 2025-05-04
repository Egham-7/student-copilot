'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { FileUpload } from '@/components/ui/file-upload';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { usePresignUpload } from '@/hooks/knowledge-artifacts/use-presign-upload-url';
import { useSupabaseSession } from '@/hooks/auth/use-supabase-session';
import { useCreateKnowledgeArtifact } from '@/hooks/knowledge-artifacts/use-create-knowledge-artifact';
import { useLinkKnowledgeArtifacts } from '@/hooks/notes/use-link-knowledge-artifacts';
import { Loader2, CheckCircle2 } from 'lucide-react';

const artifactSchema = z.object({
  files: z
    .array(z.instanceof(File))
    .min(1, 'Please upload at least one file.')
    .refine((files) => files.every((file) => file.type === 'application/pdf'), {
      message: 'Only PDF files are allowed.',
    }),
});

type ArtifactFormValues = z.infer<typeof artifactSchema>;

export function AddArtifactDialog({ noteId }: { noteId: number }) {
  const form = useForm<ArtifactFormValues>({
    resolver: zodResolver(artifactSchema),
    defaultValues: {
      files: [],
    },
  });

  const { session, isLoading: isSessionLoading } = useSupabaseSession();

  const presignUpload = usePresignUpload();
  const createArtifact = useCreateKnowledgeArtifact();
  const linkArtifact = useLinkKnowledgeArtifacts(noteId);

  const isSubmitting =
    presignUpload.isPending ||
    createArtifact.isPending ||
    linkArtifact.isPending;

  const isSuccess =
    presignUpload.isSuccess &&
    createArtifact.isSuccess &&
    linkArtifact.isSuccess;

  const onSubmit = async (values: ArtifactFormValues) => {
    if (!session?.user?.id) return;

    try {
      await Promise.all(
        values.files.map(async (file: File) => {
          const key = `${session.user.id}/${file.name}`;

          const { signedUrl } = await presignUpload.mutateAsync({
            key,
            bucket: 'knowledge-artifacts',
          });

          const res = await fetch(signedUrl, {
            method: 'PUT',
            headers: {
              'Content-Type': file.type,
            },
            body: file,
          });

          if (!res.ok) {
            console.error(`Failed to upload ${file.name}:`, await res.text());
            throw new Error(`Upload failed with status ${res.status}`);
          }

          const [name] = file.name.split('.');

          const artifact = await createArtifact.mutateAsync({
            title: name,
            fileType: file.type,
            userId: session.user.id,
            filePath: key,
          });

          await linkArtifact.mutateAsync([artifact.id]);
        }),
      );

      form.reset();
      console.log('Artifacts uploaded and linked');
    } catch (err) {
      console.error(err);
    }
  };

  if (isSessionLoading) return <SessionSkeleton />;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground hover:text-foreground"
        >
          Add Artifacts to Note
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Knowledge Artifacts</DialogTitle>
        </DialogHeader>

        {isSuccess ? (
          <SuccessMessage />
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="files"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Upload Artifacts</FormLabel>
                    <FileUpload
                      onChange={field.onChange}
                      disabled={isSubmitting}
                      allowedFileTypes={['application/pdf']}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    'Save Artifacts'
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}

function SuccessMessage() {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <CheckCircle2 className="h-12 w-12 text-green-500 mb-4" />
      <p className="text-sm text-green-600 font-medium">
        Artifacts uploaded and linked successfully!
      </p>
    </div>
  );
}

function SessionSkeleton() {
  return (
    <div className="p-6 space-y-3">
      <div className="w-2/3 h-5 bg-muted rounded-md animate-pulse" />
      <div className="w-full h-32 bg-muted rounded-md animate-pulse" />
      <div className="w-24 h-9 bg-muted rounded-md animate-pulse" />
    </div>
  );
}
