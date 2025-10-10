interface BreadcrumbNavProps {
  title: string | undefined;
}

export const BreadcrumbNav: React.FC<BreadcrumbNavProps> = ({ title }) => {
  return (
    <div className="py-3">
      <nav className="max-w-6xl mx-auto px-4">
        <ol className="flex items-center space-x-2 text-sm">
          <li>
            <a href="/" className="text-gray-600 hover:text-red-600">
              All topics
            </a>
          </li>
          <li>
            <span className="text-gray-400">/</span>
          </li>
          <li>
            <a href="/stories" className="text-gray-600 hover:text-red-600">
              Stories for Kids
            </a>
          </li>
          <li>
            <span className="text-gray-400">/</span>
          </li>
          <li>
            <span className="text-red-600">{title || "Loading..."}</span>
          </li>
        </ol>
      </nav>
    </div>
  );
};