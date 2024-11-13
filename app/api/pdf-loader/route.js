
import { NextResponse } from "next/server"
import { WebPDFLoader } from "@langchain/community/document_loaders/web/pdf";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

const pdfUrl = "https://limitless-ibex-779.convex.cloud/api/storage/43f4e630-c043-4b4a-bb04-d529b1375904";
export async function GET(req){
    const response = await fetch(pdfUrl);
    const data = await response.blob();
    const loader = new WebPDFLoader(data);
    const docs = await loader.load();

    let pdfTextContent='';
    docs.forEach(doc=>{
        pdfTextContent+=doc.pageContent;
    });

    const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 100,
        chunkOverlap: 20,
    });
    const output = await splitter.createDocuments([pdfTextContent]);

    return NextResponse.json({result:output})
}