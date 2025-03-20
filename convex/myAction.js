import { ConvexVectorStore } from "@langchain/community/vectorstores/convex";
import { action } from "./_generated/server.js";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { TaskType } from "@google/generative-ai";
import { v } from "convex/values";

export const ingest = action({
  args: {
    splitText:v.any(),
    fileId : v.string()
  },
  handler: async (ctx,args) => {
    await ConvexVectorStore.fromTexts(
      args.splitText,
      {fileId:args.fileId},
      new GoogleGenerativeAIEmbeddings({
        apiKey:'AIzaSyBEjVxgiC4gM-NOQpO-mHVyHqwGlaY_kD4',
        model: "text-embedding-004", 
        taskType: TaskType.RETRIEVAL_DOCUMENT,
        title: "Document title",
      }),
      { ctx }
      
    );
    return "completed..";
  },
});

export const search = action({
  args: {
    query: v.string(),
    fileId: v.string()
  },
  handler: async (ctx, args) => {
    console.log("🔍 Search Query:", args.query);
    console.log("📂 Searching in File ID:", args.fileId);
    const vectorStore = new ConvexVectorStore(
      new GoogleGenerativeAIEmbeddings({
        apiKey:'AIzaSyBEjVxgiC4gM-NOQpO-mHVyHqwGlaY_kD4',
        model: "text-embedding-004", 
        taskType: TaskType.RETRIEVAL_DOCUMENT,
        title: "Document title",
      }), { ctx });
    // console.log("the below content is vector data");
    // console.log("vector data :" , vectorStore);
    // const resultOne = await (await vectorStore.similaritySearch(args.query, 1))
    // .filter(q => q.metadata.fileId == args.fileId);

    const searchResults = await vectorStore.similaritySearch(args.query, 3);
    // console.log("data which is shown",searchResults);
    const resultOne = searchResults.filter(q => q.metadata.fileId == args.fileId);

    // console.log(JSON.stringify(resultOne)); 
    return JSON.stringify(resultOne);
  },
});

