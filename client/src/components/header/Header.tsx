import { Link, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import Swal from 'sweetalert2';

export default function Header() {
    const navigate = useNavigate();
    const token = Cookies.get('token');

    const handleLogout = () => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You will be logged out of your account!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#e83630', // text-red-600
            cancelButtonColor: '#6b7280', // text-gray-500
            confirmButtonText: 'Yes, logout',
            cancelButtonText: 'Cancel'
        }).then((result) => {
            if (result.isConfirmed) {
                Cookies.remove('token');
                Swal.fire({
                    title: 'Logged out!',
                    text: 'You have been successfully logged out.',
                    icon: 'success',
                    showConfirmButton: false,
                    timer: 1500
                });
                navigate('/signin');
            }
        });
    };

    return (
        <header className="p-4 border-b flex justify-between items-center">
            <Link to="/" className="text-2xl font-bold text-red-600">DD Dictation Daily</Link>
            <nav className="flex gap-6 text-sm text-gray-600">
                <Link to="/topics" className="hover:text-red-600">All topics</Link>
                <Link to="/users" className="hover:text-red-600">Top users</Link>
                <Link to="/lessons" className="hover:text-red-600">Other lessons</Link>
                {token ? (
                    <button 
                        onClick={handleLogout}
                        className="font-semibold text-red-600 hover:text-red-700"
                    >
                        Logout
                    </button>
                ) : (
                    <>
                        <Link 
                            to="/signin" 
                            className="font-semibold text-red-600 hover:text-red-700"
                        >
                            Login
                        </Link>
                        <Link 
                            to="/signup" 
                            className="font-semibold text-red-600 hover:text-red-700"
                        >
                            Register
                        </Link>
                    </>
                )}
            </nav>
        </header>
    );
};
