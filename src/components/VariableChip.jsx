import { NodeViewWrapper } from "@tiptap/react";
import { useState } from "react";

function VariableChip({ node, editor, extension }) {
    const [editing, setEditing] = useState(false);

    const displayValue = node.attrs.value || node.attrs.name;

    const baseClasses =
        "inline-flex items-center rounded-full border px-2 py-0.5 text-sm cursor-pointer transition-all duration-150";

    const normalClasses =
        "border-indigo-500/50 bg-indigo-500/10 text-indigo-300 hover:border-indigo-400/80 hover:bg-indigo-500/15";

    const editingClasses =
        "border-indigo-400 bg-indigo-500/20 text-indigo-200 ring-2 ring-indigo-500/30 shadow-lg shadow-indigo-500/20";

    const startEditing = () => {
        setEditing(true);
        extension.options.onEditingChange(true);
    };

    const finishEditing = () => {
        setEditing(false);
        extension.options.onEditingChange(false);
    };

    const updateMatchingVariables = (newValue) => {
        const { state, view } = editor;
        const transaction = state.tr;

        state.doc.descendants((currentNode, position) => {
            if (
                currentNode.type.name === "variable" &&
                currentNode.attrs.name === node.attrs.name
            ) {
                transaction.setNodeMarkup(
                    position,
                    undefined,
                    {
                        ...currentNode.attrs,
                        value: newValue
                    }
                );
            }
        });

        if (transaction.docChanged) {
            view.dispatch(transaction);
        }
    };

    return (
        <NodeViewWrapper
            as="span"
            contentEditable={false}
            className={`${baseClasses} ${
                editing ? editingClasses : normalClasses
            }`}
            onClick={startEditing}
        >
            {editing ? (
                <input
                    type="text"
                    value={node.attrs.value || ""}
                    autoFocus
                    onChange={(event) => {
                        updateMatchingVariables(event.target.value);
                    }}
                    onBlur={finishEditing}
                    onKeyDown={(event) => {
                        if (event.key === "Enter") {
                            event.preventDefault();
                            event.stopPropagation();
                            finishEditing();
                        }
                    }}
                    className="bg-transparent border-none outline-none focus:outline-none focus:ring-0 text-inherit p-0 m-0"
                    style={{
                        width: `${Math.max(
                            (node.attrs.value || "").length,
                            6
                        )}ch`
                    }}
                />
            ) : (
                displayValue
            )}
        </NodeViewWrapper>
    );
}

export default VariableChip;