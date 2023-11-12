'use client'

import { nanoid } from 'nanoid'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/Card'
import { Separator } from '@/components/ui/Separator'
import ThemeMenuButton from '@/components/ThemeMenuButton'
import CreateRoomForm from '@/components/CreateRoomForm'
import JoinRoomButtoon from '@/components/JoinRoomButton'
import AuthenticationPage from '@/components/Login'
import { supabase } from '@/lib/supabase'
import { Input } from '@/components/ui/Input'
import { useEffect, useState } from 'react'
import { Label } from '@/components/ui/Label'
import { Session } from '@supabase/supabase-js'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useUserStore } from '@/stores/userStore'

export const findFallback = (name: string):string => {
  let x = name.split(' ')
  let y = ''
  x.forEach((i)=> y += i[0])
  return y
}

export default function Home() {
  const [session, setSession] = useState<Session | null>(null)
  const {user, setUser} = useUserStore()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setSession(session)
        setUser(session?.user.user_metadata)
      }
    })

  }, [])

  if (!user || !session) return <AuthenticationPage />
  const roomId = nanoid()

  const { name, email, user_name, id, avatar_url} = session.user.user_metadata

  return (
    <div className='flex h-screen flex-col items-center justify-center'>
      <ThemeMenuButton className='fixed right-[5vw] top-5 flex-1 md:right-5' />

      <Card className='w-[90vw] max-w-[400px]'>
        <CardHeader>
          <Avatar>
            <AvatarImage src={avatar_url} />
            <AvatarFallback>{findFallback(name)}</AvatarFallback>
          </Avatar>
          <CardTitle>Welcome {name}</CardTitle>
          <CardDescription>{user_name}</CardDescription>
        </CardHeader>

        <CardContent className='flex flex-col space-y-4'>
          <Label className='text-foreground'>Username</Label>
          <Input readOnly value={email} disabled />


          <CreateRoomForm roomId={roomId} userId={user_name} />
          <div className='flex items-center space-x-2 '>
            <Separator />
            <span className='text-xs text-muted-foreground'>OR</span>
            <Separator />
          </div>

          <JoinRoomButtoon />
        </CardContent>
      </Card>

      <div></div>
    </div>
  )
}
