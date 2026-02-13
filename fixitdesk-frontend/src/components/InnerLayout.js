import { Outlet } from "react-router-dom";
import NavBar from "./navbar";
import '../css/animback.css';


export default function InnerLayout() {
  return (
    <div className="wrapper">
      <NavBar />
      <div>
        <Outlet/>
      </div>
      <div className="box">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>

  );
};



