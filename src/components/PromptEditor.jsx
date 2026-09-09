import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect } from "react";
import Variable from "../../extensions/Variable";
import { templateToTiptapJSON } from "../tiptapUtils";

function PromptEditor({content, onContentChange}) {

    const editor = useEditor({
        extensions: [
            StarterKit,
            Variable
        ],

        editorProps: {
            attributes: {
                class: "min-h-[300px] outline-none"
            }
        },

        onUpdate: ({ editor }) => {
            const text = editor.getText({
                blockSeparator: "\n"
            });
            onContentChange(text);
        },

        content: templateToTiptapJSON(content)
    });

    useEffect(() => {
        if (!editor) return;

        const currentText = editor.getText({
            blockSeparator: "\n"
        });

        if (currentText === content) return;

        queueMicrotask(() => {
            if (editor.isDestroyed) return;

            editor.commands.setContent(
                templateToTiptapJSON(content),
                {
                    emitUpdate: false
                }
            );
        });

    }, [content, editor]);

    return (
        <div className="border border-zinc-600 rounded-xl p-4 min-h-[300px]">
            <EditorContent editor={editor} />
        </div>
    );
}

export default PromptEditor;