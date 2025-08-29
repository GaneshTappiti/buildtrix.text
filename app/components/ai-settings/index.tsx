import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Settings, Brain, Zap } from 'lucide-react';

interface AISettingsPanelProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const AISettingsPanel: React.FC<AISettingsPanelProps> = ({ 
  isOpen = false, 
  onClose 
}) => {
  const [settings, setSettings] = useState({
    autoGenerate: true,
    creativity: [0.7],
    responseLength: [150],
    includeExamples: true,
    realTimeValidation: false
  });

  const updateSetting = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  if (!isOpen) return null;

  return (
    <Card className="bg-black/40 backdrop-blur-sm border-white/10">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Brain className="h-5 w-5 text-green-400" />
          AI Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Auto Generate */}
        <div className="flex items-center justify-between">
          <div>
            <label className="text-sm font-medium text-white">Auto Generate</label>
            <p className="text-xs text-gray-400">Automatically generate content suggestions</p>
          </div>
          <Switch
            checked={settings.autoGenerate}
            onCheckedChange={(checked) => updateSetting('autoGenerate', checked)}
          />
        </div>

        {/* Creativity Level */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-white">Creativity Level</label>
          <Slider
            value={settings.creativity}
            onValueChange={(value) => updateSetting('creativity', value)}
            max={1}
            min={0}
            step={0.1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-400">
            <span>Conservative</span>
            <span>Creative</span>
          </div>
        </div>

        {/* Response Length */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-white">Response Length</label>
          <Slider
            value={settings.responseLength}
            onValueChange={(value) => updateSetting('responseLength', value)}
            max={500}
            min={50}
            step={25}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-400">
            <span>Brief</span>
            <span>Detailed</span>
          </div>
        </div>

        {/* Include Examples */}
        <div className="flex items-center justify-between">
          <div>
            <label className="text-sm font-medium text-white">Include Examples</label>
            <p className="text-xs text-gray-400">Add practical examples to responses</p>
          </div>
          <Switch
            checked={settings.includeExamples}
            onCheckedChange={(checked) => updateSetting('includeExamples', checked)}
          />
        </div>

        {/* Real-time Validation */}
        <div className="flex items-center justify-between">
          <div>
            <label className="text-sm font-medium text-white">Real-time Validation</label>
            <p className="text-xs text-gray-400">Validate ideas as you type</p>
          </div>
          <Switch
            checked={settings.realTimeValidation}
            onCheckedChange={(checked) => updateSetting('realTimeValidation', checked)}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-4">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onClose}
            className="border-gray-600 text-gray-300 hover:bg-gray-800"
          >
            Cancel
          </Button>
          <Button 
            size="sm"
            className="bg-green-600 hover:bg-green-700"
          >
            <Zap className="h-4 w-4 mr-2" />
            Apply Settings
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
