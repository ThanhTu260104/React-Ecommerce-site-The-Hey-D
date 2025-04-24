"use client"
import { useState } from 'react';
import { Eye, EyeOff, KeyRound, ShieldCheck } from 'lucide-react';

// Define interfaces for state types
interface ChangePasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface ChangePasswordErrors {
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
}

export default function ChangePasswordForm() {
  const [formData, setFormData] = useState<ChangePasswordFormData>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [passwordVisibility, setPasswordVisibility] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false
  });
  
  const [errors, setErrors] = useState<ChangePasswordErrors>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when user starts typing again
    if (errors[name as keyof ChangePasswordErrors]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const togglePasswordVisibility = (field: 'currentPassword' | 'newPassword' | 'confirmPassword') => {
    setPasswordVisibility({
      ...passwordVisibility,
      [field]: !passwordVisibility[field]
    });
  };

  const validateForm = () => {
    const newErrors: ChangePasswordErrors = {};
    
    // Validate current password
    if (!formData.currentPassword) {
      newErrors.currentPassword = 'Vui lòng nhập mật khẩu hiện tại';
    }
    
    // Validate new password
    if (!formData.newPassword) {
      newErrors.newPassword = 'Vui lòng nhập mật khẩu mới';
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = 'Mật khẩu mới phải có ít nhất 6 ký tự';
    } else if (formData.newPassword === formData.currentPassword) {
      newErrors.newPassword = 'Mật khẩu mới không được trùng với mật khẩu cũ';
    }
    
    // Validate confirm password
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Vui lòng xác nhận mật khẩu mới';
    } else if (formData.confirmPassword !== formData.newPassword) {
      newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (validateForm()) {
      setLoading(true);
      
      // Giả lập quá trình đổi mật khẩu
      setTimeout(() => {
        console.log('Đổi mật khẩu:', formData);
        setLoading(false);
        setSuccess(true);
        
        // Reset form after 3 seconds
        setTimeout(() => {
          setSuccess(false);
          setFormData({
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
          });
        }, 3000);
      }, 1500);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-lg">
        <div className="text-center">
          <div className="flex justify-center">
            <KeyRound size={40} className="text-blue-600" />
          </div>
          <h2 className="mt-4 text-3xl font-bold text-gray-900">Đổi mật khẩu</h2>
          <p className="mt-2 text-sm text-gray-600">
            Cập nhật mật khẩu mới để bảo vệ tài khoản của bạn
          </p>
        </div>
        
        {success ? (
          <div className="bg-green-50 border border-green-200 rounded-md p-4 flex items-center">
            <ShieldCheck size={24} className="text-green-500 mr-3" />
            <div>
              <h3 className="text-green-800 font-medium">Thành công!</h3>
              <p className="text-green-700 text-sm">Mật khẩu của bạn đã được cập nhật.</p>
            </div>
          </div>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              {/* Mật khẩu hiện tại */}
              <div>
                <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
                  Mật khẩu hiện tại <span className="text-red-500">*</span>
                </label>
                <div className="relative mt-1">
                  <input
                    id="currentPassword"
                    name="currentPassword"
                    type={passwordVisibility.currentPassword ? "text" : "password"}
                    autoComplete="current-password"
                    value={formData.currentPassword}
                    onChange={handleChange}
                    className={`block w-full px-3 py-2 border ${errors.currentPassword ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-gray-700"
                    onClick={() => togglePasswordVisibility('currentPassword')}
                  >
                    {passwordVisibility.currentPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.currentPassword && (
                  <p className="mt-1 text-sm text-red-600">{errors.currentPassword}</p>
                )}
              </div>
              
              {/* Mật khẩu mới */}
              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                  Mật khẩu mới <span className="text-red-500">*</span>
                </label>
                <div className="relative mt-1">
                  <input
                    id="newPassword"
                    name="newPassword"
                    type={passwordVisibility.newPassword ? "text" : "password"}
                    autoComplete="new-password"
                    value={formData.newPassword}
                    onChange={handleChange}
                    className={`block w-full px-3 py-2 border ${errors.newPassword ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-gray-700"
                    onClick={() => togglePasswordVisibility('newPassword')}
                  >
                    {passwordVisibility.newPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.newPassword && (
                  <p className="mt-1 text-sm text-red-600">{errors.newPassword}</p>
                )}
                {!errors.newPassword && (
                  <p className="mt-1 text-xs text-gray-500">Mật khẩu phải có ít nhất 6 ký tự</p>
                )}
              </div>
              
              {/* Xác nhận mật khẩu mới */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  Xác nhận mật khẩu mới <span className="text-red-500">*</span>
                </label>
                <div className="relative mt-1">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={passwordVisibility.confirmPassword ? "text" : "password"}
                    autoComplete="new-password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`block w-full px-3 py-2 border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-gray-700"
                    onClick={() => togglePasswordVisibility('confirmPassword')}
                  >
                    {passwordVisibility.confirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                )}
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <button
                type="button"
                className="text-sm font-medium text-gray-600 hover:text-gray-500"
                onClick={() => {
                  setFormData({
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                  });
                  setErrors({});
                }}
              >
                Hủy
              </button>
              
              <button
                type="submit"
                disabled={loading}
                className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Đang xử lý...
                  </span>
                ) : (
                  "Đổi mật khẩu"
                )}
              </button>
            </div>
          </form>
        )}
        
        <div className="pt-6 text-center">
          <p className="text-xs text-gray-500">
            Nếu bạn không nhớ mật khẩu hiện tại, vui lòng sử dụng 
            <a href="#" className="ml-1 text-blue-600 hover:text-blue-500">
              tính năng quên mật khẩu
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}