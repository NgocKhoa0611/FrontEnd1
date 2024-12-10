import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Email không hợp lệ")
        .required("Vui lòng nhập email"),
      password: Yup.string()
        .min(6, "Mật khẩu phải có ít nhất 6 ký tự")
        .required("Vui lòng nhập mật khẩu"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password"), null], "Mật khẩu xác nhận không khớp")
        .required("Vui lòng nhập mật khẩu xác nhận"),
    }),
    onSubmit: async (values) => {
      try {
        const response = await axios.post("http://localhost:8000/auth/register", {
          email: values.email,
          password: values.password,
        });
        setError(null);
        setSuccess(true);
      } catch (error) {
        if (error.response && error.response.data.message === "Email đã tồn tại") {
          setError("Email đã tồn tại. Vui lòng thử một email khác.");
        } else {
          setError("Đã xảy ra lỗi. Vui lòng thử lại sau.");
        }
        console.error("Đăng ký thất bại:", error);
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
            ĐĂNG KÝ TÀI KHOẢN
          </h2>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <form onSubmit={formik.handleSubmit} className="space-y-6">
              {error && (
                <div className="p-4 mb-4 text-sm text-red-600 bg-red-100 rounded-lg">
                  {error}
                </div>
              )}
              {/* Form fields */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  placeholder="Email"
                  id="email"
                  type="email"
                  {...formik.getFieldProps("email")}
                  className="block w-full rounded-md border px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
                {formik.touched.email && formik.errors.email ? (
                  <div className="text-sm text-red-600">{formik.errors.email}</div>
                ) : null}
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Mật khẩu
                </label>
                <input
                  placeholder="Mật khẩu"
                  id="password"
                  type="password"
                  {...formik.getFieldProps("password")}
                  className="block w-full rounded-md border px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
                {formik.touched.password && formik.errors.password ? (
                  <div className="text-sm text-red-600">{formik.errors.password}</div>
                ) : null}
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  Mật khẩu xác nhận
                </label>
                <input
                  placeholder="Mật khẩu xác nhận"
                  id="confirmPassword"
                  type="password"
                  {...formik.getFieldProps("confirmPassword")}
                  className="block w-full rounded-md border px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
                {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
                  <div className="text-sm text-red-600">{formik.errors.confirmPassword}</div>
                ) : null}
              </div>

              <button
                type="submit"
                className="w-full rounded-md bg-indigo-600 py-3 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none"
              >
                Đăng ký
              </button>
            </form>

            {success && (
              <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
                <div className="bg-white p-6 rounded-lg shadow-lg">
                  <h3 className="text-lg font-semibold text-green-600">Đăng ký thành công!</h3>
                  <p className="mt-2 text-gray-700">Tài khoản của bạn đã được tạo thành công.</p>
                  <button onClick={() => navigate("/login")} className="mt-4 w-full rounded-md bg-indigo-600 py-2 text-white hover:bg-indigo-700">
                    Đóng
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;

