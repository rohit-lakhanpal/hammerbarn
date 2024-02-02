import Home from "../pages/Home";
import About from "../pages/About";
import Product from "../pages/Product";

export const routes = [
    {
        key: 'home-route',
        title: 'Home',
        path: '/',
        enabled: true,
        component: Home,
        exact: true         
    },
    {
        key: 'about-route',
        title: 'About',
        path: '/about',
        enabled: true,
        component: About
    },
    {
        key: 'product-route',
        title: 'Product',
        path: '/product/:uid',
        enabled: false,
        component: Product,        
    }
];
