'use client'

import { EventHandler, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'

import { socket } from '@/lib/socket'
import { joinRoomSchema } from '@/lib/validations/joinRoom'
import { Button } from '@/components/ui/Button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/Dialog'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/Form'
import { Input } from '@/components/ui/Input'
import { useUserStore } from '@/stores/userStore'

type JoinRoomForm = z.infer<typeof joinRoomSchema>

export default function JoinRoomButtoon() {
  const [isLoading, setIsLoading] = useState(false)
  const [roomId, setRoomId] = useState("")
  const {user, setUser} = useUserStore()


  function onSubmit(e:FormTarget) {
    e.preventDefault()
    setIsLoading(true)
    socket.emit('join-room', { roomId, username:user?.user_name || "" })
  }

  useEffect(() => {
    socket.on('room-not-found', () => {
      setIsLoading(false)
    })
  }, [])

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant='outline' className='w-full'>
          Join a Room
        </Button>
      </DialogTrigger>

      <DialogContent className='w-[90vw] max-w-[400px]'>
        <DialogHeader className='pb-2'>
          <DialogTitle>Join a room now!</DialogTitle>
        </DialogHeader>
          <form onSubmit={onSubmit} className='flex flex-col gap-4'>
                    <Input placeholder='Username' readOnly value={user?.user_name || ""} />
                    <Input placeholder='Room ID' onChange={(e) => setRoomId(e.target.value)} value={roomId} />
            <Button type='submit' className='mt-2'>
              {isLoading ? <Loader2 className='h-4 w-4 animate-spin' /> : 'Join'}
            </Button>
          </form>
      </DialogContent>
    </Dialog>
  )
}
