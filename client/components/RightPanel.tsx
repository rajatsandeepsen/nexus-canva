import ColorPicker from '@/components/ColorPicker'
import StrokeWidthSlider from '@/components/StrokeWidthSlider'
import DashGapSlider from '@/components/DashGapSlider'
import MemberList from '@/components/MemberList'
import LeaveButton from '@/components/LeaveButton'
import Chat from '@/components/chat'

export default function RightPanel() {
  return (
    <div className='flex h-full justify-center py-8 '>
      <div className='relative flex h-full w-[17rem] flex-col gap-6'>
        <Chat />
      </div>
    </div>
  )
}
