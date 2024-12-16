import ProtectedLayout from "./ProtectedLayout";

interface ILayoutProps {
   children: React.ReactNode;
}

const layout: React.FC<ILayoutProps> = ({ children }) => {
   return (
      <div className="flex flex-row min-h-screen w-full">
         <div className="flex flex-col w-full">
            <ProtectedLayout>{children}</ProtectedLayout>
         </div>
      </div>
   );
};

export default layout;