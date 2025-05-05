import { CalendarIcon } from 'lucide-react';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface DatePickerProps {
  id: string;
  value: Date | null;
  onChange: (date: Date | undefined) => void;
  placeholder?: string;
}

export function DatePicker({
  id,
  value,
  onChange,
  placeholder = 'Pick a date',
}: DatePickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          id={id}
          variant="outline"
          className={cn(
            'w-full justify-start text-left font-normal',
            !value && 'text-muted-foreground',
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value ? format(value, 'PPP') : placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 " align="start">
        <Calendar
          classNames={{
            day: 'p-2',
          }}
          mode="single"
          selected={value || undefined}
          onSelect={onChange}
        />
      </PopoverContent>
    </Popover>
  );
}
