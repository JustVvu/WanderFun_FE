import { AppSidebar } from "../components/AppSidebar";
import ProtectedLayout from "./ProtectedLayout";

interface ILayoutProps {
   children: React.ReactNode;
}

const layout: React.FC<ILayoutProps> = ({ children }) => {
   return (
      <div className="flex flex-row min-h-screen w-full">
         <div className="w-fit shadow-2xl bg-white">
            <AppSidebar />
         </div>
         <div className="flex-auto h-fit min-h-screen">
            <ProtectedLayout>{children}</ProtectedLayout>
         </div>
      </div>
   );
};

export default layout;