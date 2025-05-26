interface ILayoutProps {
   children: React.ReactNode;
}

const Layout = ({ children }: ILayoutProps) => {
   return (
      <div>{children}</div>
   )
}


export default Layout;