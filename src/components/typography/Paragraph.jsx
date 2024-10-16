const Paragraph = ({ loading, children, className }) => {
  return (
    <p
      className={` font-medium text-gray-600 break-words ${
        loading ? 'blur-sm' : 'blur-0'
      } ${className}`}
    >
      {children}
    </p>
  );
};

export default Paragraph;
