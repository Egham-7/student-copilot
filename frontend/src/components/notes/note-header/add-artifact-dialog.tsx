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

const artifactSchema = z.object({
  files: z.array(z.any()).min(1, 'Please upload at least one file.'),
});

type ArtifactFormValues = z.infer<typeof artifactSchema>;

export function AddArtifactDialog() {
  const form = useForm<ArtifactFormValues>({
    resolver: zodResolver(artifactSchema),
    defaultValues: {
      files: [],
    },
  });

  const onSubmit = (values: ArtifactFormValues) => {
    console.log('Submitted files:', values.files);
  };

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

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="files"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Upload Artifacts</FormLabel>
                  <FileUpload onChange={field.onChange} />
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit">Save Artifacts</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
