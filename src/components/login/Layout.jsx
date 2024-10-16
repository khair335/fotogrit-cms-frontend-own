const Layout = ({ children }) => {
  return (
    <div className="flex items-center justify-center w-full h-screen py-8 bg__img-camera">
      {children}
    </div>
  );
};

export default Layout;
