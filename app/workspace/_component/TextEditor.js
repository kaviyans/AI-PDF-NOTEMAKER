import Placeholder from "@tiptap/extension-placeholder";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import BulletList from "@tiptap/extension-bullet-list";
import ListItem from "@tiptap/extension-list-item";
import Superscript from "@tiptap/extension-superscript";
import Subscript from "@tiptap/extension-subscript";
import React, { useEffect } from "react";
import EditorExtension from "./EditorExtension";
import Underline from "@tiptap/extension-underline";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

function Texteditor({ fileId }) {
    const editor = useEditor({
        extensions: [
            StarterKit,
            BulletList,
            ListItem,
            Superscript.configure(),
            Subscript.configure(),
            Underline.configure(),
            Placeholder.configure({
                placeholder: "Start Taking your notes here...",
            }),
        ],
        editorProps: {
            attributes: {
                class: "focus:outline-none h-screen p-5",
            },
        },
    });

    const notes = useQuery(api.notes.GetNotes, { fileId });

    console.log("Fetched notes:", notes);

    useEffect(() => {
        if (!editor || !notes) return; // Ensure editor is initialized
        editor.commands.setContent(notes);
        console.log("Content set:", notes);
    }, [notes, editor]);

    if (!editor) {
        return <div>Loading editor...</div>; // Avoid rendering when editor is null
    }

    return (
        <div>
            <EditorExtension editor={editor} />
            <div className="overflow-scroll h-[88vh]">
                <EditorContent editor={editor} />
            </div>
        </div>
    );
}

export default Texteditor;
