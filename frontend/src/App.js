import {BrowserRouter,Routes,Route} from 'react-router-dom';
import Home from './pages/Home';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashbord';
import AddCategory from './pages/AddCategory';
import ManageCategory from './pages/ManageCategory';
import AddFood from './pages/AddFood';
import ManageFood from './pages/ManageFood';
import SearchPage from './pages/SearchPage';
import Register from './components/Register';
import Login from './components/Login';
import FoodDetail from './pages/FoodDetail';
import Cart from './pages/Cart';
import PaymentPage from './pages/PaymentPage';
import MyOrders from './pages/MyOrders';
import OrderDetails from './pages/OrderDetails';
import ProfilePage from './pages/ProfilePage';
import ChangePassword from './pages/ChangePassword';
import OrderNotConfirmed from './pages/OrdersNotConfirmed';
import AllOrders from './pages/AllOrders';
import OrderCancelled from './pages/OrderCancelled';
import FoodDelivered from './pages/FoodDelivered';
import FoodPickup from './pages/FoodPickup';
import FoodBeingPrepared from './pages/FoodBeingPrepared';
import OrderConfirmed from './pages/OrderConfirmed';
import OrderReport from './pages/OrderReport';
import ViewFoodOrder from './pages/ViewFoodOrder';
import SearchOrder from './pages/SearchOrder';
import EditCategory from './pages/EditCategory';
import EditFood from './pages/EditFood';
import ManageUser from './pages/ManageUser';
import { CartProvider } from './contest/CartContext';
import FoodList from './pages/FoodList';
import { WishlistProvider } from './contest/WishlistContext';
import Wishlist from './pages/Wishlist';
import TrackOrder from './pages/TrackOrder';
import ManageReviews from './pages/ManageReviews';
import InsightsHubDashboard from "./smartbite/pages/InsightsHubDashboard";
import Analytics from "./smartbite/pages/Analytics";
import ConflictDetector from "./smartbite/pages/ConflictDetector";
import Predictions from "./smartbite/pages/Predictions";
import ReviewIntelligence from "./smartbite/pages/ReviewIntelligence";

function App() {
  return (
    <WishlistProvider>
       <CartProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/admin/insightshub/reviews" element={<ReviewIntelligence />}/>
        <Route path="/admin/insightshub/conflicts" element={<ConflictDetector />}/>
        <Route path="/admin/insightshub/predictions" element={<Predictions />}/>
        <Route path="/admin/insightshub/analytics" element={<Analytics />}/>
        <Route path="/admin/insightshub" element={<InsightsHubDashboard />}/>
        <Route path="/" element={<Home/>}> </Route>
        <Route path="/admin-login" element={<AdminLogin/>}> </Route>
        <Route path="/admin-dashboard" element={<AdminDashboard/>}></Route>
        <Route path="/add-category" element={<AddCategory/>}></Route>
        <Route path="/manage-category" element={<ManageCategory/>}></Route>
        <Route path="/add-food" element={<AddFood/>}></Route>
        <Route path="/manage-food" element={<ManageFood/>}></Route>
        <Route path="/order-not-confirmed" element={<OrderNotConfirmed/>}></Route>
        <Route path="/order-confirmed" element={<OrderConfirmed/>}></Route>
        <Route path="/all-orders" element={<AllOrders/>}></Route>
        <Route path="/order-cancelled" element={<OrderCancelled/>}></Route>
        <Route path="/food-delivered" element={<FoodDelivered/>}></Route>
        <Route path="/food-pickup" element={<FoodPickup/>}></Route>
        <Route path="/food-being-prepared" element={<FoodBeingPrepared/>}></Route>
        <Route path="/search" element={<SearchPage/>}></Route>
        <Route path="/register" element={<Register/>}></Route>
        <Route path="/login" element={<Login/>}></Route>
        <Route path="/food/:id" element={<FoodDetail/>}></Route>
        <Route path="/cart" element={<Cart/>}></Route>
        <Route path="/payment" element={<PaymentPage/>}></Route>
        <Route path="/my-orders" element={<MyOrders/>}></Route>
        <Route path="/order-details/:order_number" element={<OrderDetails/>}></Route>
        <Route path="/profile" element={<ProfilePage/>}></Route>
        <Route path="/changepassword" element={<ChangePassword/>}></Route>
        <Route path="/order-report" element={<OrderReport/>}></Route>
        <Route path="/admin-view-order-detail/:orderNumber" element={<ViewFoodOrder/>}></Route>
        <Route path="/search-order" element={<SearchOrder/>}></Route>
        <Route path="/edit_category/:id" element={<EditCategory/>}></Route>
        <Route path="/edit_food/:id" element={<EditFood/>}></Route>
        <Route path="/manage-users" element={<ManageUser/>}></Route>
        <Route path="/food-menu" element={<FoodList/>}></Route>
        <Route path="/wishlist" element={<Wishlist/>}></Route>
        <Route path="/track" element={<TrackOrder/>}></Route>
        <Route path="/track-order/:paramOrderNumber" element={<TrackOrder/>}></Route>
        <Route path="/manage-reviews" element={<ManageReviews/>}></Route>
      </Routes>
      </BrowserRouter> 
      </CartProvider>
      </WishlistProvider>
   
  );
}

export default App;
