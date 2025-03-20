
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ObjectiveForm from "./ObjectiveForm";

export type Objective = {
  id: number;
  title: string;
  description: string;
  kpi: string;
  weight: number;
  target: string;
  progress: number;
  status: "On Track" | "At Risk" | "Delayed" | "Completed";
  dueDate: string;
};

interface ObjectiveDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  objective?: Objective;
  onSave: (objective: Omit<Objective, "id" | "progress">) => void;
  isEditing: boolean;
}

const ObjectiveDialog = ({
  open,
  onOpenChange,
  objective,
  onSave,
  isEditing,
}: ObjectiveDialogProps) => {
  const handleSubmit = (values: Omit<Objective, "id" | "progress">) => {
    onSave(values);
    onOpenChange(false);
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  const defaultValues = objective
    ? {
        title: objective.title,
        description: objective.description,
        kpi: objective.kpi,
        weight: objective.weight,
        target: objective.target,
        dueDate: objective.dueDate,
        status: objective.status,
      }
    : undefined;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Objective" : "Add New Objective"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Make changes to the existing objective."
              : "Enter details for your new SMART objective."}
          </DialogDescription>
        </DialogHeader>
        <ObjectiveForm
          defaultValues={defaultValues}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isEditing={isEditing}
        />
      </DialogContent>
    </Dialog>
  );
};

export default ObjectiveDialog;
