"use client"
import { useState } from 'react';
import { Mail, ArrowRight, CheckCircle, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Reset error
    setError('');
    
    // Validate email
    if (!email.trim()) {
      setError('Vui lòng nhập địa chỉ email');
      return;
    }
    
    if (!validateEmail(email)) {
      setError('Địa chỉ email không hợp lệ');
      return;
    }
    
    // Call the actual API
    setLoading(true);
    
    try {
      const response = await fetch('http://localhost:3005/api/quenmatkhau', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Email không tồn tại trong hệ thống');
        } else {
          throw new Error(data.msg || 'Có lỗi xảy ra, vui lòng thử lại sau');
        }
      }
      
      // Success
      setSubmitted(true);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra, vui lòng thử lại sau';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        {!submitted ? (
          <>
            <div className="text-center">
              <h2 className="mt-6 text-3xl font-bold text-gray-900">Quên mật khẩu?</h2>
              <p className="mt-2 text-sm text-gray-600">
                Nhập email của bạn và chúng tôi sẽ gửi link đặt lại mật khẩu
              </p>
            </div>
            
            {error && (
              <div className="p-3 bg-red-50 rounded-md">
                <div className="flex">
                  <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              </div>
            )}
            
            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <div className="relative mt-1">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                    <Mail size={20} />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className={`block w-full pl-10 pr-3 py-2 border ${error ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
              
              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
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
                      Gửi link đặt lại mật khẩu
                      <ArrowRight size={18} className="ml-2" />
                    </span>
                  )}
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="text-center">
            <div className="flex justify-center">
              <CheckCircle size={60} className="text-green-500" />
            </div>
            <h2 className="mt-6 text-2xl font-bold text-gray-900">Kiểm tra email của bạn</h2>
            <p className="mt-2 text-sm text-gray-600">
              Chúng tôi đã gửi một email đến <span className="font-medium">{email}</span> với link đặt lại mật khẩu.
            </p>
            <p className="mt-4 text-sm text-gray-500">
              Nếu bạn không nhận được email, vui lòng kiểm tra thư mục spam hoặc
            </p>
            <button 
              onClick={() => {
                setSubmitted(false);
                setEmail('');
              }}
              className="mt-2 text-sm font-medium text-blue-600 hover:text-blue-500"
            >
              Thử lại với email khác
            </button>
          </div>
        )}
        
        <div className="text-center pt-4 mt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            <Link href="/auth/login" className="font-medium text-blue-600 hover:text-blue-500">
              Quay lại trang đăng nhập
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}