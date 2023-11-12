'use client'

import { useEffect } from 'react'

import type { Notification } from '@/types/index'
import { useMembersStore } from '@/stores/membersStore'
import { socket } from '@/lib/socket'
import { useToast } from '@/components/ui/useToast'
import { ScrollArea } from '@/components/ui/ScrollArea'
import { Card, CardDescription, CardHeader, CardTitle } from './ui/Card'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { findFallback } from '@/lib/utils'

export default function MemberList() {
  const { toast } = useToast()

  const [members, setMembers] = useMembersStore(state => [
    state.members,
    state.setMembers,
  ])

  useEffect(() => {
    socket.on('update-members', members => {
      setMembers(members)
    })

    socket.on('send-notification', ({ title, message }: Notification) => {
      toast({
        title,
        description: message,
      })
    })

    return () => {
      socket.off('update-members')
      socket.off('send-notification')
    }
  }, [toast, setMembers])

  return (
    <div className='my-6 select-none'>
      <h2 className='pb-2.5 font-medium'>Members</h2>

      <ScrollArea className='h-96'>
        <ul className='flex flex-col gap-1 rounded-md'>
          {members.map(({ id, username }) => (
            <Card key={id} className='w-full flex gap-1 items-center justify-start px-3'>
              <Avatar>
                <AvatarImage src={`https://github.com/${username}.png`} />
                <AvatarFallback>{findFallback(username)}</AvatarFallback>
              </Avatar>
            <CardHeader className='py-3'>
              <CardDescription className='font-bold'>{username}</CardDescription>
              <CardDescription>{username}</CardDescription>
            </CardHeader>
            </Card>
          ))}
        </ul>
      </ScrollArea>
    </div>
  )
}
