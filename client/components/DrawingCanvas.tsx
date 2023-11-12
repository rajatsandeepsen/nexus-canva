'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'

import type { DrawOptions } from '@/types/index'
import { useCanvasStore } from '@/stores/canvasStore'
import { useUserStore } from '@/stores/userStore'
import { socket } from '@/lib/socket'
import { draw, drawWithDataURL } from '@/lib/utils'
import useDraw, { type DrawProps } from '@/hooks/useDraw'
import { Skeleton } from '@/components/ui/Skeleton'
import UndoButton from '@/components/UndoButton'
import ClearButton from '@/components/ClearButton'
import { PanelRightOpen, MicOff, PhoneOffIcon } from 'lucide-react'
import { MessagesSquare } from 'lucide-react'

import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/Sheet'
import { Button } from '@/components/ui/Button'
import ThemeMenuButton from '@/components/ThemeMenuButton'
import RightPanel from '@/components/RightPanel'
import Sidebar from '@/components/Sidebar'
import Chat from '@/components/chat'

export default function DrawingCanvas() {
  const router = useRouter()
  const { roomId } = useParams()

  const containerRef = useRef<HTMLDivElement>(null)

  const [isCanvasLoading, setIsCanvasLoading] = useState(true)

  const strokeColor = useCanvasStore(state => state.strokeColor)
  const strokeWidth = useCanvasStore(state => state.strokeWidth)
  const dashGap = useCanvasStore(state => state.dashGap)
  const user = useUserStore(state => state.user)

  useEffect(() => {
    if (!user) {
      router.replace('/')
    }
  }, [router, user])

  const onDraw = useCallback(
    ({ ctx, currentPoint, prevPoint }: DrawProps) => {
      const drawOptions = {
        ctx,
        currentPoint,
        prevPoint,
        strokeColor,
        strokeWidth,
        dashGap,
      }
      draw(drawOptions)
      socket.emit('draw', { drawOptions, roomId })
    },
    [strokeColor, strokeWidth, dashGap, roomId]
  )

  const { canvasRef, onInteractStart, clear, undo } = useDraw(onDraw)

  useEffect(() => {
    const canvasElement = canvasRef.current
    const ctx = canvasElement?.getContext('2d')

    socket.emit('client-ready', roomId)

    socket.on('client-loaded', () => {
      setIsCanvasLoading(false)
    })

    socket.on('get-canvas-state', () => {
      const canvasState = canvasRef.current?.toDataURL()
      if (!canvasState) return

      socket.emit('send-canvas-state', { canvasState, roomId })
    })

    socket.on('canvas-state-from-server', (canvasState: string) => {
      if (!ctx || !canvasElement) return

      drawWithDataURL(canvasState, ctx, canvasElement)
      setIsCanvasLoading(false)
    })

    socket.on('update-canvas-state', (drawOptions: DrawOptions) => {
      if (!ctx) return
      draw({ ...drawOptions, ctx })
    })

    socket.on('undo-canvas', canvasState => {
      if (!ctx || !canvasElement) return

      drawWithDataURL(canvasState, ctx, canvasElement)
    })

    return () => {
      socket.off('get-canvas-state')
      socket.off('canvas-state-from-server')
      socket.off('update-canvas-state')
      socket.off('undo-canvas')
    }
  }, [canvasRef, roomId])

  useEffect(() => {
    const setCanvasDimensions = () => {
      if (!containerRef.current || !canvasRef.current) return

      const { width, height } = containerRef.current?.getBoundingClientRect()

      canvasRef.current.width = width - 50
      canvasRef.current.height = height - 50
    }

    setCanvasDimensions()
  }, [canvasRef])

  const handleInteractStart = () => {
    const canvasElement = canvasRef.current
    if (!canvasElement) return

    socket.emit('add-undo-point', {
      roomId,
      undoPoint: canvasElement.toDataURL(),
    })
    onInteractStart()
  }

  return (
    <>
      <div
        ref={containerRef}
        className='relative flex h-screen w-full items-center justify-center'
      >
        <div className='absolute bottom-10 left-10 flex items-center justify-center gap-3 md:gap-4 '>
          <Button
            variant='destructive'
            size='icon'
            className='flex h-9 '
            aria-label='Open right panel'
          >
            <MicOff size={20}/>
          </Button>
        </div>

        <div className='absolute right-10 top-10 flex items-center justify-center gap-3 md:gap-4 '>
          <UndoButton undo={undo} />
          <ThemeMenuButton />
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant='outline'
                size='icon'
                className='flex h-9 '
                aria-label='Open right panel'
              >
                <MessagesSquare size={20} />
              </Button>
            </SheetTrigger>

            <SheetContent className=''>
              <Chat />
            </SheetContent>
          </Sheet>
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant='outline'
                size='icon'
                className='flex h-9 '
                aria-label='Open right panel'
              >
                <PanelRightOpen size={20} />
              </Button>
            </SheetTrigger>

            <SheetContent className='w-[21rem]'>
              <Sidebar />
            </SheetContent>
          </Sheet>
        </div>

        {isCanvasLoading && <Skeleton className='absolute w-full' />}

        <canvas
          id='canvas'
          ref={canvasRef}
          onMouseDown={handleInteractStart}
          onTouchStart={handleInteractStart}
          width={0}
          height={0}
          className='touch-none rounded border bg-white'
        />
      </div>
    </>
  )
}
