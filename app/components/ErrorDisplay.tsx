"use client"

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertTriangle, X } from "lucide-react";
import { useBuilder, builderActions } from "@/lib/builderContext";

export function ErrorDisplay() {
  const { state, dispatch } = useBuilder();

  if (!state.error) return null;

  const handleDismiss = () => {
    dispatch(builderActions.setError(null));
  };

  return (
    <Alert variant="destructive" className="mb-4">
      <AlertTriangle className="h-4 w-4" />
      <AlertDescription className="flex items-center justify-between">
        <span>{state.error}</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleDismiss}
          className="h-auto p-1 hover:bg-destructive/20"
        >
          <X className="h-4 w-4" />
        </Button>
      </AlertDescription>
    </Alert>
  );
}
