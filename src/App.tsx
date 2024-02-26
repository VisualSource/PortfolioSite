import { useParallax } from "react-scroll-parallax";
import { NavLink, Outlet } from 'react-router-dom';
import { Menu } from 'lucide-react';
import clsx from 'clsx';

import { Sheet, SheetContent, SheetTrigger } from './components/ui/sheet';
import SocialList from './components/SocialList';
import { Button } from './components/ui/button';
import config from './config.json'

function App() {
  const parallaxbg = useParallax({
    translateY: [0, 100, "easeInQuad"],
    shouldAlwaysCompleteAnimation: true
  });

  const parallax_title = useParallax({
    opacity: [1, 0.0, "easeInOutQuart"],
    shouldAlwaysCompleteAnimation: true
  });

  return (
    <div>
      <Sheet>
        <SheetTrigger className="flex items-center gap-2 text-zinc-50 fixed top-2 right-2 md:hidden z-50" asChild>
          <Button>
            <Menu />
            <span className="uppercase">Menu</span>
          </Button>

        </SheetTrigger>
        <SheetContent className="flex flex-col">
          <ul className='flex flex-col divide-y font-black uppercase tracking-wider h-full pt-4'>
            <li className="p-2">
              <NavLink to="/" className={clsx("text-sm flex items-center text-center h-full transition-colors hover:text-zinc-400")}>
                Projects
              </NavLink>
            </li>
            <li className="p-2">
              <NavLink to="/about" className={clsx("text-sm flex items-center text-center h-full transition-colors hover:text-zinc-400")}>
                About me
              </NavLink>
            </li>
          </ul>
          <div className='flex justify-center pb-4'>
            <SocialList variant="outline" className="text-zinc-50" />
          </div>
        </SheetContent>
      </Sheet>

      <div className='animate-in slide-in-from-bottom-10 duration-1000 delay-75'>
        <div id="intro" className="min-h-lvh z-[4] text-zinc-50 overflow-hidden pt-32 pb-24 px-16 items-center flex flex-col justify-center text-center relative cursor-default" ref={parallax_title.ref as never}>
          <h1 className=" text-4xl md:text-7xl mb-8 font-black uppercase tracking-wider">Collin Blosser's Portfolio</h1>
          <p className="text-xl italic text-center">A showcase of my projects and abilities.</p>
        </div>
      </div>
      <header id="header" className="flex flex-col items-center pointer-events-none justify-end select-none relative pb-32 text-center h-80 -mt-80">
        <a className="translate-y-8 opacity-0 font-black uppercase py-4 px-7">Massively</a>
      </header>
      <div className="flex flex-col items-center z-[4] animate-in slide-in-from-bottom-24 duration-1000 delay-150">
        <div className='md:w-10/12'>
          <nav id="nav" className='hidden md:flex h-24 z-20 bg-zinc-500/15 -mt-24 mb-0 pr-8 relative'>
            <ul className='flex flex-grow flex-shrink font-black uppercase tracking-wider'>
              <li>
                <NavLink to="/" className={({ isActive }) => clsx("px-8 text-sm flex items-center text-center h-full transition-colors", { "bg-zinc-50 dark:hover:text-zinc-600": isActive, "text-zinc-50 hover:bg-zinc-700/90": !isActive })}>
                  Projects
                </NavLink>
              </li>
              <li>
                <NavLink to="/about" className={({ isActive }) => clsx("px-8 text-sm flex items-center text-center h-full transition-colors", { "bg-zinc-50 dark:hover:text-zinc-600": isActive, "text-zinc-50 hover:bg-zinc-700/90": !isActive })}>
                  About me
                </NavLink>
              </li>
            </ul>
            <SocialList variant="link" className="text-zinc-50" />
          </nav>
          <div className="bg-zinc-50 z-20 relative">
            <main className='flex flex-col min-h-screen'>
              <Outlet />
            </main>

            <footer id="footer" className='flex flex-col bg-zinc-200 divide-y divide-zinc-300 text-zinc-800/60'>
              <section className="p-16 pb-12 flex items-center">
                <h3 className="font-black leading-6 uppercase w-24">Phone</h3>
                <p>
                  <a href={`tel:${config.phone.tel}`}>{config.phone.display}</a>
                </p>
              </section>
              <section className="p-16 pb-12 flex items-center">
                <h3 className="font-black leading-6 uppercase tracking-wider w-24">Email</h3>
                <p>
                  <a href={`mailto:${config.email}`}>{config.email}</a>
                </p>
              </section>
              <section className="p-16 pb-12 flex items-center text-zinc-800/60">
                <h3 className="font-black leading-6 uppercase tracking-wider w-24">SOCIAL</h3>
                <SocialList variant="outline" />
              </section>
            </footer>
          </div>
        </div>
      </div>
      <div style={{
        backgroundColor: "#212931",
        backgroundSize: "auto, auto, 100% auto",
        backgroundPosition: "center, center, top center",
        backgroundRepeat: "repeat, no-repeat, no-repeat",
        backgroundAttachment: "scroll, scroll, scroll",
        backgroundImage: 'url("/images/bg/overlay.png"), linear-gradient(0deg, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.1)), url("/images/bg/bg.jpg")',
      }} className="z-[1] h-full w-full fixed left-0 top-0"></div>
      <div ref={parallaxbg.ref as never} className="z-[2] absolute left-0 top-0 w-full h-screen" style={{
        backgroundImage: 'url("/images/bg/overlay.png"), linear-gradient(0deg, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.1)), url("/images/bg/bg.jpg")',
        backgroundSize: "auto, auto, 100% auto",
        backgroundPosition: "center, center, top center",
        backgroundRepeat: "repeat, no-repeat, no-repeat",
        backgroundAttachment: "scroll, scroll, scroll"
      }}></div>
    </div>
  )
}

export default App;
