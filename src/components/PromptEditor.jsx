import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect, useState } from "react";
import Variable from "../../extensions/Variable";
import { templateToTiptapJSON } from "../tiptapUtils";
import { Copy, Check } from "lucide-react";

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

function PromptEditor({content, onContentChange }) {
    const [isVariableEditing, setIsVariableEditing] = useState(false);

    const editor = useEditor({
        extensions: [
            StarterKit,
            Variable.configure({
                onEditingChange: setIsVariableEditing
            })
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

            setVariablesReady(
                areVariablesReady(editor)
            );
        },

        content: templateToTiptapJSON(content)
    });

    const [variablesReady, setVariablesReady] = useState(true);
    const [copied, setCopied] = useState(false);
    const canCopy = variablesReady && !isVariableEditing;

    const handleCompileAndCopy = async () => {
        if (!editor || !canCopy) return;

        const compiledText = compilePrompt(editor);

        try {
            await navigator.clipboard.writeText(compiledText);

            setCopied(true);

            setTimeout(() => {
                setCopied(false);
            }, 1500);

        } catch (error) {
            console.error("Failed to copy prompt:", error);
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

            setVariablesReady(
                areVariablesReady(editor)
            );
        });

    }, [content, editor]);

    const tooltipText = copied ? "Copied!" : (!(variablesReady) ? "Fill all variables first" : (isVariableEditing ? "Finish editing the variable" : "Compile & Copy"));

    return (
        <div className="relative border border-zinc-600 rounded-xl p-4 min-h-[300px]">
            <EditorContent editor={editor} />
            <div className="absolute top-3 right-3 group">
                <button
                    type="button"
                    disabled={!canCopy}
                    onClick={handleCompileAndCopy}
                    className={`
                        flex items-center justify-center
                        h-9 w-9 rounded-lg
                        transition-all duration-150

                        ${
                            canCopy
                                ? "text-zinc-300 hover:text-white hover:bg-zinc-800 cursor-pointer"
                                : "text-zinc-700 cursor-not-allowed"
                        }
                    `}
                >
                    {copied ? (
                        <Check size={18} />
                    ) : (
                        <Copy size={18} />
                    )}
                </button>
                <div
                    className="
                        absolute right-0 top-full mt-2
                        whitespace-nowrap
                        rounded-md border border-zinc-700
                        bg-zinc-900 px-2.5 py-1.5
                        text-xs text-zinc-300
                        shadow-lg
                        opacity-0 translate-y-1
                        pointer-events-none
                        transition-all duration-150
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