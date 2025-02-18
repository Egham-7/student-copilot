import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";

interface DeleteConfirmationProps {
  title?: string;
  description?: string;
  onDelete: () => Promise<void>;
  trigger?: React.ReactNode;
  children?: React.ReactNode;
  isLoading?: boolean;
}

export function DeleteConfirmation({
  title = "Are you absolutely sure?",
  description = "This action cannot be undone.",
  onDelete,
  trigger,
  children,
  isLoading,
}: DeleteConfirmationProps) {
  const isMobile = useIsMobile();

  if (!isMobile) {
    return (
      <Dialog>
        <DialogTrigger asChild>
          {trigger || (
            <Button variant="destructive" size="sm">
              Delete
            </Button>
          )}
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>
          {children}
          <DialogFooter>
            <Button
              variant="destructive"
              disabled={isLoading}
              onClick={onDelete}
            >
              {isLoading ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer>
      <DrawerTrigger asChild>
        {trigger || (
          <Button variant="destructive" size="sm">
            Delete
          </Button>
        )}
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>{title}</DrawerTitle>
          <DrawerDescription>{description}</DrawerDescription>
        </DrawerHeader>
        {children}
        <DrawerFooter className="pt-2">
          <Button
            variant="destructive"
            disabled={isLoading}
            onClick={onDelete}
            className="w-full"
          >
            {isLoading ? "Deleting..." : "Delete"}
          </Button>
          <DrawerClose asChild>
            <Button variant="outline" className="w-full">
              Cancel
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
