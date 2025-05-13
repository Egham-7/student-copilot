import { FoldersService } from "./service";
import { FoldersRepository } from "./repository";
import { NotesRepository } from "../notes/repository";
import { NewFolder, UpdateFolder } from "@/types/folders";
import { Hono } from "hono";

const folderRepo = new FoldersRepository();
const notesRepo = new NotesRepository();
const folderService = new FoldersService(folderRepo, notesRepo);

const folderRoutes = new Hono();

// Get all folders for current user
folderRoutes.get("/", async (c) => {
  try {
    // In a real application, you would get the userId from the authenticated user
    const userId = c.req.query("userId");
    if (!userId) {
      return c.json({ error: "userId is required" }, 400);
    }

    const folders = await folderService.getAllFolders(userId);
    return c.json(folders);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return c.json({ error: errorMessage }, 500);
  }
});

// Get folder tree (hierarchical structure)
folderRoutes.get("/tree", async (c) => {
  try {
    const userId = c.req.query("userId");
    if (!userId) {
      return c.json({ error: "userId is required" }, 400);
    }

    const folderTree = await folderService.getFolderTree(userId);
    return c.json(folderTree);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return c.json({ error: errorMessage }, 500);
  }
});

// Get root folders
folderRoutes.get("/root", async (c) => {
  try {
    const userId = c.req.query("userId");
    if (!userId) {
      return c.json({ error: "userId is required" }, 400);
    }

    const rootFolders = await folderService.getRootFolders(userId);
    return c.json(rootFolders);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return c.json({ error: errorMessage }, 500);
  }
});

// Get folder by ID with its contents (subfolders and notes)
folderRoutes.get("/:id", async (c) => {
  try {
    const folderId = parseInt(c.req.param("id"));
    if (isNaN(folderId)) {
      return c.json({ error: "Invalid folder ID" }, 400);
    }

    const folderContents = await folderService.getFolderWithContents(folderId);
    return c.json(folderContents);
  } catch (error) {
    if (error instanceof Error && error.message === "Folder not found") {
      return c.json({ error: error.message }, 404);
    }
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return c.json({ error: errorMessage }, 500);
  }
});

// Create a new folder
folderRoutes.post("/", async (c) => {
  try {
    const folderData = await c.req.json() as NewFolder;
    const newFolder = await folderService.createFolder(folderData);
    return c.json(newFolder, 201);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return c.json({ error: errorMessage }, 500);
  }
});

// Update a folder
folderRoutes.put("/:id", async (c) => {
  try {
    const folderId = parseInt(c.req.param("id"));
    if (isNaN(folderId)) {
      return c.json({ error: "Invalid folder ID" }, 400);
    }

    const folderData = await c.req.json() as UpdateFolder;
    const updatedFolder = await folderService.updateFolder(folderId, folderData);
    return c.json(updatedFolder);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "Folder not found") {
        return c.json({ error: error.message }, 404);
      }
      if (error.message.includes("Circular folder")) {
        return c.json({ error: error.message }, 400);
      }
      return c.json({ error: error.message }, 500);
    }
    return c.json({ error: 'An unknown error occurred' }, 500);
  }
});

// Delete a folder
folderRoutes.delete("/:id", async (c) => {
  try {
    const folderId = parseInt(c.req.param("id"));
    if (isNaN(folderId)) {
      return c.json({ error: "Invalid folder ID" }, 400);
    }

    const deletedFolder = await folderService.deleteFolder(folderId);
    return c.json(deletedFolder);
  } catch (error) {
    if (error instanceof Error && error.message === "Folder not found") {
      return c.json({ error: error.message }, 404);
    }
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return c.json({ error: errorMessage }, 500);
  }
});

// Move notes to a folder
folderRoutes.post("/:id/notes", async (c) => {
  try {
    const folderId = parseInt(c.req.param("id"));
    if (isNaN(folderId)) {
      return c.json({ error: "Invalid folder ID" }, 400);
    }

    const { noteIds } = await c.req.json();
    if (!Array.isArray(noteIds)) {
      return c.json({ error: "noteIds must be an array" }, 400);
    }

    await folderService.moveNotesToFolder(noteIds, folderId);
    return c.json({ success: true });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return c.json({ error: errorMessage }, 500);
  }
});

// Remove notes from a folder (move to root)
folderRoutes.delete("/:id/notes", async (c) => {
  try {
    const { noteIds } = await c.req.json();
    if (!Array.isArray(noteIds)) {
      return c.json({ error: "noteIds must be an array" }, 400);
    }

    await folderService.moveNotesToFolder(noteIds, null);
    return c.json({ success: true });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return c.json({ error: errorMessage }, 500);
  }
});

export default folderRoutes;
