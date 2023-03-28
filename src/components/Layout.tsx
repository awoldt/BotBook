import NavBar from "./Nav";

export default function Layout({ children }: { children: any }) {
  return (
    <>
      <NavBar />
      <main>{children}</main>
    </>
  );
}
