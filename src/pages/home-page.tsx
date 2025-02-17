import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";

const HomePage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate({
      to: "/$noteId",
      params: {
        noteId: "1",
      },
    });
  }, []);

  return (
    <div className="flex items-center justify-center h-screen text-muted-foreground">
      Redirecting...
    </div>
  );
};

export default HomePage;
