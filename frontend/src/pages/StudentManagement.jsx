import { useEffect, useState } from "react";
import api from "../services/api";
import SectionCard from "../components/SectionCard";

function StudentManagement() {
    const [students, setStudents] = useState([]);

    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
    });

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        loadStudents();
    }, []);

    const loadStudents = async () => {
        try {
            const response = await api.get("/students");
            setStudents(response.data);
        } catch (error) {
            console.error(error);
            setError("Unable to load students.");
        }
    };

    const handleChange = (event) => {
        setForm({
            ...form,
            [event.target.name]: event.target.value,
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        setMessage("");
        setError("");

        try {
            await api.post("/students", form);

            setMessage(
                "Student has been added successfully."
            );

            setForm({
                name: "",
                email: "",
                phone: "",
            });

            await loadStudents();
        } catch (error) {
            console.error(error);

            setError(
                error.response?.data?.message ||
                    "Unable to add student."
            );
        }
    };

    const deleteStudent = async (id) => {
        if (
            !window.confirm(
                "Are you sure you want to delete this student?"
            )
        ) {
            return;
        }

        try {
            await api.delete(`/students/${id}`);

            setMessage(
                "Student has been deleted successfully."
            );

            await loadStudents();
        } catch (error) {
            console.error(error);

            setError(
                "Unable to delete student. The student may be associated with existing orders."
            );
        }
    };

    return (
        <div className="page-container">
            <div className="page-header">
                <div>
                    <h1>Student Management</h1>
                    <p>
                        Register and manage students using
                        the canteen.
                    </p>
                </div>
            </div>

            <SectionCard
                title="Register Student"
                subtitle="Enter the student's basic information"
            >
                <form
                    className="form-grid"
                    onSubmit={handleSubmit}
                >
                    <div className="form-group">
                        <label>Student Name</label>

                        <input
                            type="text"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            placeholder="Enter student name"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Email</label>

                        <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            placeholder="Enter email address"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Phone</label>

                        <input
                            type="text"
                            name="phone"
                            value={form.phone}
                            onChange={handleChange}
                            placeholder="Enter phone number"
                        />
                    </div>

                    <div className="form-actions">
                        <button
                            type="submit"
                            className="primary-button"
                        >
                            Add Student
                        </button>
                    </div>
                </form>

                {message && (
                    <div className="success-message">
                        {message}
                    </div>
                )}

                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}
            </SectionCard>

            <SectionCard
                title="Registered Students"
                subtitle={`${students.length} student(s) registered`}
            >
                <div className="table-wrapper">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {students.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan="5"
                                        className="empty-state"
                                    >
                                        No students found.
                                    </td>
                                </tr>
                            ) : (
                                students.map((student) => (
                                    <tr
                                        key={
                                            student.studentId
                                        }
                                    >
                                        <td>
                                            {
                                                student.studentId
                                            }
                                        </td>

                                        <td>
                                            {student.name}
                                        </td>

                                        <td>
                                            {student.email}
                                        </td>

                                        <td>
                                            {student.phone ||
                                                "-"}
                                        </td>

                                        <td>
                                            <button
                                                className="danger-button small"
                                                onClick={() =>
                                                    deleteStudent(
                                                        student.studentId
                                                    )
                                                }
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </SectionCard>
        </div>
    );
}

export default StudentManagement;