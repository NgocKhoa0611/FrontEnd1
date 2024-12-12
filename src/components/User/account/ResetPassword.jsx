'use client';
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ResetPassword = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // Lấy tham số từ URL
    const queryParams = new URLSearchParams(location.search);
    const email = queryParams.get('email');
    const token = queryParams.get('token');

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError('Mật khẩu không khớp');
            return;
        }

        try {
            const response = await axios.post('http://localhost:8000/auth/reset-password', {
                email,
                token,
                password,
            });

            if (response.status === 200) {
                setSuccess(true); // Nếu thành công, hiển thị thông báo và chuyển hướng
                setTimeout(() => {
                    navigate('/login'); // Sau khi thành công, chuyển hướng đến trang login
                }, 2000);
            } else {
                setError(response.data.message || 'Có lỗi xảy ra');
            }
        } catch (error) {
            // Kiểm tra lỗi từ server và hiển thị thông báo phù hợp
            if (error.response) {
                // Lỗi từ phía server (ví dụ: token không hợp lệ hoặc hết hạn)
                setError(error.response.data.message || 'Có lỗi xảy ra');
            } else if (error.request) {
                // Không nhận được phản hồi từ server
                setError('Không thể kết nối đến server. Vui lòng thử lại sau.');
            } else {
                // Lỗi khác (ví dụ: cấu hình sai)
                setError(`Đã xảy ra lỗi: ${error.message}`);
            }
        }
    };

    return (
        <div className="relative h-screen bg-gray-50 overflow-hidden">
            <div className="absolute top-20 left-2 w-[500px] h-[500px] bg-[#D1208A80] rounded-full mix-blend-multiply filter blur-[150px] opacity-70 animate-blob"></div>
            <div className="absolute top-20 right-32 w-[500px] h-[500px] bg-[#FFB20080] rounded-full mix-blend-multiply filter blur-[150px] opacity-70 animate-blob animation-delay-2000"></div>
            <div className="flex min-h-full flex-col justify-center sm:px-6 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-md">
                    <img
                        className="mx-auto h-12 w-auto"
                        src="https://imgur.com/WRxNbZj.png"
                        alt="Your Company"
                    />
                    <h2 className="mt-6 text-center text-2xl font-bold tracking-tight text-gray-900">
                        ĐẶT LẠI MẬT KHẨU
                    </h2>
                </div>

                <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                    <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                        {success ? (
                            <div className="text-green-600 text-center">Đặt lại mật khẩu thành công! Đang chuyển hướng...</div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {error && <div className="text-red-600 text-sm text-center">{error}</div>}

                                {/* Thông tin email */}
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                        Email
                                    </label>
                                    <div className="mt-1">
                                        <input
                                            id="email"
                                            type="email"
                                            value={email} // Hiển thị email từ URL
                                            readOnly
                                            className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                        Mật khẩu mới
                                    </label>
                                    <div className="mt-1">
                                        <input
                                            id="password"
                                            type="password"
                                            placeholder="Nhập mật khẩu mới"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                                        Xác nhận mật khẩu
                                    </label>
                                    <div className="mt-1">
                                        <input
                                            id="confirmPassword"
                                            type="password"
                                            placeholder="Xác nhận mật khẩu"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-3 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                >
                                    Đặt lại mật khẩu
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
