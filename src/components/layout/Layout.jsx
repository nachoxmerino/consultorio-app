import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'

export default function Layout() {
  return (
    <div className="flex min-h-screen bg-surface">
      <Sidebar />
      <main className="flex-1 min-w-0 overflow-x-hidden">
        <div className="px-7 lg:px-10 py-6 lg:py-8 max-w-[1500px] mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
