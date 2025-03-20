import React from 'react'
import Image from 'next/image'
import { UserButton } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

function WorkspaceHeader({fileName}) {
  return (
    <div className='p-4 flex justify-between shadow-md'>
        <Link href={'/dashboard'}>
        <h1 className='fond-bold text-2xl ml-5'>
            NOTE-TAKER
        </h1>
        </Link>
        <h2 className='font-bold'>{fileName}</h2>
        <div className='flex gap-2 items-center'>
          <Button>Save</Button>
        <UserButton />
        </div>
    </div>
  )
}

export default WorkspaceHeader