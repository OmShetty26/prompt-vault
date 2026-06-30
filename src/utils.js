export function parseVariables(text) {
    if (!text) {return [];};

    const regex = /\{\{(.*?)\}\}/g;

    const variables = [...text.matchAll(regex)].map(match => match[1]);

    const finalArr = [...new Set(variables)];

    return finalArr;
}