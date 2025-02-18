import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useNotes } from "@/hooks/notes/use-notes";
import { SkeletonItem } from "@/components/ui/skeleton-item";
import { ErrorState } from "@/components/ui/error-state";

const HomePage = () => {
  const navigate = useNavigate();
  const { data: notes, isLoading, isError, refetch } = useNotes();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-xl font-semibold mb-8 text-muted-foreground">
          Loading your notes
        </h1>
        <div className="w-[300px]">
          <SkeletonItem count={3} />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center h-screen">
        <ErrorState message="Unable to load your notes" onRetry={refetch} />
      </div>
    );
  }

  useEffect(() => {
    if (notes && notes.length > 0) {
      navigate({
        to: "/$noteId",
        params: {
          noteId: notes[0].rowid.toString(),
        },
      });
    } else {
      navigate({
        to: "/create",
      });
    }
  }, [notes]);

  return (
    <div className="flex items-center justify-center h-screen text-muted-foreground">
      <h1 className="text-xl font-semibold">
        {notes?.length === 0
          ? "No notes found"
          : "Redirecting to your notes..."}
      </h1>
    </div>
  );
};

export default HomePage;
