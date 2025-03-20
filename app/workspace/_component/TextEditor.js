import Placeholder from '@tiptap/extension-placeholder';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import BulletList from '@tiptap/extension-bullet-list';
import ListItem from '@tiptap/extension-list-item';
import Superscript from '@tiptap/extension-superscript';  // ✅ Correct import
import Subscript from '@tiptap/extension-subscript';      // ✅ Correct import
import React from 'react';
import EditorExtension from './EditorExtension';
import Underline from '@tiptap/extension-underline';
import { useQuery } from 'convex/react';

function Texteditor({fileId}) {
    const editor = useEditor({
        extensions: [
            StarterKit,
            BulletList,
            ListItem,
            Superscript.configure(),  // ✅ Ensure Superscript is added
            Subscript.configure(), 
            Underline.configure(),   
            Placeholder.configure({
                placeholder: 'Start Taking your notes here...'
            })
        ],
        editorProps: {   
            attributes: {
                class: 'focus:outline-none h-screen p-5'
            }
        }
    });

    const notes = useQuery(api.notes.GetNotes,{
        fileId:fileId
    })

    return (
        <div>
            <EditorExtension editor={editor}/>
            <div className='overflow-scroll h-[88vh]'>
                <EditorContent editor={editor} />
            </div>
        </div>
    );
}

export default Texteditor;
