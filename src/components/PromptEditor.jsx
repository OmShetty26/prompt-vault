import { useEditor, EditorContent, useEditorState } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useCallback, useEffect, useState } from "react";
import Variable from "../../extensions/Variable";
import { templateToTiptapJSON } from "../tiptapUtils";
import {
    Copy,
    Check,
    Save,
    Undo2,
    Redo2,
    AlertCircle,
} from "lucide-react";
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


function PromptEditor({ content, onContentChange, onSave }) {
    const [variablesReady, setVariablesReady] = useState(true);
    const [isVariableEditing, setIsVariableEditing] = useState(false);
    const [copied, setCopied] = useState(false);
    const [hasContent, setHasContent] = useState(
        Boolean(content?.trim())
    );
    const [saveStatus, setSaveStatus] = useState("idle");


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

    const historyState = useEditorState({
        editor,

        selector: ({ editor }) => {
            if (!editor) {
                return {
                    canUndo: false,
                    canRedo: false
                };
            }

            return {
                canUndo: editor.can().undo(),
                canRedo: editor.can().redo()
            };
        }
    });

    const canUndo =
        historyState?.canUndo ?? false;

    const canRedo =
        historyState?.canRedo ?? false;

    const handleUndo = () => {
        if (!editor || !canUndo) return;

        editor
            .chain()
            .focus()
            .undo()
            .run();
    };


    const handleRedo = () => {
        if (!editor || !canRedo) return;

        editor
            .chain()
            .focus()
            .redo()
            .run();
    };


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

    const handleSaveClick = useCallback(async () => {
        if (saveStatus === "saving") return;

        setSaveStatus("saving");

        const success = await onSave();

        if (success) {
            setSaveStatus("saved");

            setTimeout(() => {
                setSaveStatus("idle");
            }, 1500);
        } else {
            setSaveStatus("error");

            setTimeout(() => {
                setSaveStatus("idle");
            }, 2000);
        }
    }, [onSave, saveStatus]);

    useEffect(() => {
        const handleKeyDown = (event) => {
            const saveShortcut =
                (event.ctrlKey || event.metaKey) &&
                event.key.toLowerCase() === "s";

            if (!saveShortcut) return;

            event.preventDefault();

            handleSaveClick();
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener(
                "keydown",
                handleKeyDown
            );
        };
    }, [handleSaveClick]);


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
        <div className="flex-1 flex flex-col min-h-0">

            {/* Editor actions */}
            <div className="flex justify-end mb-4">
                <div
                    className="
                        flex
                        items-center
                        gap-1

                        rounded-xl

                        border
                        border-white/[0.08]

                        bg-zinc-900/80

                        p-1

                        shadow-lg
                        shadow-black/20

                        backdrop-blur-md
                    "
                >
                    {/* Undo */}
                    <button
                        type="button"
                        onClick={handleUndo}
                        disabled={!canUndo}
                        aria-label="Undo"
                        className={`
                            flex
                            h-8
                            w-8
                            items-center
                            justify-center

                            rounded-lg

                            transition-all
                            duration-150

                            ${
                                canUndo
                                    ? `
                                        text-zinc-400
                                        hover:bg-white/[0.07]
                                        hover:text-zinc-100
                                        active:scale-[0.95]
                                    `
                                    : `
                                        text-zinc-700
                                        cursor-not-allowed
                                    `
                            }
                        `}
                    >
                        <Undo2 size={16} />
                    </button>


                    {/* Redo */}
                    <button
                        type="button"
                        onClick={handleRedo}
                        disabled={!canRedo}
                        aria-label="Redo"
                        className={`
                            flex
                            h-8
                            w-8
                            items-center
                            justify-center

                            rounded-lg

                            transition-all
                            duration-150

                            ${
                                canRedo
                                    ? `
                                        text-zinc-400
                                        hover:bg-white/[0.07]
                                        hover:text-zinc-100
                                        active:scale-[0.95]
                                    `
                                    : `
                                        text-zinc-700
                                        cursor-not-allowed
                                    `
                            }
                        `}
                    >
                        <Redo2 size={16} />
                    </button>


                    {/* Separator */}
                    <div className="mx-1 h-4 w-px bg-white/[0.08]" />


                    {/* Compile & Copy */}
                    <div className="relative group">
                        <button
                            type="button"
                            disabled={!canCopy}
                            onClick={handleCompileAndCopy}
                            aria-label={tooltipText}
                            className={`
                                flex
                                h-8
                                w-8
                                items-center
                                justify-center

                                rounded-lg

                                transition-all
                                duration-150

                                ${
                                    canCopy
                                        ? `
                                            text-zinc-400
                                            hover:bg-white/[0.07]
                                            hover:text-zinc-100
                                            active:scale-[0.95]
                                        `
                                        : `
                                            text-zinc-700
                                            cursor-not-allowed
                                        `
                                }
                            `}
                        >
                            {copied ? (
                                <Check size={16} />
                            ) : (
                                <Copy size={16} />
                            )}
                        </button>

                        {/* Copy tooltip */}
                        <div
                            className="
                                absolute
                                right-0
                                top-[calc(100%+0.5rem)]

                                z-30

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


                    {/* Separator */}
                    <div className="mx-1 h-4 w-px bg-white/[0.08]" />


                    {/* Save */}
                    <button
                        type="button"
                        onClick={handleSaveClick}
                        disabled={saveStatus === "saving"}
                        aria-label="Save prompt"
                        className={`
                            flex
                            h-8
                            items-center
                            gap-1.5

                            rounded-lg
                            px-2.5

                            text-sm
                            font-medium

                            transition-all
                            duration-150

                            ${
                                saveStatus === "saved"
                                    ? `
                                        text-emerald-400
                                        bg-emerald-500/[0.06]
                                    `
                                    : saveStatus === "error"
                                        ? `
                                            text-red-400
                                            bg-red-500/[0.06]
                                        `
                                        : `
                                            text-zinc-300
                                            hover:bg-white/[0.07]
                                            hover:text-white
                                        `
                            }

                            ${
                                saveStatus === "saving"
                                    ? "cursor-wait"
                                    : "active:scale-[0.97]"
                            }
                        `}
                    >
                        {saveStatus === "saved" ? (
                            <>
                                <Check size={15} />
                                <span>Saved</span>
                            </>
                        ) : saveStatus === "error" ? (
                            <>
                                <AlertCircle size={15} />
                                <span>Save failed</span>
                            </>
                        ) : (
                            <>
                                <Save size={15} />
                                <span>Save</span>
                            </>
                        )}
                    </button>
                </div>
            </div>


            {/* Actual editable document */}
            <EditorContent
                editor={editor}
                className="flex-1"
            />

        </div>
    );
}

export default PromptEditor;