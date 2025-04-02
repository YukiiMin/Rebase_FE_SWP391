import React from "react";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Button } from "../../ui/button";
import { useTranslation } from "react-i18next";
import PasswordStrengthMeter from "../PasswordStrengthMeter";

const StepOne = ({ 
  formik, 
  passwordStrength, 
  setPasswordStrength, 
  nextStep,
  onCancel,
  isStaffForm = false
}) => {
  const { t } = useTranslation();

  const handleNextStep = () => {
    // Validate only the fields in this step
    const stepOneFields = ['username', 'password', 'confirmPassword'];
    
    // Touch all fields in this step to trigger validation
    stepOneFields.forEach(field => {
      formik.setFieldTouched(field, true, true);
    });

    // Check if these specific fields are valid
    const isStepValid = stepOneFields.every(field => 
      !formik.touched[field] || !formik.errors[field]
    );

    // For regular users, check password strength; for staff, skip this check
    const isPasswordStrengthOk = isStaffForm || passwordStrength !== "weak";

    if (isStepValid && isPasswordStrengthOk) {
      nextStep();
    }
  };

  return (
    <div>
      <h3 className="text-lg font-medium mb-6">{t('register.steps.accountInfo')}</h3>
      
      <div className="space-y-6">
        <div className="auth-form-group">
          <Label htmlFor="username" className="auth-label block mb-2">{t('register.username')}</Label>
          <Input
            id="username"
            name="username"
            value={formik.values.username}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder={t('register.username')}
            className={`auth-input ${formik.touched.username && formik.errors.username ? "auth-input-error" : ""}`}
          />
          {formik.touched.username && formik.errors.username && (
            <p className="auth-error-message mt-1">{formik.errors.username}</p>
          )}
        </div>

        <PasswordStrengthMeter 
          formik={formik}
          passwordStrength={passwordStrength}
          setPasswordStrength={setPasswordStrength}
          showConfirmPassword={!isStaffForm}
          disabled={isStaffForm}
          defaultPassword="123456"
          helperText={isStaffForm ? "Default password is '123456'. User should change it after first login." : null}
        />

        <div className="flex justify-between mt-8">
          <Button 
            type="button" 
            onClick={onCancel}
            className="auth-secondary-button bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium"
          >
            {t('register.steps.cancel')}
          </Button>
          <Button 
            type="button" 
            onClick={handleNextStep}
            className="auth-submit-button bg-blue-600 hover:bg-blue-700 text-white font-medium"
          >
            {t('register.steps.next')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StepOne; 