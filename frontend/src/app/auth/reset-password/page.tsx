'use client'
import { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { Eye, EyeOff, ShieldCheck, Lock, AlertCircle } from 'lucide-react';
import { useSearchParams, useRouter } from 'next/navigation';

// Define types for form data and errors
interface FormData {
  newPassword: string;
  confirmPassword: string;
}

interface FormErrors {
  newPassword?: string;
  confirmPassword?: string;
}

export default function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');
  
  const [formData, setFormData] = useState<FormData>({
    newPassword: '',
    confirmPassword: ''
  });
  
  const [passwordVisibility, setPasswordVisibility] = useState({
    newPassword: false,
    confirmPassword: false
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [apiError, setApiError] = useState('');
  
  // Kiểm tra token hợp lệ
  useEffect(() => {
    if (!token) {
      setApiError('Không tìm thấy token đặt lại mật khẩu. Vui lòng yêu cầu lại liên kết đặt lại mật khẩu.');
    }
  }, [token]);
  
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when user starts typing again
    if (errors[name as keyof FormErrors]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
    
    // Clear API error when user makes changes
    if (apiError) {
      setApiError('');
    }
  };
  
  const togglePasswordVisibility = (field: keyof typeof passwordVisibility) => {
    setPasswordVisibility({
      ...passwordVisibility, 
      [field]: !passwordVisibility[field]
    });
  };
  
  const validateForm = () => {
    const newErrors: FormErrors = {};
    
    // Validate new password
    if (!formData.newPassword) {
      newErrors.newPassword = 'Vui lòng nhập mật khẩu mới';
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = 'Mật khẩu mới phải có ít nhất 6 ký tự';
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
  
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (validateForm()) {
      if (!token) {
        setApiError('Không tìm thấy token đặt lại mật khẩu');
        return;
      }
      
      setLoading(true);
      setApiError('');
      
      try {
        const response = await fetch('http://localhost:3005/api/datlaimatkhau', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            token,
            newPassword: formData.newPassword
          }),
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.msg || 'Đã xảy ra lỗi khi đặt lại mật khẩu');
        }
        
        setSuccess(true);
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Đã xảy ra lỗi khi đặt lại mật khẩu';
        setApiError(errorMessage);
      } finally {
        setLoading(false);
      }
    }
  };
  
  const navigateToLogin = () => {
    router.push('/auth/login');
  };
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-lg">
        {success ? (
          <div className="text-center">
            <div className="flex justify-center">
              <ShieldCheck size={64} className="text-green-500" />
            </div>
            <h2 className="mt-6 text-2xl font-bold text-gray-900">Mật khẩu đã được cập nhật!</h2>
            <p className="mt-2 text-sm text-gray-600">
              Mật khẩu của bạn đã được đặt lại thành công. Bây giờ bạn có thể đăng nhập với mật khẩu mới.
            </p>
            <div className="mt-6">
              <button 
                onClick={navigateToLogin}
                className="inline-flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Đăng nhập
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="text-center">
              <div className="flex justify-center">
                <Lock size={40} className="text-blue-600" />
              </div>
              <h2 className="mt-4 text-3xl font-bold text-gray-900">Đặt lại mật khẩu</h2>
              <p className="mt-2 text-sm text-gray-600">
                Tạo mật khẩu mới cho tài khoản của bạn
              </p>
            </div>
            
            {apiError && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                <div className="flex">
                  <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                  <p className="text-sm text-red-600">{apiError}</p>
                </div>
              </div>
            )}
            
            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-6">
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
                      disabled={!token}
                    />
                    <button
                      type="button"
                      tabIndex={-1}
                      className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-gray-700"
                      onClick={() => togglePasswordVisibility('newPassword')}
                    >
                      {passwordVisibility.newPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {errors.newPassword ? (
                    <p className="mt-1 text-sm text-red-600">{errors.newPassword}</p>
                  ) : (
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
                      disabled={!token}
                    />
                    <button
                      type="button"
                      tabIndex={-1}
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
              
              <div>
                <button
                  type="submit"
                  disabled={loading || !token}
                  className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {loading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Đang xử lý...
                    </span>
                  ) : (
                    "Đặt lại mật khẩu"
                  )}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}