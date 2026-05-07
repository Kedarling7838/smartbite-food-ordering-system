import React, { useState, useEffect } from "react";
import AdminLayout from "../components/AdminLayout";
import { useParams, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'

const EditFood = () =>{
    const {id}=useParams();
    const adminUser = localStorage.getItem('adminUser');
    const navigate = useNavigate();

    const [categories,setCategories]=useState([])
    const [formData, setFormData]=useState({
    category:'',
    item_name:'',
    item_price:'',
    item_description:'',
    image:'',
    item_quantity:'',
    is_available:'',
     })

     useEffect(() => {
            if (!adminUser) {
                navigate('/admin-login');
                return;
            }
            fetch(`http://127.0.0.1:8000/api/edit-food/${id}/`)
            .then(res => res.json())
            .then(data =>setFormData(data))
            .catch(err=>console.error(err));

            fetch('http://127.0.0.1:8000/api/categories/')
            .then(res => res.json())
            .then(data =>setCategories(data))
            .catch(err=>console.error(err));
        }, [id]);

        const handelChange=(e)=>{
                const{name,value}=e.target;
                setFormData((prev)=>({
                    ...prev,
                    [name]:value
                }));
            }
            const handelFileChange=(e)=>{
                setFormData((prev)=>({
                    ...prev,
                    image:e.target.files[0]
                }));
            }
        
                const handelSubmit=async(e)=>{
                    e.preventDefault();
                const data=new FormData();
                 data.append("category", formData.category);
                 data.append("item_name", formData.item_name);
                 data.append("item_description", formData.item_description);
                 data.append("item_quantity", formData.item_quantity);
                 data.append("item_price",formData.item_price)
                 data.append("image", formData.image);
                 data.append("is_available", formData.is_available ? "true" : "false");
           
                    try {
                    const response = await fetch(`http://127.0.0.1:8000/api/edit-food/${id}/`,{
                        method:'PUT',
                        body:data,
                  });
                  const result=await response.json();
                    if (response.status ===200){         
                        toast.success(result.message);
                        setTimeout(()=>{
                            navigate('/manage-food')
                        },500);
                        
                   }
                   else{
                     toast.error(result.message);
                   }
                }
                catch(error){
                    console.error(error);
                    toast.error("Error connecting to server");
                }
               
            };
    return(
        <AdminLayout>
            <ToastContainer position="top-center" autoClose={2000}/>
            <div className="row">
               <div className="col-md-8">
                <div className="p-4 shadow-sm rounded">
                    <h4 className="mb-4">
                        <i className="fas fa-pen-square text-primary me-2"></i>Edit Food Item
                    </h4>
                <form onSubmit={handelSubmit} encType="multipart/form-data">

                        <div className="mb-3">
                        <label className="form-label">Food Category</label>
                        <select name="category" type="text" className="form-select" value={formData.category} onChange={handelChange}  required>
                         <option value="">Select Category</option>   
                            {categories.map((cat)=>(
                                <option key={cat.id} value={cat.id}>{cat.category_name}</option>
                            ))}
                        </select>
                        </div>

                        <div className="mb-3">
                        <label className="form-label">Food Item Name</label>
                        <input name="item_name" type="text" className="form-control" value={formData.item_name} onChange={handelChange} placeholder="Enter Food Item Name" required/>
                        </div>
    

                        <div className="mb-3">
                        <label className="form-label">Description</label>
                        <textarea name="item_description" type="text" className="form-control" value={formData.item_description} onChange={handelChange} placeholder="Enter Description" required/>
                        </div>

                        <div className="mb-3">
                        <label className="form-label">Quantity</label>
                        <input name="item_quantity" type="text" className="form-control" value={formData.item_quantity} onChange={handelChange} placeholder="e.g. pcs/Large" required/>
                        </div>

                         <div className="mb-3">
                        <label className="form-label">(&#8377;)Price</label>
                        <input name="item_price" type="number" step=".01" className="form-control" value={formData.item_price} onChange={handelChange} placeholder="e.g. pcs/Large" required/>
                        </div>

                        <div className="mb-3 form-check form-switch">
                        <input name="is_available" type="checkbox"  className="form-check-input"  
                            checked={formData.is_available}
                        onChange={(e)=>setFormData({...formData,is_available:e.target.checked})} />
                        <label className="form-check-label">
                            {formData.is_available ? "Available" : "Not Available"}
                        </label>
                        </div>

                         <div className="mb-3">
                        <label className="form-label">Image</label>
                         <div className="row">
                            <div className="col-md-6">
                                <input name="image" type="file" accept="image/*" className="form-control"  
                                onChange={handelFileChange} placeholder="e.g. pcs/Large" />
                            </div>
                            <div className="col-md-6">
                                {formData.image&&(
                                    <img src={`http://127.0.0.1:8000/${formData.image}`} 
                                    className="img-fluid" style={{maxHeight:"100px",padding:"4px", border:"2px,solid red",borderRadius:"8px"}}/>
                                )}
                            </div>

                         </div>
                        </div>
    
    
                        <button type="submit" className="btn btn-primary mt-2">
                                <i className="fas fa-plus"></i>  Update Food Item
                        </button>
                    </form>

                </div>

               </div>
               <div className="col-md-4 d-flex justify-content-center align-items-center">
                    <i className="fas fa-utensils" style={{fontSize:'180px',color:'#e5e5e5'}}></i>
               </div>
            </div>
        </AdminLayout>
    )
}
export default EditFood;