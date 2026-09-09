import { Node, nodeInputRule, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import VariableChip from "../src/components/VariableChip";

const variableInputRegex = /\{\{\s*[^{}]+?\s*\}\}$/;

const Variable = Node.create({
    name: "variable",

    group: "inline",
    inline: true,
    atom: true,

    addAttributes() {
        return {
            name: {
                default: "",

                parseHTML: element => {
                    return element.getAttribute("data-name");
                },

                renderHTML: attributes => {
                    return {
                        "data-name": attributes.name
                    };
                }
            },

            value: {
                default: "",
                rendered: false
            }
        };
    },

    addInputRules() {
        return [
            nodeInputRule({
                find: variableInputRegex,
                type: this.type,

                getAttributes: (match) => {
                    const variableName = match[0]
                        .slice(2, -2)
                        .trim();

                    return {
                        name: variableName
                    };
                }
            })
        ];
    },

    renderText({ node }) {
        return `{{${node.attrs.name}}}`;
    },

    parseHTML() {
        return [
            {
                tag: 'span[data-type="variable"]'
            }
        ];
    },

    renderHTML({ HTMLAttributes, node }) {
        return [
            "span",
            mergeAttributes(HTMLAttributes, {
                "data-type": "variable"
            }),
            `{{${node.attrs.name}}}`
        ];
    },

    addNodeView() {
        return ReactNodeViewRenderer(VariableChip);
    }
});

export default Variable;