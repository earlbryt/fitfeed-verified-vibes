
import React from 'react';
import { cn } from '@/lib/utils';

interface WorkoutIntensityPickerProps {
  value: 'low' | 'medium' | 'high';
  onValueChange: (value: string) => void;
}

const WorkoutIntensityPicker: React.FC<WorkoutIntensityPickerProps> = ({
  value,
  onValueChange,
}) => {
  return (
    <div className="flex gap-2 w-full">
      <IntensityButton 
        intensity="low"
        label="Low"
        description="Light activity, can easily talk"
        isSelected={value === 'low'}
        onClick={() => onValueChange('low')}
      />
      <IntensityButton 
        intensity="medium"
        label="Medium"
        description="Moderate effort, slightly breathless"
        isSelected={value === 'medium'}
        onClick={() => onValueChange('medium')}
      />
      <IntensityButton 
        intensity="high"
        label="High"
        description="Hard effort, difficult to talk"
        isSelected={value === 'high'}
        onClick={() => onValueChange('high')}
      />
    </div>
  );
};

interface IntensityButtonProps {
  intensity: 'low' | 'medium' | 'high';
  label: string;
  description: string;
  isSelected: boolean;
  onClick: () => void;
}

const IntensityButton: React.FC<IntensityButtonProps> = ({ 
  intensity, 
  label, 
  description, 
  isSelected, 
  onClick 
}) => {
  return (
    <button
      type="button"
      className={cn(
        "flex flex-col items-center justify-center w-full p-3 rounded-lg border transition-all",
        isSelected ? 
          "border-primary bg-primary/5 ring-2 ring-primary/20" : 
          "border-border hover:border-primary/40"
      )}
      onClick={onClick}
    >
      <div className="flex items-center justify-center mb-1">
        <div className={cn(
          "h-3 rounded-full",
          intensity === 'low' ? "w-4 bg-green-500" : "",
          intensity === 'medium' ? "w-8 bg-amber-500" : "",
          intensity === 'high' ? "w-12 bg-red-500" : ""
        )} />
      </div>
      <span className={cn(
        "font-medium text-sm",
        isSelected ? "text-primary" : "text-foreground"
      )}>
        {label}
      </span>
      <span className="text-xs text-muted-foreground mt-1 text-center">
        {description}
      </span>
    </button>
  );
};

export default WorkoutIntensityPicker;
