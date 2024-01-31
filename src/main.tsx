import { createBrowserRouter, RouterProvider, createRoutesFromElements, Route } from 'react-router-dom';
import { ParallaxProvider } from 'react-scroll-parallax';

import ReactDOM from 'react-dom/client';

import React from 'react';
import './index.css';
import App from './App.tsx';
import Portfolio from './pages/Portfolio.tsx';
import About from './pages/About.tsx';

const router = createBrowserRouter(createRoutesFromElements(
  <Route element={<App />}>
    <Route index element={<Portfolio />} />
    <Route path="/about" element={<About />} />
  </Route>
));

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ParallaxProvider>
      <RouterProvider router={router} />
    </ParallaxProvider>
  </React.StrictMode>,
)
