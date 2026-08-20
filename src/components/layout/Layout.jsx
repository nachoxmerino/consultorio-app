import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'

export default function Layout() {
  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      <Sidebar />
      <main className="flex-1 min-w-0 overflow-x-hidden">
        <div className="px-8 lg:px-12 py-8 lg:py-10 max-w-[1440px] mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
