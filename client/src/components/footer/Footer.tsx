export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t mt-12 py-6 text-center text-sm text-gray-600">
      <p>© dictationdaily.com - since 2019</p>
      <div className="flex justify-center gap-6 mt-2">
        <a href="#" className="hover:text-red-600">
          Home
        </a>
        <a href="#" className="hover:text-red-600">
          Blog
        </a>
        <a href="#" className="hover:text-red-600">
          Contact
        </a>
        <a href="#" className="hover:text-red-600">
          Privacy Policy
        </a>
      </div>
    </footer>
  );
}
