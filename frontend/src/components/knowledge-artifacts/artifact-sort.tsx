import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { ArrowUpDown } from 'lucide-react';
import { KnowledgeArtifact } from '@/types/knowledge-artifacts';

interface ArtifactSortProps {
  onSortChange: (
    key: keyof KnowledgeArtifact,
    direction: 'asc' | 'desc',
  ) => void;
  currentSort: {
    key: string;
    direction: string;
  };
}

export function ArtifactSort({ onSortChange, currentSort }: ArtifactSortProps) {
  const handleSortChange = (value: string) => {
    const [key, direction] = value.split('-');
    onSortChange(key as keyof KnowledgeArtifact, direction as 'asc' | 'desc');
  };

  const currentValue = `${currentSort.key}-${currentSort.direction}`;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-[160px]">
          <ArrowUpDown className="mr-2 h-4 w-4" />
          Sort by
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[200px]">
        <DropdownMenuRadioGroup
          value={currentValue}
          onValueChange={handleSortChange}
        >
          <DropdownMenuRadioItem value="title-asc">
            Title (A-Z)
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="title-desc">
            Title (Z-A)
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="createdAt-desc">
            Newest first
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="createdAt-asc">
            Oldest first
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="updatedAt-desc">
            Recently updated
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="id-desc">
            ID (Highest)
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="id-asc">
            ID (Lowest)
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
