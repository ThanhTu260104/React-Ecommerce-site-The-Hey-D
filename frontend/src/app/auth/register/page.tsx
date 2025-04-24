"use client"
import { useState } from 'react';
import { Eye, EyeOff, UserPlus, AlertCircle, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// Define interfaces for state types
interface FormDataState {
  ho_ten: string;
  email: string;
  password: string;
  repeatPassword: string;
}

interface FormErrors {
  ho_ten?: string;
  email?: string;
  password?: string;
  repeatPassword?: string;
}

export default function SignupForm() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormDataState>({
    ho_ten: '',
    email: '',
    password: '',
    repeatPassword: ''
  });
  const [passwordVisibility, setPasswordVisibility] = useState({
    password: false,
    repeatPassword: false
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const validateForm = () => {
    const newErrors: FormErrors = {};
    
    // Validate full name
    if (!formData.ho_ten.trim()) {
      newErrors.ho_ten = 'Họ tên không được để trống';
    }
    
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email không được để trống';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }
    
    // Validate password
    if (!formData.password) {
      newErrors.password = 'Mật khẩu không được để trống';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    }
    
    // Validate confirm password
    if (!formData.repeatPassword) {
      newErrors.repeatPassword = 'Vui lòng xác nhận mật khẩu';
    } else if (formData.password !== formData.repeatPassword) {
      newErrors.repeatPassword = 'Mật khẩu không khớp';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (validateForm()) {
      setLoading(true);
      setApiError('');
      
      try {
        const response = await fetch('http://localhost:3005/api/dangky', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ho_ten: formData.ho_ten,
            email: formData.email,
            password: formData.password,
            repeatPassword: formData.repeatPassword
          }),
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          if (data.field) {
            // Set field-specific error
            setErrors({
              ...errors,
              [data.field]: data.msg
            });
          } else {
            throw new Error(data.msg || 'Đăng ký thất bại. Vui lòng thử lại.');
          }
        } else {
          setSuccess(true);
          // Reset form after successful submission
          setFormData({
            ho_ten: '',
            email: '',
            password: '',
            repeatPassword: ''
          });
        }
      } catch (err: unknown) {
        const errorMessage = err instanceof Error 
          ? err.message 
          : 'Đã xảy ra lỗi khi đăng ký. Vui lòng thử lại sau.';
        setApiError(errorMessage);
      } finally {
        setLoading(false);
      }
    }
  };

  const togglePasswordVisibility = (field: 'password' | 'repeatPassword') => {
    setPasswordVisibility({
      ...passwordVisibility,
      [field]: !passwordVisibility[field]
    });
  };

  const redirectToLogin = () => {
    router.push('/auth/login');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-lg">
        {success ? (
          <div className="text-center">
            <div className="flex justify-center">
              <CheckCircle size={64} className="text-green-500" />
            </div>
            <h2 className="mt-6 text-2xl font-bold text-gray-900">Đăng ký thành công!</h2>
            <p className="mt-2 text-sm text-gray-600">
              Chúng tôi đã gửi email xác nhận đến địa chỉ email của bạn. Vui lòng kiểm tra hộp thư đến và nhấp vào liên kết để kích hoạt tài khoản của bạn.
            </p>
            <div className="mt-6">
              <button 
                onClick={redirectToLogin}
                className="inline-flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Đến trang đăng nhập
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="text-center">
              <h2 className="mt-6 text-3xl font-bold text-gray-900">Đăng ký tài khoản</h2>
              <p className="mt-2 text-sm text-gray-600">
                Vui lòng điền thông tin để tạo tài khoản mới
              </p>
            </div>
            
            {apiError && (
              <div className="p-3 bg-red-50 rounded-md">
                <div className="flex">
                  <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                  <p className="text-sm text-red-600">{apiError}</p>
                </div>
              </div>
            )}
            
            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-4">
                {/* Họ tên */}
                <div>
                  <label htmlFor="ho_ten" className="block text-sm font-medium text-gray-700">
                    Họ tên <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="ho_ten"
                    name="ho_ten"
                    type="text"
                    autoComplete="name"
                    value={formData.ho_ten}
                    onChange={handleChange}
                    className={`mt-1 block w-full px-3 py-2 border ${errors.ho_ten ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                    placeholder="Nguyễn Văn A"
                  />
                  {errors.ho_ten && (
                    <p className="mt-1 text-sm text-red-600">{errors.ho_ten}</p>
                  )}
                </div>
                
                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`mt-1 block w-full px-3 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                    placeholder="example@email.com"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                  )}
                </div>
                
                {/* Mật khẩu */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Mật khẩu <span className="text-red-500">*</span>
                  </label>
                  <div className="relative mt-1">
                    <input
                      id="password"
                      name="password"
                      type={passwordVisibility.password ? "text" : "password"}
                      autoComplete="new-password"
                      value={formData.password}
                      onChange={handleChange}
                      className={`block w-full px-3 py-2 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-gray-700"
                      onClick={() => togglePasswordVisibility('password')}
                    >
                      {passwordVisibility.password ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                  )}
                </div>
                
                {/* Xác nhận mật khẩu */}
                <div>
                  <label htmlFor="repeatPassword" className="block text-sm font-medium text-gray-700">
                    Xác nhận mật khẩu <span className="text-red-500">*</span>
                  </label>
                  <div className="relative mt-1">
                    <input
                      id="repeatPassword"
                      name="repeatPassword"
                      type={passwordVisibility.repeatPassword ? "text" : "password"}
                      autoComplete="new-password"
                      value={formData.repeatPassword}
                      onChange={handleChange}
                      className={`block w-full px-3 py-2 border ${errors.repeatPassword ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-gray-700"
                      onClick={() => togglePasswordVisibility('repeatPassword')}
                    >
                      {passwordVisibility.repeatPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {errors.repeatPassword && (
                    <p className="mt-1 text-sm text-red-600">{errors.repeatPassword}</p>
                  )}
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
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
                    <span className="flex items-center">
                      <UserPlus size={20} className="mr-2" />
                      Đăng ký
                    </span>
                  )}
                </button>
              </div>
            </form>
            
            <div className="text-center">
              <p className="mt-2 text-sm text-gray-600">
                Đã có tài khoản?{' '}
                <Link href="/auth/login" className="font-medium text-blue-600 hover:text-blue-500">
                  Đăng nhập ngay
                </Link>
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}