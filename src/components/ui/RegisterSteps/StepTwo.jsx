import React from "react";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Button } from "../../ui/button";
import { RadioGroup, RadioGroupItem } from "../../ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import { useTranslation } from "react-i18next";

const StepTwo = ({ 
  formik, 
  previousStep, 
  isLoading = false,
  isStaffForm = false
}) => {
  const { t } = useTranslation();

  return (
    <div>
      <h3 className="text-lg font-medium mb-6">{t('register.steps.personalInfo')}</h3>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="auth-form-group">
            <Label htmlFor="firstName" className="auth-label block mb-2">{t('register.firstName')}</Label>
            <Input
              id="firstName"
              name="firstName"
              value={formik.values.firstName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder={t('register.firstName')}
              className={`auth-input py-2 ${formik.touched.firstName && formik.errors.firstName ? "auth-input-error" : ""}`}
            />
            {formik.touched.firstName && formik.errors.firstName && (
              <p className="auth-error-message mt-1">{formik.errors.firstName}</p>
            )}
          </div>

          <div className="auth-form-group">
            <Label htmlFor="lastName" className="auth-label block mb-2">{t('register.lastName')}</Label>
            <Input
              id="lastName"
              name="lastName"
              value={formik.values.lastName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder={t('register.lastName')}
              className={`auth-input py-2 ${formik.touched.lastName && formik.errors.lastName ? "auth-input-error" : ""}`}
            />
            {formik.touched.lastName && formik.errors.lastName && (
              <p className="auth-error-message mt-1">{formik.errors.lastName}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {isStaffForm ? (
            // Staff form using RadioGroup for gender
            <div className="auth-form-group">
              <Label className="auth-label block mb-2">{t('register.gender')}</Label>
              <RadioGroup
                name="gender"
                value={formik.values.gender}
                onValueChange={(value) => formik.setFieldValue("gender", value)}
                className="flex space-x-6"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="MALE" id="MALE" />
                  <Label htmlFor="MALE">{t('register.male')}</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="FEMALE" id="FEMALE" />
                  <Label htmlFor="FEMALE">{t('register.female')}</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="OTHER" id="OTHER" />
                  <Label htmlFor="OTHER">{t('register.other')}</Label>
                </div>
              </RadioGroup>
              {formik.touched.gender && formik.errors.gender && (
                <p className="auth-error-message mt-1">{formik.errors.gender}</p>
              )}
            </div>
          ) : (
            // User form using Select dropdown for gender
            <div className="auth-form-group">
              <Label htmlFor="gender" className="auth-label block mb-2">{t('register.gender')}</Label>
              <select
                id="gender"
                name="gender"
                value={formik.values.gender}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`auth-select py-2 w-full ${formik.touched.gender && formik.errors.gender ? "auth-input-error" : ""}`}
              >
                <option value="">{t('register.selectGender')}</option>
                <option value="MALE">{t('register.male')}</option>
                <option value="FEMALE">{t('register.female')}</option>
                <option value="OTHER">{t('register.other')}</option>
              </select>
              {formik.touched.gender && formik.errors.gender && (
                <p className="auth-error-message mt-1">{formik.errors.gender}</p>
              )}
            </div>
          )}

          <div className="auth-form-group">
            <Label htmlFor="dob" className="auth-label block mb-2">{t('register.dob')}</Label>
            <Input
              id="dob"
              name="dob"
              type="date"
              value={formik.values.dob}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`auth-input py-2 ${formik.touched.dob && formik.errors.dob ? "auth-input-error" : ""}`}
            />
            {formik.touched.dob && formik.errors.dob && (
              <p className="auth-error-message mt-1">{formik.errors.dob}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="auth-form-group">
            <Label htmlFor={isStaffForm ? "phoneNumber" : "phone"} className="auth-label block mb-2">{t('register.phone')}</Label>
            <Input
              id={isStaffForm ? "phoneNumber" : "phone"}
              name={isStaffForm ? "phoneNumber" : "phone"}
              value={isStaffForm ? formik.values.phoneNumber : formik.values.phone}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="0xxxxxxxxx"
              className={`auth-input py-2 ${
                isStaffForm 
                  ? (formik.touched.phoneNumber && formik.errors.phoneNumber ? "auth-input-error" : "")
                  : (formik.touched.phone && formik.errors.phone ? "auth-input-error" : "")
              }`}
            />
            {isStaffForm 
              ? (formik.touched.phoneNumber && formik.errors.phoneNumber && (
                <p className="auth-error-message mt-1">{formik.errors.phoneNumber}</p>
              ))
              : (formik.touched.phone && formik.errors.phone && (
                <p className="auth-error-message mt-1">{formik.errors.phone}</p>
              ))
            }
          </div>

          <div className="auth-form-group">
            <Label htmlFor="email" className="auth-label block mb-2">{t('register.email')}</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder={t('register.email')}
              className={`auth-input py-2 ${formik.touched.email && formik.errors.email ? "auth-input-error" : ""}`}
            />
            {formik.touched.email && formik.errors.email && (
              <p className="auth-error-message mt-1">{formik.errors.email}</p>
            )}
          </div>
        </div>

        {isStaffForm && (
          <div className="auth-form-group">
            <Label htmlFor="address" className="auth-label block mb-2">Address</Label>
            <Input
              id="address"
              name="address"
              placeholder="Enter address"
              value={formik.values.address}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`auth-input py-2 ${formik.touched.address && formik.errors.address ? "auth-input-error" : ""}`}
            />
            {formik.touched.address && formik.errors.address && (
              <p className="auth-error-message mt-1">{formik.errors.address}</p>
            )}
          </div>
        )}

        {isStaffForm && (
          <div className="auth-form-group">
            <Label htmlFor="roleName" className="auth-label block mb-2">Role</Label>
            <Select
              name="roleName"
              value={formik.values.roleName}
              onValueChange={(value) => formik.setFieldValue("roleName", value)}
            >
              <SelectTrigger
                className={formik.touched.roleName && formik.errors.roleName ? "border-red-500" : ""}
              >
                <SelectValue placeholder="Select Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ADMIN">Admin</SelectItem>
                <SelectItem value="DOCTOR">Doctor</SelectItem>
                <SelectItem value="NURSE">Nurse</SelectItem>
              </SelectContent>
            </Select>
            {formik.touched.roleName && formik.errors.roleName && (
              <p className="auth-error-message mt-1">{formik.errors.roleName}</p>
            )}
          </div>
        )}

        <div className="flex justify-between mt-8">
          <Button 
            type="button" 
            onClick={previousStep}
            className="auth-secondary-button"
          >
            {t('register.steps.back')}
          </Button>
          <Button 
            type="submit" 
            className="auth-submit-button" 
            disabled={isLoading}
          >
            {isLoading ? t('register.processing') : (isStaffForm ? "Create Account" : t('register.register'))}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StepTwo; 