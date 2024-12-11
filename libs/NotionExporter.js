import path from 'path';
import { promises as fs } from 'fs';



const absPath = process.cwd();

const changeName = (oldname) => {
    let newName = oldname;
    const reg = /\s[0-9a-f]{32}/gi;
    if (reg.test(oldname)) {
        newName = oldname.replace(reg, '');
    }
    return newName;
}
const renameOneDir = async (entryName) => {

    let newName = changeName(entryName);
    try {
        await fs.rename(entryName, newName);
    } catch (err) {
        console.log(`rename error: ${err}`);
    }
    return newName;
}


async function renameAll(dir) {
    try {
        const newDir = await renameOneDir(dir);
        // console.log(`rename folder: ${dir} to ${newDir}`)
        const entries = await fs.readdir(newDir, { withFileTypes: true });
        for (const entry of entries) {
            if (entry.isFile()) {
                const oldPath = path.resolve(entry.parentPath, entry.name);
                const newPath = await renameOneDir(oldPath);
                // console.log(`rename file: ${oldPath} to ${newPath}`);
                //change the image and link href, relate to current folder
                if (newPath.endsWith('.md')) {
                    fixmdPath(newPath)
                }
            }
            if (entry.isDirectory()) {
                await renameAll(path.resolve(newDir, entry.name));
            }
        }
    }
    catch (err) {
        console.log(err)
    }
}

async function fixmdPath(mdPath) {
    // console.log(`md path ${mdPath}`)
    let content = await fs.readFile(mdPath, 'utf-8');
    const pattern = /\[(?:[^\[\]()]|\\\[|\\\]|\\(|\\)|\n)*\]\s*\(\s*(?:[^\(\)\s]|\s(?![\s\)])|\\\(|\\\)|\\ |\n)*\s*\)/g;
    const newContent = content.replace(pattern, (match) => {
        const urlMatch = match.match(/\(([^)]+)\)/);
        if (!urlMatch) return match;
        const originalUrl = urlMatch[1];

        const decodeURL = decodeURI(originalUrl);
        const newUrl = changeName(decodeURL)
        // console.log(`md path: ${mdPath}`)
        let absToRootUrl = newUrl;
        if (!newUrl.startsWith('http')) {
            absToRootUrl = path.relative(absPath, path.resolve(path.dirname(mdPath), newUrl));
        }

        // console.log(`new url: ${absToRootUrl}`)
        const altText = match.match(/\[([\s\S]*)\]/);
        return `[${altText[1]}](${encodeURI(absToRootUrl)})`;
    })
    fs.writeFile(mdPath, newContent, { 'encoding': 'utf-8', flag: '' });
}


// renameAll(absPath)
// const testFile = path.resolve(absPath, 'PMP', '绩效域.md');
// fixmdPath(testFile);
export default renameAll;