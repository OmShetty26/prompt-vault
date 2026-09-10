export function templateToTiptapJSON(text) {
    const lines = (text || "").split("\n");

    const paragraphs = lines.map(line => {
        const regex = /\{\{\s*([^{}]+?)\s*\}\}/g;

        const content = [];
        let lastIndex = 0;

        for (const match of line.matchAll(regex)) {

            // Normal text before the variable
            if (match.index > lastIndex) {
                content.push({
                    type: "text",
                    text: line.slice(lastIndex, match.index)
                });
            }

            const variableName = match[1].trim();

            // Add the actual Tiptap variable node
            content.push({
                type: "variable",
                attrs: {
                    name: variableName
                }
            });

            lastIndex = match.index + match[0].length;
        }

        // Normal text after the final variable
        if (lastIndex < line.length) {
            content.push({
                type: "text",
                text: line.slice(lastIndex)
            });
        }

        const paragraph = {
            type: "paragraph"
        };

        if (content.length > 0) {
            paragraph.content = content;
        }

        return paragraph;
    });

    return {
        type: "doc",
        content: paragraphs
    };
}