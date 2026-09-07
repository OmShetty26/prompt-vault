export function parseVariables(text) {
    if (!text) {return [];};

    const regex = /\{\{\s*(.*?)\s*\}\}/g;

    const variables = [...text.matchAll(regex)].map(match => match[1]);

    const finalArr = [...new Set(variables)];

    return finalArr;
}


export function parsePromptSegments(text) {
    if (!text) return [];

    const regex = /\{\{\s*(.*?)\s*\}\}/g;

    const segments = [];
    let lastIndex = 0;

    for (const match of text.matchAll(regex)) {
        if (match.index > lastIndex) {
            segments.push({
                type: "text",
                value: text.slice(lastIndex, match.index)
            });
        }

        segments.push({
            type: "variable",
            value: match[1]
        });

        lastIndex = match.index + match[0].length;
    }

    if (lastIndex < text.length) {
        segments.push({
            type: "text",
            value: text.slice(lastIndex)
        });
    }

    return segments;
}