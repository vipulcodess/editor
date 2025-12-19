import { toPng } from 'html-to-image';

export const downloadImage = () => {
    const node = document.getElementById('export-container') as HTMLElement; 
    toPng(node)
        .then((dataUrl) => {
            const link = document.createElement('a');
            link.download = 'my-cool-code.png';
            link.href = dataUrl;
            link.click();
        })
        .catch((err) => console.log(err));
};