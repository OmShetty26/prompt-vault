import { NodeViewWrapper } from "@tiptap/react";
import { useState } from "react";

function VariableChip({ node, editor }) {
    const [editing, setEditing] = useState(false);

    const displayValue = node.attrs.value || node.attrs.name;

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
            className="inline-flex items-center rounded-full border border-indigo-500 bg-indigo-500/15 px-2 py-0.5 text-indigo-300"
            onClick={() => setEditing(true)}
        >
            {editing ? (
                <input
                    type="text"
                    value={node.attrs.value || ""}
                    autoFocus
                    onChange={(event) => {updateMatchingVariables(event.target.value)}}
                    onBlur={() => {
                        setEditing(false);
                    }}
                    onKeyDown={(event) => {
                        if (event.key === "Enter") {
                            event.preventDefault();
                            event.stopPropagation();
                            setEditing(false);
                        }
                    }}
                    className="bg-transparent border-none outline-none focus:outline-none focus:ring-0"
                    style={{
                        width: `${Math.max((node.attrs.value || "").length, 6)}ch`
                    }}
                />
            ) : (
                displayValue
            )}
        </NodeViewWrapper>
    );
}

export default VariableChip;