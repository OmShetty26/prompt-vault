import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect, useState } from "react";

import Variable from "../../extensions/Variable";
import { templateToTiptapJSON } from "../tiptapUtils";

import { Copy, Check } from "lucide-react";
import { Placeholder } from "@tiptap/extensions";


function areVariablesReady(editor) {
    let hasVariables = false;
    let allFilled = true;

    editor.state.doc.descendants((node) => {
        if (node.type.name === "variable") {
            hasVariables = true;

            const value = node.attrs.value || "";

            if (!value.trim()) {
                allFilled = false;
            }
        }
    });

    return !hasVariables || allFilled;
}


function compilePrompt(editor) {
    return editor.getText({
        blockSeparator: "\n",

        textSerializers: {
            variable: ({ node }) => {
                return node.attrs.value || "";
            }
        }
    });
}


function PromptEditor({ content, onContentChange }) {
    const [variablesReady, setVariablesReady] = useState(true);
    const [isVariableEditing, setIsVariableEditing] = useState(false);
    const [copied, setCopied] = useState(false);
    const [hasContent, setHasContent] = useState(
        Boolean(content?.trim())
    );


    const editor = useEditor({
        extensions: [
            StarterKit,

            Placeholder.configure({
                placeholder: "Start writing your prompt…"
            }),

            Variable.configure({
                onEditingChange: setIsVariableEditing
            })
        ],

        editorProps: {
            attributes: {
                class: "min-h-[calc(100dvh-10rem)] outline-none text-base leading-7 text-zinc-200 caret-indigo-400"
            }
        },

        content: templateToTiptapJSON(content),

        onUpdate: ({ editor }) => {
            const text = editor.getText({
                blockSeparator: "\n"
            });

            onContentChange(text);

            setHasContent(
                Boolean(text.trim())
            );

            setVariablesReady(
                areVariablesReady(editor)
            );
        },
    });


    const canCopy =
    hasContent &&
    variablesReady &&
    !isVariableEditing;


    const handleCompileAndCopy = async () => {
        if (!editor || !canCopy) return;

        const compiledText = compilePrompt(editor);

        try {
            await navigator.clipboard.writeText(
                compiledText
            );

            setCopied(true);

            setTimeout(() => {
                setCopied(false);
            }, 1500);

        } catch (error) {
            console.error(
                "Failed to copy prompt:",
                error
            );
        }
    };


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

            setHasContent(
                Boolean(content?.trim())
            );

            setVariablesReady(
                areVariablesReady(editor)
            );
        });

    }, [content, editor]);


    const tooltipText = copied
        ? "Copied!"
        : !hasContent
            ? "Write a prompt first"
            : !variablesReady
                ? "Fill all variables first"
                : isVariableEditing
                    ? "Finish editing the variable"
                    : "Compile & Copy";


    return (
        <div className="relative min-h-full">

            <EditorContent editor={editor} />


            {/* Compile & Copy */}
            <div
                className="
                    absolute
                    top-0
                    right-0

                    z-10

                    group
                "
            >
                <button
                    type="button"
                    disabled={!canCopy}
                    onClick={handleCompileAndCopy}
                    aria-label={tooltipText}
                    className={`
                        flex
                        items-center
                        justify-center

                        h-9
                        w-9

                        rounded-lg

                        border
                        border-transparent

                        transition-all
                        duration-150

                        ${
                            canCopy
                                ? `
                                    text-zinc-400

                                    hover:text-zinc-100
                                    hover:bg-white/[0.06]
                                    hover:border-white/[0.06]

                                    active:scale-[0.95]

                                    cursor-pointer
                                `
                                : `
                                    text-zinc-700
                                    cursor-not-allowed
                                `
                        }
                    `}
                >
                    {copied ? (
                        <Check size={17} />
                    ) : (
                        <Copy size={17} />
                    )}
                </button>


                {/* Custom tooltip */}
                <div
                    className="
                        absolute
                        right-0
                        top-[calc(100%+0.5rem)]

                        z-20

                        whitespace-nowrap

                        rounded-lg

                        border
                        border-white/[0.08]

                        bg-zinc-900/95

                        px-2.5
                        py-1.5

                        text-xs
                        font-medium
                        text-zinc-300

                        shadow-xl
                        shadow-black/30

                        opacity-0
                        translate-y-1

                        pointer-events-none

                        transition-all
                        duration-150
                        ease-out

                        group-hover:opacity-100
                        group-hover:translate-y-0
                    "
                >
                    {tooltipText}
                </div>
            </div>

        </div>
    );
}

export default PromptEditor;