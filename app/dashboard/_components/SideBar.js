"use client"
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { LayoutDashboardIcon, Shield } from 'lucide-react'
import Image from 'next/image'
import React from 'react'
import UploadPdfDialog from './UploadPdfDialog'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { useUser } from '@clerk/nextjs'
import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'

const SideBar = () => {
    const {user} = useUser();
    const path = usePathname();

    const fileList = useQuery(api.fileStorage.GetUserFiles, { 
        userEmail : user?.primaryEmailAddress?.emailAddress 
    });

  return (
    <div className='shadow-md h-screen p-7'>
        <h1 className='fond-bold text-2xl ml-5'>
            NOTE-TAKER
        </h1>
        <div className='mt-10'>
            
            <UploadPdfDialog disabled={fileList?.length >= 10}>
                <Button 
                    className={`w-full ${
                        fileList?.length >= 10 ? "bg-gray-400 cursor-not-allowed" : ""
                    }`}
                    disabled={fileList?.length >= 10}
                >
                    + Upload PDF
                </Button>
            </UploadPdfDialog>
            <Link href={'/dashboard'}>
            <div className={`flex gap-2 items-center p-3 mt-5 hover:bg-slate-100 rounded-lg cursor-pointer ${path=='/dashboard' && 'bg-slate-200'}`}>
                <LayoutDashboardIcon />
                <h2>Workspace</h2>
            </div>
            </Link>
            <Link href={'/dashboard/upgrade'}>
            <div className={`flex gap-2 items-center p-3 mt-1 hover:bg-slate-100 rounded-lg cursor-pointer ${path=='/dashboard/upgrade' && 'bg-slate-200'}`}>
                <Shield />
                <h2>Upgrade</h2>
            </div>
            </Link>
            <div className='absolute bottom-24 w-[80%]'>
                <Progress value={(fileList?.length/10)*100} />
                <p className='text-sm mt-1'>{fileList?.length} out of 10 Pdf Uploaded</p>
                <p className='text-sm text-gray-400 mt-2'>Upgrade to Upload more Pdf</p>
            </div>
        </div>
    </div>
  )
}

export default SideBar