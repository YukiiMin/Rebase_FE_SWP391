import React, { useState, useEffect } from "react";
import { Input } from "./input";
import { Label } from "./label";
import { Eye, EyeOff, Shield, Check } from "lucide-react";
import { useTranslation } from "react-i18next";

const PasswordStrengthMeter = ({ 
  formik, 
  passwordStrength, 
  setPasswordStrength, 
  showConfirmPassword = true,
  disabled = false,
  defaultPassword = null,
  helperText = null
}) => {
  const { t } = useTranslation();
  const [showPasswordField, setShowPasswordField] = useState(false);
  const [showConfirmPasswordField, setShowConfirmPasswordField] = useState(false);

  // Evaluate password strength
  useEffect(() => {
    if (disabled) return;
    
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
  }, [formik.values.password, setPasswordStrength, disabled]);

  const getStrengthColor = () => {
    switch (passwordStrength) {
      case "strong":
        return "text-green-500";
      case "medium":
        return "text-yellow-500";
      default:
        return "text-red-500";
    }
  };

  const getStrengthWidth = () => {
    switch (passwordStrength) {
      case "strong":
        return "w-full bg-green-500";
      case "medium":
        return "w-2/3 bg-yellow-500";
      default:
        return "w-1/3 bg-red-500";
    }
  };

  // Render password strength meter
  const renderPasswordStrength = () => {
    if (disabled) return null;

    const requirements = [
      { test: (pwd) => pwd.length >= 8, label: t('register.passwordStrength.length') },
      { test: (pwd) => /[a-z]/.test(pwd), label: t('register.passwordStrength.lowercase') },
      { test: (pwd) => /[A-Z]/.test(pwd), label: t('register.passwordStrength.uppercase') },
      { test: (pwd) => /\d/.test(pwd), label: t('register.passwordStrength.number') },
      { test: (pwd) => /[!@#$%^&*(),.?":{}|<>]/.test(pwd), label: t('register.passwordStrength.special') }
    ];

    return (
      <div className="mt-4 space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">
              {t('register.passwordStrength.title')}
            </span>
            <span className={`text-sm font-medium ${getStrengthColor()}`}>
              {t(`register.passwordStrength.${passwordStrength}`)}
            </span>
          </div>
          <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
            <div className={`h-full transition-all duration-300 ${getStrengthWidth()}`} />
          </div>
        </div>

        {formik.values.password && (
          <div className="space-y-2">
            <div className="grid grid-cols-1 gap-2">
              {requirements.map((req, index) => (
                <div 
                  key={index}
                  className={`flex items-center space-x-2 text-sm ${
                    req.test(formik.values.password) ? 'text-green-600' : 'text-gray-500'
                  }`}
                >
                  {req.test(formik.values.password) ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <div className="w-4 h-4 border border-current rounded-full" />
                  )}
                  <span>{req.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="password" className="text-sm font-medium text-gray-700">
          {t('register.password')}
        </Label>
        {disabled ? (
          <>
            <Input
              id="password"
              name="password"
              type="password"
              disabled
              value={defaultPassword || "123456"}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
            {helperText && (
              <p className="text-sm text-gray-500 mt-1">{helperText}</p>
            )}
          </>
        ) : (
          <>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPasswordField ? "text" : "password"}
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder={t('register.createPassword')}
                className={`w-full px-3 py-2 pr-10 border rounded-md ${
                  formik.touched.password && formik.errors.password 
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500" 
                    : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPasswordField(!showPasswordField)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                tabIndex="-1"
              >
                {showPasswordField ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
            {formik.touched.password && formik.errors.password && (
              <p className="text-sm text-red-600 mt-1">{formik.errors.password}</p>
            )}
            {renderPasswordStrength()}
          </>
        )}
      </div>

      {showConfirmPassword && !disabled && (
        <div className="space-y-2">
          <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
            {t('register.confirmPassword')}
          </Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPasswordField ? "text" : "password"}
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder={t('register.confirmYourPassword')}
              className={`w-full px-3 py-2 pr-10 border rounded-md ${
                formik.touched.confirmPassword && formik.errors.confirmPassword 
                  ? "border-red-500 focus:border-red-500 focus:ring-red-500" 
                  : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPasswordField(!showConfirmPasswordField)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              tabIndex="-1"
            >
              {showConfirmPasswordField ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
          {formik.touched.confirmPassword && formik.errors.confirmPassword && (
            <p className="text-sm text-red-600 mt-1">{formik.errors.confirmPassword}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default PasswordStrengthMeter; 