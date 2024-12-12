'use client';
import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';

const ForgotPassword = () => {
    const formik = useFormik({
        initialValues: {
            email: '',
        },
        validationSchema: Yup.object({
            email: Yup.string().email('Email không hợp lệ').required('Bắt buộc'),
        }),
        onSubmit: async (values, { setSubmitting, setFieldError }) => {
            try {
                const response = await axios.post(`http://localhost:8000/auth/forgot-password`, {
                    email: values.email,
                });

                if (response.status === 200) {
                    alert("Liên kết đặt lại mật khẩu đã được gửi. Vui lòng kiểm tra email của bạn.");
                } else {
                    throw new Error(response.data.message || 'Không thể gửi yêu cầu đặt lại mật khẩu');
                }
            } catch (error) {
                setFieldError(
                    'general',
                    error.response?.data?.message || 'Có lỗi xảy ra. Vui lòng thử lại sau.'
                );
            } finally {
                setSubmitting(false);
            }
        },
    });

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
                        QUÊN MẬT KHẨU
                    </h2>
                </div>

                <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                    <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                        <form onSubmit={formik.handleSubmit} className="space-y-6">
                            {formik.errors.general && (
                                <div className="text-red-600 text-sm text-center">{formik.errors.general}</div>
                            )}
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                    Email
                                </label>
                                <div className="mt-1">
                                    <input
                                        placeholder="Nhập email"
                                        id="email"
                                        type="email"
                                        {...formik.getFieldProps("email")}
                                        className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                    />
                                    {formik.touched.email && formik.errors.email ? (
                                        <div className="text-sm text-red-600">{formik.errors.email}</div>
                                    ) : null}
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-3 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            >
                                Gửi yêu cầu
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;