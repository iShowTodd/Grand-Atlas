import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import Header from "./Header";
import ApiNotice from "../../app/ApiNotice";
import HelmetDefaults from "../../app/HelmetDefaults";

export default function Layout() {
  return (
    <>
      <HelmetDefaults />
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <Header />
      <ApiNotice />
      <div id="main-content">
        <Outlet />
      </div>
      <Footer />
    </>
  );
}
