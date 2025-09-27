export default function Header() {
    return (
         <header className="p-4 border-b flex justify-between items-center">
        <h1 className="text-2xl font-bold text-red-600">DD Dictation Daily</h1>
        <nav className="flex gap-6 text-sm text-gray-600">
          <a href="#">All exercises</a>
          <a href="#">Top users</a>
          <a href="#">Other lessons</a>
          <button className="font-semibold text-red-600">Login</button>
          <button className="font-semibold text-red-600">Register</button>
        </nav>
      </header>
    );
};
