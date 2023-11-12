import Header from '@/components/Header'
import Sidebar from '@/components/Sidebar'

export default function RoomLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />

      <div className=''>
        <main className='h-screen'>{children}</main>


      </div>
    </>
  )
}
