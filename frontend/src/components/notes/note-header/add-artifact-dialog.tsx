import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/ui/file-upload";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { usePresignUpload } from "@/hooks/knowledge-artifacts/use-presign-upload-url";
import { useSupabaseSession } from "@/hooks/auth/use-supabase-session";
import { useCreateKnowledgeArtifact } from "@/hooks/knowledge-artifacts/use-create-knowledge-artifact";
import { useLinkKnowledgeArtifacts } from "@/hooks/notes/use-link-knowledge-artifacts";
import { useUnlinkKnowledgeArtifacts } from "@/hooks/notes/use-unlink-knowledge-artifacts";
import { useGetKnowledgeArtifacts } from "@/hooks/knowledge-artifacts/use-knowledge-artifacts";
import { Loader2, CheckCircle2 } from "lucide-react";
import { KnowledgeArtifact } from "@/types/knowledge-artifacts";
import { getFileIcon } from "@/utils/file-icons";

const artifactSchema = z.object({
  files: z
    .array(z.instanceof(File))
    .min(1, "Please upload at least one file.")
    .refine((files) => files.every((file) => file.type === "application/pdf"), {
      message: "Only PDF files are allowed.",
    }),
});

type ArtifactFormValues = z.infer<typeof artifactSchema>;

interface AddArtifactDialogProps {
  noteId: number;
  artifacts?: KnowledgeArtifact[];
}

export function AddArtifactDialog({
  noteId,
  artifacts,
}: AddArtifactDialogProps) {
  const [open, setOpen] = useState(false);

  const form = useForm<ArtifactFormValues>({
    resolver: zodResolver(artifactSchema),
    defaultValues: {
      files: [],
    },
  });

  const { session, isLoading: isSessionLoading } = useSupabaseSession();
  const { data: allArtifacts = [] } = useGetKnowledgeArtifacts(
    session?.user.id ?? "",
  );

  const presignUpload = usePresignUpload();
  const createArtifact = useCreateKnowledgeArtifact();
  const linkArtifact = useLinkKnowledgeArtifacts(noteId);
  const unlinkArtifact = useUnlinkKnowledgeArtifacts(noteId);

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
            bucket: "knowledge-artifacts",
          });

          const res = await fetch(signedUrl, {
            method: "PUT",
            headers: { "Content-Type": file.type },
            body: file,
          });

          if (!res.ok) throw new Error(`Failed to upload: ${file.name}`);

          const [name] = file.name.split(".");
          const artifact = await createArtifact.mutateAsync({
            title: name,
            fileType: file.type,
            userId: session.user.id,
            filePath: key,
          });

          if (!artifact?.id) return;

          await linkArtifact.mutateAsync([artifact.id]);
        }),
      );

      form.reset();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (!open) {
      form.reset();
      presignUpload.reset();
      createArtifact.reset();
      linkArtifact.reset();
      unlinkArtifact.reset();
    }
  }, [open]);

  if (isSessionLoading) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
          <DialogTitle className="text-lg">Add Knowledge Artifacts</DialogTitle>
        </DialogHeader>

        {isSuccess ? (
          <SuccessMessage />
        ) : (
          <>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="files"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Upload Artifacts</FormLabel>
                      <FileUpload
                        onChange={field.onChange}
                        disabled={isSubmitting}
                        allowedFileTypes={["application/pdf"]}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter className="px-4 py-2">
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      "Save Artifacts"
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </Form>

            <ArtifactListViewer
              allArtifacts={allArtifacts}
              linkedArtifactIds={artifacts?.map((a) => a.id) ?? []}
              onLink={(id) => linkArtifact.mutateAsync([id])}
              onUnlink={(id) => unlinkArtifact.mutate([id])}
              isMutating={linkArtifact.isPending || unlinkArtifact.isPending}
            />
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

interface ArtifactListViewerProps {
  allArtifacts: KnowledgeArtifact[];
  linkedArtifactIds: number[];
  onLink: (id: number) => void;
  onUnlink: (id: number) => void;
  isMutating: boolean;
}

function ArtifactListViewer({
  allArtifacts,
  linkedArtifactIds,
  onLink,
  onUnlink,
  isMutating,
}: ArtifactListViewerProps) {
  if (allArtifacts.length === 0) return null;

  return (
    <div className="mt-6">
      <h3 className="text-sm font-semibold text-muted-foreground mb-2">
        Your Artifacts
      </h3>
      <div className="space-y-2 overflow-y-auto pr-1">
        {allArtifacts.map((artifact) => {
          const isLinked = linkedArtifactIds.includes(artifact.id);

          const handleToggle = (checked: boolean) => {
            if (checked) {
              onLink(artifact.id);
            } else {
              onUnlink(artifact.id);
            }
          };

          return (
            <div
              key={artifact.id}
              className="flex items-center justify-between border rounded-md px-4 py-2 bg-muted/40"
            >
              <div className="flex items-center gap-3 overflow-hidden">
                {getFileIcon(artifact.fileType)}
                <div className="flex flex-col overflow-hidden">
                  <span className="text-sm font-medium truncate">
                    {artifact.title}
                  </span>
                  <span className="text-xs text-muted-foreground  w-96 truncate">
                    {artifact.filePath}
                  </span>
                </div>
              </div>
              <Checkbox
                checked={isLinked}
                disabled={isMutating}
                onCheckedChange={(checked) => handleToggle(Boolean(checked))}
                aria-label={`Toggle link for ${artifact.title}`}
              />
            </div>
          );
        })}
      </div>
    </div>
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
