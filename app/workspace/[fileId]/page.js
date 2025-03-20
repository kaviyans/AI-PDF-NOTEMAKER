"use client";
import { useParams } from "next/navigation";
import React, { useEffect } from "react";
import WorkspaceHeader from "../_component/WorkspaceHeader";
import PdfViewer from "../_component/PdfViewer";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Texteditor from "../_component/Texteditor";

function Workspace() {
  const { fileId } = useParams();
  const fileInfo = useQuery(api.fileStorage.GetFileRecord, {
    fileId: fileId,
  });

  useEffect(() => {
    console.log(fileInfo);
  }, [fileInfo]);

  return (
    <div className="h-screen overflow-hidden flex flex-col hide-scrollbar">
      <WorkspaceHeader fileName = {fileInfo?.fileName}/>

      {/* 
          3) flex-1 makes this fill remaining space
          4) Use grid to split into two columns
      */}
      <div className="flex-1 grid grid-cols-2 gap-5">
        {/* 
            5) Make each column scrollable vertically,
               no horizontal scroll
        */}
        <div className="h-full overflow-y-auto overflow-x-hidden">
          <Texteditor fileId = {fileId}/>
        </div>
        <div className="h-full overflow-y-auto overflow-x-hidden bg-gray-100">
          <PdfViewer fileUrl={fileInfo?.fileUrl} />
        </div>
      </div>
    </div>
  );
}

export default Workspace;
