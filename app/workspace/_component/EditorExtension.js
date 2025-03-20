import { chatSession } from '@/config/AIModel';
import { api } from '@/convex/_generated/api';
import { useUser } from '@clerk/nextjs';
import { useAction, useMutation, } from 'convex/react';
import { Bold, Italic, Strikethrough, Subscript, Superscript, Underline, MenuIcon, Sparkles } from 'lucide-react';
import { useParams } from 'next/navigation';
import React, { use } from 'react';
import { toast } from "sonner"

function EditorExtension({ editor}) {
    const {fileId} = useParams();
    const SearchAI = useAction(api.myAction.search);
    const saveNotes = useMutation(api.notes.AddNotes);
    const user = useUser();
    const onAiClick = async() =>{
        toast("AI is getting your answer.");

        const selectText = editor.state.doc.textBetween(
            editor.state.selection.from,
            editor.state.selection.to,
            ' '
        )
        console.log(selectText);
        const result = await SearchAI({
            query:selectText,
            fileId:fileId
        })

        const UnFormattedAns = JSON.parse(result);
        let ans = '';
        UnFormattedAns&&UnFormattedAns.forEach(item=>{
            ans = ans+item.pageContent;
        })

        const PROMPT  = "For question : " + selectText + " and with the given content as answer, Please give appropriate answer in HTML format in a concise manner and also don't give much of gap between lines and paragraphs. The answer content is : " + ans;

        const AIModelResult = await chatSession.sendMessage(PROMPT); 
        console.log(AIModelResult.response.text());
        const FinalAns = AIModelResult.response.text().replace('```','').replace('html','');

        const AllText = editor.getHTML();
        editor.commands.setContent(AllText + '<p> <strong>Answer :</strong>' + FinalAns + '</p>');
        

        // console.log(editor.getHTML());
        saveNotes({
          notes:editor.getHTML(),
          fileId:fileId,
          createdBy: user?.primaryEmailAddress?.emailAddress
        })

    }
  return (
    <div className="p-5">
      <div className="control-group">
        <div className="button-group flex gap-9">
          <button
            onClick={() => editor?.chain().focus().toggleBold().run()}
            className={editor?.isActive('bold') ? 'text-blue-500' : ''}
          >
            <Bold />
          </button>
          <button
            onClick={() => editor?.chain().focus().toggleItalic().run()}
            className={editor?.isActive('italic') ? 'text-blue-500' : ''}
          >
            <Italic />
          </button>
          <button
            onClick={() => editor?.chain().focus().toggleStrike().run()}
            className={editor?.isActive('strike') ? 'text-blue-500' : ''}
          >
            <Strikethrough />
          </button>
          <button
            onClick={() => editor?.chain().focus().toggleUnderline().run()}
            className={editor?.isActive('underline') ? 'text-blue-500' : ''}
          >
            <Underline />
          </button>
          <button
            onClick={() => editor?.chain().focus().toggleSubscript().run()}  
            className={editor?.isActive('subscript') ? 'text-blue-500' : ''}
          >
            <Subscript />
          </button>
          <button
            onClick={() => editor?.chain().focus().toggleSuperscript().run()}  
            className={editor?.isActive('superscript') ? 'text-blue-500' : ''}
          >
            <Superscript />
          </button>
          <button
            onClick={() => editor?.chain().focus().toggleBulletList().run()}
            className={editor?.isActive('bulletList') ? 'text-blue-500' : ''}
          >
            <MenuIcon />
          </button>
          <button
            onClick={() => onAiClick()}
            className={'hover:text-blue-500'}
          >
            <Sparkles />
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditorExtension;
