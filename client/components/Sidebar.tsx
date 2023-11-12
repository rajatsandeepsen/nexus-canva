import ColorPicker from '@/components/ColorPicker'
import StrokeWidthSlider from '@/components/StrokeWidthSlider'
import DashGapSlider from '@/components/DashGapSlider'
import MemberList from '@/components/MemberList'
import LeaveButton from '@/components/LeaveButton'
    import SaveButton from '@/components/SaveButton'

export default function Sidebar() {
  return (
      <div className='relative flex h-full flex-col gap-6'>
        <div className="flex gap-3">
          <LeaveButton />
          <SaveButton />
        </div>
        <ColorPicker />

        <StrokeWidthSlider />

        <DashGapSlider />

        <MemberList />

      </div>
  )
}
