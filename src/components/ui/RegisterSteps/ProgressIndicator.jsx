import React from 'react';
import { useTranslation } from 'react-i18next';
import { Check } from 'lucide-react';

const ProgressIndicator = ({ currentStep, totalSteps = 2 }) => {
  const { t } = useTranslation();
  
  const steps = [
    { title: t('register.steps.accountInfo'), description: t('register.steps.accountDesc') },
    { title: t('register.steps.personalInfo'), description: t('register.steps.personalDesc') }
  ];
  
  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isActive = stepNumber === currentStep;
          const isCompleted = stepNumber < currentStep;
          
          return (
            <div key={index} className="flex flex-col items-center flex-1">
              <div className="relative flex items-center justify-center w-full">
                {/* Line */}
                {index < steps.length - 1 && (
                  <div 
                    className={`absolute left-1/2 w-full h-0.5 top-1/2 transform -translate-y-1/2
                      ${isCompleted ? 'bg-blue-600' : 'bg-gray-200'}`}
                  />
                )}
                
                {/* Circle */}
                <div 
                  className={`relative z-10 flex items-center justify-center w-10 h-10 rounded-full 
                    ${isActive ? 'bg-blue-600 text-white' : 
                      isCompleted ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}
                >
                  {isCompleted ? (
                    <Check className="w-6 h-6" />
                  ) : (
                    <span className="text-sm font-medium">{stepNumber}</span>
                  )}
                </div>
              </div>
              
              {/* Text */}
              <div className="mt-3 text-center">
                <p className={`text-sm font-medium ${isActive || isCompleted ? 'text-blue-600' : 'text-gray-500'}`}>
                  {step.title}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {step.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProgressIndicator; 