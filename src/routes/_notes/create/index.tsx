import { createFileRoute } from "@tanstack/react-router";
import NoteCreatePage from "@/pages/note-create-page";

export const Route = createFileRoute("/_notes/create/")({
  component: NoteCreateRoute,
});

function NoteCreateRoute() {
  return <NoteCreatePage />;
}
