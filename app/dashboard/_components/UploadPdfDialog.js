"use client"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { api } from "@/convex/_generated/api"
import { useUser } from "@clerk/nextjs"
import axios from "axios"
import { useAction, useMutation } from "convex/react"
import { Loader2Icon } from "lucide-react"
import { split } from "postcss/lib/list"

import React, { useState } from 'react'
import uuid4 from "uuid4"
  
  const UploadPdfDialog = ({disabled,children}) => {

    const generateUploadUrl = useMutation(api.fileStorage.generateUploadUrl); 
    const addFileEntry = useMutation(api.fileStorage.AddFileEntryToDb);
    const getFileUrl = useMutation(api.fileStorage.getFileUrl);
    const embeddDocument = useAction(api.myAction.ingest);
    const {user} = useUser(); 
    const [file,setFile] = useState();
    const [fileName,setFileName] = useState();
    const [loading,setLoading] = useState(false);
    const [open,setOpen] = useState(false);

    const OnFileSelect = (event)=>{
        setFile(event.target.files[0]);
    }

    const OnUpload = async()=>{
        setLoading(true);

        const postUrl = await generateUploadUrl();
         
        const result = await fetch(postUrl, {
            method: "POST",
            headers: { "Content-Type": file?.type },
            body: file,
        });
        const { storageId } = await result.json();
        console.log(storageId);
        const fileId = uuid4();
        const fileUrl = await getFileUrl({storageId:storageId})

        const resp = await addFileEntry({
            fileId:fileId,
            storageId:storageId,
            fileName:fileName??'Untitled File',
            fileUrl:fileUrl, 
            createdBy:user?.primaryEmailAddress?.emailAddress
        })

        // console.log(resp);


        const ApiResp = await axios.get('/api/pdf-loader?pdfUrl=' + fileUrl);
        console.log(ApiResp.data.result);
        await embeddDocument({
          splitText:ApiResp.data.result,
          fileId:fileId
        })
        // console.log(embeddedresult);
        setLoading(false);
        setOpen(false);

    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
                <div className={`${disabled ? "opacity-50 pointer-events-none" : ""}`}>
                    <Button 
                        onClick={() => setOpen(true)} 
                        className="w-full" 
                        disabled={disabled}
                    >
                        + Upload PDF
                    </Button>
                </div>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Pdf file</DialogTitle>
            <DialogDescription asChild>
              <div className="">
                <h2 className="mt-5 ">Select file the Upload</h2>
                <div className="gap-2 p-3 rounded-md border">
                    <input type="file" accept="application/pdf"
                        onChange={(event)=>OnFileSelect(event)}
                    />
                </div>
                <div className="mt-2">
                    <label>File Name *</label>
                    <Input placeholder="File Name" onChange={(e)=>setFileName(e.target.value)}/>
                </div>
                
              </div>
            </DialogDescription>    
          </DialogHeader>
          <DialogFooter className="sm:justify-end">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
          <Button onClick={OnUpload} disabled={loading}>
            {loading?
                <Loader2Icon className="animate-spin"/>:"Upload"
            }
          </Button>
        </DialogFooter>
        </DialogContent>
      </Dialog>
      
    )
  }
  
  export default UploadPdfDialog