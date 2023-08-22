import { Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';

function App() {
  return (
    <>
      <Navbar />
      <main className="flex flex-col flex-grow h-full dark:bg-zinc-950 dark:text-zinc-50">
        <Outlet />
      </main>
    </>
  )
}

export default App;
