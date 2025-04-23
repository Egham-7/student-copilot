import NotePage from "@/pages/note-page";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_notes/$noteId/")({
  component: NoteRoute,
});

function NoteRoute() {
  return <NotePage />;
}
