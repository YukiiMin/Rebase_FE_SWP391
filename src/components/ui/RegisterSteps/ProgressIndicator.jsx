import React from 'react';
import { useTranslation } from 'react-i18next';

const ProgressIndicator = ({ currentStep, totalSteps = 2 }) => {
  const { t } = useTranslation();
  
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {Array.from({ length: totalSteps }, (_, index) => (
          <div key={index} className="flex flex-col items-center">
            <div 
              className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-medium
                ${index + 1 <= currentStep ? 'bg-blue-600' : 'bg-gray-300'}`}
            >
              {index + 1}
            </div>
            <span className={`mt-2 text-sm font-medium ${index + 1 <= currentStep ? 'text-blue-600' : 'text-gray-500'}`}>
              {index === 0 ? t('register.steps.accountInfo') : t('register.steps.personalInfo')}
            </span>
          </div>
        ))}
      </div>
      
      <div className="w-full mt-3 h-2 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className="h-full bg-blue-600 transition-all duration-300"
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ProgressIndicator; 