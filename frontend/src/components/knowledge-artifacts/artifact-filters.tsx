import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { X } from 'lucide-react';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { DatePicker } from '@/components/ui/date-picker';

export interface DateRange {
  from: Date | null;
  to: Date | null;
}

export interface ActiveFilters {
  fileTypes: string[];
  dateRange: DateRange;
}

interface ArtifactFiltersProps {
  fileTypes: string[];
  activeFilters: ActiveFilters;
  onFilterChange: (filters: ActiveFilters) => void;
}

export function ArtifactFilters({
  fileTypes,
  activeFilters,
  onFilterChange,
}: ArtifactFiltersProps) {
  const { fileTypes: selectedFileTypes, dateRange } = activeFilters;

  const handleFileTypeChange = (type: string, checked: boolean) => {
    const next = checked
      ? [...selectedFileTypes, type]
      : selectedFileTypes.filter((t) => t !== type);
    onFilterChange({ ...activeFilters, fileTypes: next });
  };

  const handleDateChange = (field: 'from' | 'to', date: Date | undefined) => {
    onFilterChange({
      ...activeFilters,
      dateRange: { ...dateRange, [field]: date },
    });
  };

  const clearAll = () =>
    onFilterChange({ fileTypes: [], dateRange: { from: null, to: null } });

  const hasAny =
    selectedFileTypes.length > 0 ||
    dateRange.from !== null ||
    dateRange.to !== null;

  return (
    <div className="bg-card border rounded-lg p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-lg">Filters</h3>
        {hasAny && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAll}
            className="h-8 px-2 text-xs"
          >
            Clear all
          </Button>
        )}
      </div>

      {hasAny && (
        <div className="flex flex-wrap gap-2 pb-2">
          {selectedFileTypes.map((t) => (
            <Badge key={t} variant="secondary" className="gap-1">
              {t}
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 p-0 ml-1"
                onClick={() => handleFileTypeChange(t, false)}
              >
                <X className="h-3 w-3" />
                <span className="sr-only">Remove {t}</span>
              </Button>
            </Badge>
          ))}

          {(dateRange.from || dateRange.to) && (
            <Badge variant="secondary" className="gap-1">
              {dateRange.from ? format(dateRange.from, 'MMM d, yyyy') : 'Any'} –{' '}
              {dateRange.to ? format(dateRange.to, 'MMM d, yyyy') : 'Any'}
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 p-0 ml-1"
                onClick={() => {
                  handleDateChange('from', undefined);
                  handleDateChange('to', undefined);
                }}
              >
                <X className="h-3 w-3" />
                <span className="sr-only">Clear dates</span>
              </Button>
            </Badge>
          )}
        </div>
      )}

      <Accordion type="multiple" defaultValue={['file-type', 'date']}>
        {/* File types */}
        <AccordionItem value="file-type">
          <AccordionTrigger>File Type</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {fileTypes.map((type) => (
                <div key={type} className="flex items-center space-x-2">
                  <Checkbox
                    id={`ft-${type}`}
                    checked={selectedFileTypes.includes(type)}
                    onCheckedChange={(c) =>
                      handleFileTypeChange(type, c === true)
                    }
                  />
                  <Label
                    htmlFor={`ft-${type}`}
                    className="cursor-pointer text-sm font-normal"
                  >
                    {type.toUpperCase()}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Date range */}
        <AccordionItem value="date">
          <AccordionTrigger>Created Date</AccordionTrigger>
          <AccordionContent className="flex flex-col gap-y-4">
            <div className="flex flex-col gap-y-2">
              {/* From */}
              <Label htmlFor="from-date">From</Label>
              <DatePicker
                id="from-date"
                value={dateRange.from}
                onChange={(d) => handleDateChange('from', d)}
              />
            </div>

            <div className="flex flex-col gap-y-2">
              {/* To */}
              <Label htmlFor="to-date">To</Label>
              <DatePicker
                id="to-date"
                value={dateRange.to}
                onChange={(d) => handleDateChange('to', d)}
              />
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
