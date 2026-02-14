import { Outlet } from "react-router-dom";
import NavBar from "./navbar";
import '../css/animback.css';


export default function InnerLayout() {
  return (
    <div className="wrapper fade-in">
      <NavBar />
      <div>
        <Outlet className="top-50"/>
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



