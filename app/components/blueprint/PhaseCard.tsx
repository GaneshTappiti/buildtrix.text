import React from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Plus, CheckCircle, Clock } from "lucide-react";

export interface Task {
  id: number;
  title: string;
  status: "completed" | "in-progress" | "pending";
}

export interface Phase {
  id: string;
  title: string;
  description: string;
  tasks: Task[];
  duration: string;
  progress: number;
}

interface PhaseCardProps {
  phase: Phase;
  index: number;
  onAddTask: (phaseId: string) => void;
  onEditTask: (phaseId: string, task: Task) => void;
  onToggleTaskStatus: (phaseId: string, taskId: number) => void;
}

const PhaseCard: React.FC<PhaseCardProps> = ({ 
  phase, 
  index,
  onAddTask,
  onEditTask,
  onToggleTaskStatus
}) => {
  return (
    <Card className="workspace-card">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-xl">
            Phase {index + 1}: {phase.title}
          </CardTitle>
          <p className="text-muted-foreground">{phase.description}</p>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>{phase.duration}</span>
          </div>
          <Progress value={phase.progress} className="w-24 mt-2" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {phase.tasks.map((task) => (
            <div
              key={task.id}
              className="flex items-center justify-between p-3 bg-muted rounded-lg cursor-pointer hover:bg-muted/80 transition-colors"
              onClick={() => onEditTask(phase.id, task)}
            >
              <div className="flex items-center gap-3">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleTaskStatus(phase.id, task.id);
                  }}
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                    task.status === "completed"
                      ? "bg-green-500 border-green-500"
                      : task.status === "in-progress"
                      ? "bg-blue-500 border-blue-500"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                >
                  {task.status === "completed" && (
                    <CheckCircle className="h-3 w-3 text-white" />
                  )}
                </button>
                <span
                  className={`${
                    task.status === "completed"
                      ? "line-through text-muted-foreground"
                      : ""
                  }`}
                >
                  {task.title}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    task.status === "completed"
                      ? "bg-green-100 text-green-800"
                      : task.status === "in-progress"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {task.status === "completed"
                    ? "Done"
                    : task.status === "in-progress"
                    ? "In Progress"
                    : "Pending"}
                </span>
              </div>
            </div>
          ))}
          <Button
            variant="outline"
            className="w-full"
            onClick={() => onAddTask(phase.id)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Task
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PhaseCard;
