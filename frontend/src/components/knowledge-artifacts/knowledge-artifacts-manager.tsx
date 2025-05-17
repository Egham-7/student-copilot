import { useState, useMemo, useCallback } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArtifactFilters } from "./artifact-filters";
import { ArtifactGrid } from "./artifact-grid";
import { ArtifactSearch } from "./artifact-search";
import { ArtifactSort } from "./artifact-sort";
import type { KnowledgeArtifact } from "@/types/knowledge-artifacts";
import { useGetKnowledgeArtifacts } from "@/hooks/knowledge-artifacts/use-knowledge-artifacts";
import { useSupabaseSession } from "@/hooks/auth/use-supabase-session";
import { getFileType } from "@/utils/file-icons";

interface ActiveFilters {
  fileTypes: string[];
  dateRange: {
    from: Date | null;
    to: Date | null;
  };
}

type SortKey = keyof KnowledgeArtifact;

interface SortConfig {
  key: SortKey;
  direction: "asc" | "desc";
}

export function KnowledgeArtifactsManager() {
  const { session, isLoading: isSessionLoading } = useSupabaseSession();
  const userId = session?.user.id ?? "";

  const {
    data: artifacts = [],
    isPending: isArtifactsLoading,
    error: artifactsError,
  } = useGetKnowledgeArtifacts(userId);

  const error = artifactsError;

  const isLoading = isSessionLoading || isArtifactsLoading;

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeFilters, setActiveFilters] = useState<ActiveFilters>({
    fileTypes: [],
    dateRange: { from: null, to: null },
  });
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: "createdAt",
    direction: "desc",
  });
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const handleFilterChange = useCallback((filters: ActiveFilters) => {
    setActiveFilters(filters);
  }, []);

  const handleSortChange = useCallback(
    (key: SortKey, direction: "asc" | "desc") => {
      setSortConfig({ key, direction });
    },
    [],
  );

  const handleViewModeChange = useCallback((mode: string) => {
    setViewMode(mode as "grid" | "table");
  }, []);

  const fileTypeOptions = useMemo(
    () => Array.from(new Set(artifacts.map((a) => getFileType(a.fileType)))),
    [artifacts],
  );

  const filteredArtifacts = useMemo<KnowledgeArtifact[]>(() => {
    return artifacts
      .filter((artifact) => {
        // Search
        if (searchQuery) {
          const q = searchQuery.toLowerCase();
          if (
            !artifact.title.toLowerCase().includes(q) &&
            !artifact.content.toLowerCase().includes(q)
          ) {
            return false;
          }
        }
        // File-type filter
        if (
          activeFilters.fileTypes.length > 0 &&
          !activeFilters.fileTypes.includes(getFileType(artifact.fileType))
        ) {
          return false;
        }
        // Date-range filter
        const created = new Date(artifact.createdAt);
        const { from, to } = activeFilters.dateRange;
        if (from && created < from) return false;
        if (to && created > to) return false;

        return true;
      })
      .sort((a, b) => {
        const { key, direction } = sortConfig;
        const aVal = a[key];
        const bVal = b[key];

        if (typeof aVal === "string" && typeof bVal === "string") {
          return direction === "asc"
            ? aVal.localeCompare(bVal)
            : bVal.localeCompare(aVal);
        }

        if (
          (key === "createdAt" || key === "updatedAt") &&
          typeof aVal === "string" &&
          typeof bVal === "string"
        ) {
          const diff = new Date(aVal).getTime() - new Date(bVal).getTime();
          return direction === "asc" ? diff : -diff;
        }

        if (typeof aVal === "number" && typeof bVal === "number") {
          return direction === "asc" ? aVal - bVal : bVal - aVal;
        }

        return 0;
      });
  }, [artifacts, searchQuery, activeFilters, sortConfig]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 justify-between">
        <ArtifactSearch onSearch={handleSearch} />
        <div className="flex gap-2">
          <ArtifactSort
            onSortChange={handleSortChange}
            currentSort={sortConfig}
          />
          <Tabs
            value={viewMode}
            onValueChange={handleViewModeChange}
            className="w-[120px]"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="grid">Grid</TabsTrigger>
              <TabsTrigger value="table">Table</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <aside className="lg:col-span-1">
          <ArtifactFilters
            fileTypes={fileTypeOptions}
            activeFilters={activeFilters}
            onFilterChange={handleFilterChange}
          />
        </aside>
        <main className="lg:col-span-3">
          <ArtifactGrid
            artifacts={filteredArtifacts}
            isLoading={isLoading}
            error={error?.message}
            viewMode={viewMode}
          />
        </main>
      </div>
    </div>
  );
}
