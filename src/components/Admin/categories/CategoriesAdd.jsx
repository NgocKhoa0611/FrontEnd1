import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import './Categories.css';

function NewCategories() {
    const navigate = useNavigate();
    const formik = useFormik({
        initialValues: {
            category_id: '',
            category_parent_id: '',
            category_name: ''
        },
        validationSchema: Yup.object({
            category_id: Yup.string().required('ID danh mục là bắt buộc'),
            category_parent_id: Yup.string().required('ID danh mục cha là bắt buộc'),
            category_name: Yup.string().required('Tên danh mục là bắt buộc'),
        }),
        onSubmit: async (values) => {
            try {
                const res = await fetch('http://localhost:8000/category/add', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(values),
                });

                const result = await res.json();
                if (result.error) {
                    alert(result.error);
                    return;
                }

                alert('Thêm danh mục thành công!');
                navigate('/categories');
            } catch (err) {
                console.error('Error:', err);
                alert('Có lỗi xảy ra, vui lòng thử lại!');
            }
        }
    });

    return (
        <form id="frmaddcate" onSubmit={formik.handleSubmit}>
            <h2>Thêm danh mục</h2>
            <div className='col'>
                <label>ID danh mục:</label>
                <input
                    type="text"
                    className="form-control"
                    name="category_id"
                    value={formik.values.category_id}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                />
                {formik.touched.category_id && formik.errors.category_id && (
                    <div className="error">{formik.errors.category_id}</div>
                )}
            </div>
            <div className='col'>
                <label>ID danh mục cha:</label>
                <input
                    type="text"
                    className="form-control"
                    name="category_parent_id"
                    value={formik.values.category_parent_id}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                />
                {formik.touched.category_parent_id && formik.errors.category_parent_id && (
                    <div className="error">{formik.errors.category_parent_id}</div>
                )}
            </div>
            <div className='col'>
                <label>Tên danh mục:</label>
                <input
                    type="text"
                    className="form-control"
                    name="category_name"
                    value={formik.values.category_name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                />
                {formik.touched.category_name && formik.errors.category_name && (
                    <div className="error">{formik.errors.category_name}</div>
                )}
            </div>

            <div className="mb-3">
                <button className="add-btn-categories" type="submit">
                    Thêm danh mục
                </button> &nbsp;
                <Link to={`/categories`} href="/#" className="btn-categories-list">Danh sách</Link>
            </div>
        </form>
    );
}

export default NewCategories;
