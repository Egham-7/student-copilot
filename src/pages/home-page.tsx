import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useNotes } from "@/hooks/notes/use-notes";
import { SkeletonItem } from "@/components/skeleton-item";
import { ErrorState } from "@/components/error-display";

const HomePage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate({
      to: "/create",
    });
  }, []);

  return (
    <div className="flex items-center justify-center h-screen text-muted-foreground">
      <h1 className="text-xl font-semibold">Redirecting to your notes...</h1>
    </div>
  );
};

export default HomePage;
