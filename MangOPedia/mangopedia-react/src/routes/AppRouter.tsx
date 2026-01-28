import { Route, Routes } from 'react-router-dom';
import Home from '../pages/Home';
import { ROUTES } from '../utility/constants';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import OrderManagement from '../pages/order/OrderManagement';
import MenuItemManagement from '../pages/menu/MenuItemManagement';
import Cart from '../pages/cart/Cart';
import Checkout from '../pages/cart/Checkout';
import OrderConfirmation from '../pages/order/OrderConfirmation';
import MenuItemDetails from '../pages/menu/MenuItemDetails';

const AppRoutes = () => (
  <Routes>
    <Route path={ROUTES.HOME} element={<Home />} />
    <Route path={ROUTES.LOGIN} element={<Login />} />
    <Route path={ROUTES.REGISTER} element={<Register />} />
    <Route path={ROUTES.MENU_DETAIL} element={<MenuItemDetails/>}/>
    <Route path={ROUTES.ORDER_MANAGEMENT} element={<OrderManagement />} />
    <Route path={ROUTES.MENU_MANAGEMENT} element={<MenuItemManagement />} />
    <Route path={ROUTES.CART} element={<Cart />} />
    <Route path={ROUTES.CHECKOUT} element={<Checkout />} />
    <Route path={ROUTES.ORDER_CONFIRMATION} element={<OrderConfirmation />} />
  </Routes>
);

export default AppRoutes;
