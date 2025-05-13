import { FoldersRepository } from "./repository";
import { NotesRepository } from "../notes/repository";
import { FolderWithChildren, NewFolder, UpdateFolder } from "@/types/folders";
import { Folder } from "@/types/folders";
import { Note } from "@/types/notes";

export class FoldersService {
  constructor(
    private repo: FoldersRepository,
    private notesRepo: NotesRepository
  ) {}

  async getAllFolders(userId: string) {
    return this.repo.findByUserId(userId);
  }

  async getFolderById(id: number) {
    const folderResult = await this.repo.findById(id);
    if (!folderResult.length) throw new Error("Folder not found");
    return folderResult[0];
  }

  async getFolderWithContents(id: number): Promise<{folder: Folder, subfolders: Folder[], notes: Note[]}> {
    const [folder] = await this.repo.findById(id);
    if (!folder) throw new Error("Folder not found");

    const subfolders = await this.repo.findSubfolders(id);
    const notes = await this.repo.findNotesByFolderId(id);

    return {
      folder,
      subfolders,
      notes
    };
  }

  async getRootFolders(userId: string) {
    return this.repo.findRootFolders(userId);
  }

  async createFolder(data: NewFolder) {
    const [created] = await this.repo.create(data);
    return created;
  }

  async updateFolder(id: number, data: UpdateFolder) {
    // Prevent circular references (folder can't be its own parent or descendant)
    if (data.parentId && data.parentId === id) {
      throw new Error("Folder cannot be its own parent");
    }

    // If we're changing the parentId, check for circular references
    if (data.parentId) {
      await this.checkForCircularReference(id, data.parentId);
    }

    const [updated] = await this.repo.update(id, data);
    if (!updated) throw new Error("Folder not found");
    return updated;
  }

  async deleteFolder(id: number) {
    const [deleted] = await this.repo.delete(id);
    if (!deleted) throw new Error("Folder not found");
    return deleted;
  }

  // Helper method to prevent circular references in folder hierarchy
  private async checkForCircularReference(folderId: number, newParentId: number) {
    let currentId = newParentId;
    const visited = new Set<number>();

    while (currentId) {
      if (currentId === folderId) {
        throw new Error("Circular folder reference detected");
      }

      if (visited.has(currentId)) {
        throw new Error("Circular folder reference detected");
      }

      visited.add(currentId);

      const [parent] = await this.repo.findById(currentId);
      if (!parent || !parent.parentId) break;

      currentId = parent.parentId;
    }
  }

  // Get folder hierarchy as a tree structure
  async getFolderTree(userId: string) {
    const allFolders = await this.repo.findByUserId(userId);

    // Create a map for quick lookup
    const folderMap = new Map<number, FolderWithChildren>(allFolders.map(folder => [folder.id, {
      ...folder,
      children: []
    }]));

    // Build the tree
    const rootFolders = [];

    for (const folder of allFolders) {
      if (folder.parentId === null) {
        rootFolders.push(folderMap.get(folder.id));
      } else {
        const parent = folderMap.get(folder.parentId);
        const child = folderMap.get(folder.id);
            if (parent && child) {
              parent.children.push(child);
            }

      }
    }

    return rootFolders;
  }

  // Move notes to a specific folder
  async moveNotesToFolder(noteIds: number[], folderId: number | null) {
    // null folderId means to move notes out of any folder (to root)
    for (const noteId of noteIds) {
      await this.notesRepo.update(noteId, { folderId });
    }

    return noteIds;
  }
}
