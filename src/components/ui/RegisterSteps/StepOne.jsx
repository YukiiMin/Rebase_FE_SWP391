import React, { useState, useEffect } from "react";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Button } from "../../ui/button";
import { CheckCircle2, Eye, EyeOff } from "lucide-react";
import { useTranslation } from "react-i18next";

const StepOne = ({ 
  formik, 
  passwordStrength, 
  setPasswordStrength, 
  nextStep,
  isStaffForm = false
}) => {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Evaluate password strength
  useEffect(() => {
    const password = formik.values.password;
    if (!password) {
      setPasswordStrength("weak");
      return;
    }
    
    let score = 0;
    // Check length
    if (password.length >= 8) score++;
    // Check lowercase
    if (/[a-z]/.test(password)) score++;
    // Check uppercase
    if (/[A-Z]/.test(password)) score++;
    // Check numbers
    if (/\d/.test(password)) score++;
    // Check special characters
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score++;
    
    if (score <= 2) setPasswordStrength("weak");
    else if (score <= 4) setPasswordStrength("medium");
    else setPasswordStrength("strong");
  }, [formik.values.password, setPasswordStrength]);

  // Render password strength meter
  const renderPasswordStrength = () => {
    if (isStaffForm) return null; // Don't show for staff form since password is fixed

    let width = "0%";
    let text = "";
    
    if (passwordStrength === "weak") {
      width = "33%";
      text = t('register.passwordStrength.weak');
    } else if (passwordStrength === "medium") {
      width = "66%";
      text = t('register.passwordStrength.medium');
    } else if (passwordStrength === "strong") {
      width = "100%";
      text = t('register.passwordStrength.strong');
    }
    
    return (
      <div className="auth-password-strength my-4">
        <div className="auth-password-strength-header">
          <span>{t('register.passwordStrength.title')}</span>
          <span className={`auth-password-strength-text auth-password-strength-${passwordStrength}`}>{text}</span>
        </div>
        <div className="auth-password-strength-bar">
          <div className={`auth-password-strength-progress auth-password-strength-${passwordStrength}`} style={{ width }} />
        </div>
        
        {formik.values.password && (
          <div className="auth-password-requirements mt-3">
            <p className="auth-password-requirements-title">{t('register.passwordStrength.requirements')}</p>
            <ul className="auth-password-requirements-list space-y-1 mt-2">
              <li className={`auth-password-requirement ${formik.values.password.length >= 8 ? "auth-password-requirement-met" : ""}`}>
                <CheckCircle2 className="auth-password-requirement-icon" />
                {t('register.passwordStrength.length')}
              </li>
              <li className={`auth-password-requirement ${/[a-z]/.test(formik.values.password) ? "auth-password-requirement-met" : ""}`}>
                <CheckCircle2 className="auth-password-requirement-icon" />
                {t('register.passwordStrength.lowercase')}
              </li>
              <li className={`auth-password-requirement ${/[A-Z]/.test(formik.values.password) ? "auth-password-requirement-met" : ""}`}>
                <CheckCircle2 className="auth-password-requirement-icon" />
                {t('register.passwordStrength.uppercase')}
              </li>
              <li className={`auth-password-requirement ${/\d/.test(formik.values.password) ? "auth-password-requirement-met" : ""}`}>
                <CheckCircle2 className="auth-password-requirement-icon" />
                {t('register.passwordStrength.number')}
              </li>
              <li className={`auth-password-requirement ${/[!@#$%^&*(),.?":{}|<>]/.test(formik.values.password) ? "auth-password-requirement-met" : ""}`}>
                <CheckCircle2 className="auth-password-requirement-icon" />
                {t('register.passwordStrength.special')}
              </li>
            </ul>
          </div>
        )}
      </div>
    );
  };

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

        {isStaffForm ? (
          // For staff, show fixed disabled password field
          <div className="auth-form-group">
            <Label htmlFor="password" className="auth-label block mb-2">{t('register.password')}</Label>
            <Input
              id="password"
              name="password"
              type="password"
              disabled
              value={formik.values.password}
              className="py-2"
            />
            <p className="text-xs text-muted-foreground mt-2">
              Default password is "123456". User should change it after first login.
            </p>
          </div>
        ) : (
          // For regular users, show password with strength meter
          <div className="auth-form-group">
            <Label htmlFor="password" className="auth-label block mb-2">{t('register.password')}</Label>
            <div className="auth-input-wrapper">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder={t('register.createPassword')}
                className={`auth-input auth-input-password py-2 ${formik.touched.password && formik.errors.password ? "auth-input-error" : ""}`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="auth-password-toggle"
                tabIndex="-1"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
            {formik.touched.password && formik.errors.password && (
              <p className="auth-error-message mt-1">{formik.errors.password}</p>
            )}
            {renderPasswordStrength()}
          </div>
        )}

        {!isStaffForm && (
          <div className="auth-form-group">
            <Label htmlFor="confirmPassword" className="auth-label block mb-2">{t('register.confirmPassword')}</Label>
            <div className="auth-input-wrapper">
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={formik.values.confirmPassword}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder={t('register.confirmYourPassword')}
                className={`auth-input auth-input-password py-2 ${formik.touched.confirmPassword && formik.errors.confirmPassword ? "auth-input-error" : ""}`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="auth-password-toggle"
                tabIndex="-1"
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
            {formik.touched.confirmPassword && formik.errors.confirmPassword && (
              <p className="auth-error-message mt-1">{formik.errors.confirmPassword}</p>
            )}
          </div>
        )}

        <div className="flex justify-end mt-8">
          <Button 
            type="button" 
            onClick={handleNextStep}
            className="auth-submit-button"
          >
            {t('register.steps.next')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StepOne; 