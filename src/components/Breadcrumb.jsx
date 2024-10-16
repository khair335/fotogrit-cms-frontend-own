import { IoIosArrowForward } from 'react-icons/io';
import { Link } from 'react-router-dom';

const Breadcrumb = ({ title, items }) => {
  return (
    <nav className="text-sm font-medium">
      <h3 className="text-xl font-medium">{title}</h3>

      <ol className="inline-flex items-center gap-2 p-0 list-none">
        {items.map((item, index) => (
          <div
            key={`breadcrumb-${index}`}
            className="inline-flex items-center gap-2"
          >
            {index > 0 && <IoIosArrowForward className="text-green-800" />}
            <li className="flex items-center text-xs" key={item.label}>
              {item.url ? (
                <Link
                  to={item.url}
                  className="outline-none text-ftgreen-600 hover:text-ftgreen-800"
                >
                  {item.label}
                </Link>
              ) : (
                <span className="font-bold text-ftgreen-600">{item.label}</span>
              )}
            </li>
          </div>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
