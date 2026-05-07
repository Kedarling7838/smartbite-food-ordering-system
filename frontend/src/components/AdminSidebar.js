import React,{ useState} from "react";
import { Link } from "react-router-dom";
import { FaChevronDown, FaChevronUp, FaCommentAlt, FaEdit, FaFile, FaList, FaSearch, FaThLarge,FaUsers } from "react-icons/fa";
const AdminSidebar=()=>{
    const [openMenus,setOpenMenus]=useState({
        category:false,
        food:false,
        orders:false
    })
    const toggleMenu =(menu)=>{
        setOpenMenus((prev)=>({...prev,[menu]:!prev[menu]}));
    }
    
    return (
        <div className="bg-dark text-white sidebar">
            <div className="text-center p-3 border-bottom">
                <img src="/images/admin.jpg" className="img-fluid rounded-circle mb-2" width="70"/>
                <h6 className="mb-0">Admin</h6>
            </div>

            <div  className="list-group list-group-flush">
                <Link to="/admin-dashboard" className="list-group-item list-group-item-action bg-dark text-white" >
                   <FaThLarge/> Dashboard
                </Link>
           
            </div>
            <div className="list-group list-group-flush">
                <Link to="/manage-users" className="list-group-item list-group-item-action bg-dark text-white" >
                   <FaUsers/> Reg Users
                </Link>
            </div>

            <button onClick={()=>toggleMenu('category')} className="list-group-item list-group-item-action bg-dark text-white ps-3 mb-2">
                <FaEdit className="me-1"/>Food Category {openMenus.category ? <FaChevronUp/>:<FaChevronDown/>}
            </button>
              {openMenus.category &&(
            <div className="ps-4">
                <Link to='/add-category'  className="list-group-item list-group-item-action bg-dark text-white" >
                       Add Category
                </Link>
                <Link to='/manage-category'  className="list-group-item list-group-item-action bg-dark text-white" >
                       Manage Category
                </Link>
            </div>
                    )}
            <button onClick={()=>toggleMenu('food')} className="list-group-item list-group-item-action bg-dark text-white ps-3 mb-2">
                <FaEdit className="me-1"/>Food Menu  {openMenus.food ? <FaChevronUp/>:<FaChevronDown/>}
            </button>
                    {openMenus.food &&(
             <div className="ps-4">
                <Link  to='/add-food' className="list-group-item list-group-item-action bg-dark text-white" >
                      Add Food 
                </Link>
                <Link to='/manage-food' className="list-group-item list-group-item-action bg-dark text-white" >
                      Manage Food 
                </Link>
            </div>
                 )}

            <button onClick={()=>toggleMenu('orders')} className="list-group-item list-group-item-action bg-dark text-white ps-3 mb-2">
                <FaList className="me-1"/>Orders  {openMenus.orders ? <FaChevronUp/>:<FaChevronDown/>}
            </button>
                    {openMenus.orders &&(
             <div className="ps-4">
                <Link to="/order-not-confirmed" className="list-group-item list-group-item-action bg-dark text-white" >
                     Not confirmed 
                </Link>
                <Link to="/order-confirmed" className="list-group-item list-group-item-action bg-dark text-white" >
                      Confirmed 
                </Link>
                <Link to="/food-being-prepared" className="list-group-item list-group-item-action bg-dark text-white" >
                      Being Prepared 
                </Link>
                <Link to="/food-pickup"   className="list-group-item list-group-item-action bg-dark text-white" >
                      Food Pickup 
                </Link>
                <Link to="/food-delivered" className="list-group-item list-group-item-action bg-dark text-white" >
                      Delivered 
                </Link>
                <Link to="/order-cancelled" className="list-group-item list-group-item-action bg-dark text-white" >
                      Cancelled 
                </Link>
                <Link to="/all-orders" className="list-group-item list-group-item-action bg-dark text-white" >
                      All Orders 
                </Link>
            </div>
                 )}

            <div className="list-group list-group-flush">
                <Link to="/order-report" className="list-group-item list-group-item-action bg-dark text-white" >
                   <FaFile/> B/w Dates Report
                </Link>
            </div>
            <div className="list-group list-group-flush">
                <Link to="/search-order" className="list-group-item list-group-item-action bg-dark text-white" >
                   <FaSearch/> Search
                </Link>
            </div>
            <div className="list-group list-group-flush">
                <Link  to="/manage-reviews" className="list-group-item list-group-item-action bg-dark text-white" >
                   <FaCommentAlt/> Manage Reviews
                </Link>
            </div>
        </div>
    
    )
}
export default AdminSidebar;