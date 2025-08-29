import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GitBranch, Plus, Calendar, Lightbulb, Target, Users } from "lucide-react";
import IdeaProgressOverview from "./IdeaProgressOverview";

interface JourneyViewProps {
  ideaId: string;
}

const JourneyView: React.FC<JourneyViewProps> = ({ ideaId }) => {
  return (
    <div className="space-y-6">
      {/* Progress Overview */}
      <IdeaProgressOverview
        wikiProgress={75}
        blueprintProgress={60}
        journeyProgress={40}
        feedbackProgress={30}
        showOverallProgress={true}
      />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <GitBranch className="h-6 w-6 text-green-400" />
          <h2 className="workspace-title">Founder's Journey</h2>
        </div>
        <Button className="workspace-button">
          <Plus className="h-4 w-4 mr-2" />
          Add Entry
        </Button>
      </div>

      {/* Journey Timeline */}
      <div className="space-y-4">
        {/* Entry 1 */}
        <Card className="glass-effect-theme workspace-hover">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-white flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-green-400" />
                Initial Idea Validation
              </CardTitle>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Calendar className="h-4 w-4" />
                <span>2 days ago</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-3">
              <Badge className="bg-green-600/20 text-green-400 border-green-500/30">Insight</Badge>
            </div>
            <p className="text-gray-300 mb-4">
              Conducted initial market research and found that 73% of gym-goers struggle with proper form.
              This validates our core problem statement and the need for real-time feedback.
            </p>
            <div className="text-sm text-gray-400">
              Key takeaway: Focus on form correction as the primary value proposition
            </div>
          </CardContent>
        </Card>

        {/* Entry 2 */}
        <Card className="glass-effect-theme workspace-hover">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-white flex items-center gap-2">
                <Users className="h-5 w-5 text-emerald-400" />
                User Interview Insights
              </CardTitle>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Calendar className="h-4 w-4" />
                <span>5 days ago</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-3">
              <Badge className="bg-emerald-600/20 text-emerald-400 border-emerald-500/30">Research</Badge>
            </div>
            <p className="text-gray-300 mb-4">
              Interviewed 12 fitness enthusiasts. Main pain points: lack of personalized guidance,
              fear of injury, and difficulty tracking progress effectively.
            </p>
            <div className="text-sm text-gray-400">
              Next step: Create user personas and refine feature priorities
            </div>
          </CardContent>
        </Card>

        {/* Entry 3 */}
        <Card className="glass-effect-theme workspace-hover">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-white flex items-center gap-2">
                <Target className="h-5 w-5 text-teal-400" />
                Competitive Analysis Complete
              </CardTitle>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Calendar className="h-4 w-4" />
                <span>1 week ago</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-3">
              <Badge className="bg-teal-600/20 text-teal-400 border-teal-500/30">Analysis</Badge>
            </div>
            <p className="text-gray-300 mb-4">
              Analyzed 8 major competitors including Nike Training Club, Freeletics, and Fitbod.
              None offer real-time form correction using computer vision - this is our differentiator.
            </p>
            <div className="text-sm text-gray-400">
              Opportunity: First-mover advantage in AI-powered form correction
            </div>
          </CardContent>
        </Card>

        {/* Add Entry Placeholder */}
        <Card className="glass-effect border-dashed border-green-500/20">
          <CardContent className="p-8 text-center">
            <GitBranch className="h-8 w-8 text-green-400 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-gray-300 mb-2">Document Your Journey</h3>
            <p className="text-gray-400 mb-4">
              Track insights, decisions, and milestones as you develop your idea.
            </p>
            <Button variant="outline" className="border-green-500/30 text-green-400 hover:bg-green-600/10">
              <Plus className="h-4 w-4 mr-2" />
              Add Entry
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default JourneyView;
