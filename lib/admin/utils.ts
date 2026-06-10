/**
 * Recursively cleans &nbsp; from strings within an object or array.
 * Useful for sanitizing Quill output before saving to the database.
 */
export const sanitizeContent = (data: any): any => {
    if (typeof data === 'string') {
        return data.replace(/&nbsp;/g, ' ');
    }
    
    if (Array.isArray(data)) {
        return data.map(item => sanitizeContent(item));
    }
    
    if (typeof data === 'object' && data !== null) {
        const newObj: any = {};
        for (const key in data) {
            newObj[key] = sanitizeContent(data[key]);
        }
        return newObj;
    }
    
    return data;
};
