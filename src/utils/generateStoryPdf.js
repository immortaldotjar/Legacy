import { jsPDF } from "jspdf";


const COLORS = {
    ink: "#0c0b09",
    inkLine: "#2a251c",
    paper: "#efe7d8",
    paperDim: "#a89f8d",
    rec: "#c23b2a",
    brass: "#b4923d",
};

const PAGE = { width: 595.28, height: 841.89 };
const MARGIN = 56;
const CONTENT_WIDTH = PAGE.width - MARGIN * 2;

function hexToRgb(hex) {
    const n = parseInt(hex.slice(1), 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function fillPageBackground(doc) {
    const [r, g, b] = hexToRgb(COLORS.ink);
    doc.setFillColor(r, g, b);
    doc.rect(0, 0, PAGE.width, PAGE.height, "F");
}

function setColor(doc, hex) {
    const [r, g, b] = hexToRgb(hex);
    doc.setTextColor(r, g, b);
}

function drawEyebrow(doc, text, x, y, align = "left") {
    doc.setFont("courier", "normal");
    doc.setFontSize(9);
    setColor(doc, COLORS.brass);
    doc.text(text.toUpperCase(), x, y, { align, charSpace: 1.2 });
}

function drawFooter(doc, label, pageNum) {
    setColor(doc, COLORS.paperDim);
    doc.setFont("courier", "normal");
    doc.setFontSize(8);
    doc.text(label.toUpperCase(), MARGIN, PAGE.height - 30, { charSpace: 1 });
    doc.text(String(pageNum).padStart(2, "0"), PAGE.width - MARGIN, PAGE.height - 30, {
        align: "right",
    });
}

function newPage(doc, footerLabel, pageNum) {
    doc.addPage();
    fillPageBackground(doc);
    if (footerLabel) drawFooter(doc, footerLabel, pageNum);
}


async function loadImageAsDataUrl(url) {
    const res = await fetch(url, { mode: "cors" });
    if (!res.ok) throw new Error("image fetch failed");
    const blob = await res.blob();

    const dataUrl = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });

    const { width, height } = await new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve({ width: img.width, height: img.height });
        img.onerror = reject;
        img.src = dataUrl;
    });

    const format = /png/i.test(blob.type) ? "PNG" : "JPEG";
    return { dataUrl, format, width, height };
}


function drawFramedImage(doc, imageData, x, y, maxWidth, maxHeight) {
    const ratio = Math.min(maxWidth / imageData.width, maxHeight / imageData.height);
    const w = imageData.width * ratio;
    const h = imageData.height * ratio;
    const drawX = x + (maxWidth - w) / 2;

    const [br, bg, bb] = hexToRgb(COLORS.brass);
    doc.setDrawColor(br, bg, bb);
    doc.setLineWidth(0.75);
    doc.rect(drawX - 4, y - 4, w + 8, h + 8);

    doc.addImage(imageData.dataUrl, imageData.format, drawX, y, w, h, undefined, "MEDIUM");
    return h + 8;
}

function drawPlaceholderBox(doc, label, x, y, maxWidth, height) {
    const [ir, ig, ib] = hexToRgb(COLORS.inkLine);
    doc.setFillColor(ir, ig, ib);
    doc.rect(x, y, maxWidth, height, "F");
    const [br, bg, bb] = hexToRgb(COLORS.brass);
    doc.setDrawColor(br, bg, bb);
    doc.setLineWidth(0.75);
    doc.rect(x, y, maxWidth, height);
    setColor(doc, COLORS.paperDim);
    doc.setFont("courier", "normal");
    doc.setFontSize(9);
    doc.text(label.toUpperCase(), x + maxWidth / 2, y + height / 2, {
        align: "center",
        charSpace: 1.2,
    });
    return height;
}

/**
 * Generates a paginated, print-quality PDF of the whole story (cover,
 * one or more pages per chapter with its image + body text, and an
 * ending page) and triggers a browser download. Runs entirely client-side.
 *
 * @param {object} story - the saved story object (title, tagline,
 *   openingQuote, source, chapters[], images[], ending)
 * @param {(status: string) => void} [onProgress] - optional callback fired
 *   with a short human-readable status as generation moves through steps
 */
export async function generateStoryPdf(story, onProgress = () => {}) {
    const doc = new jsPDF({ unit: "pt", format: "a4", compress: true });
    const footerLabel = story.title || "Legacy";
    let pageNum = 1;

    onProgress("Gathering frames…");
    const images = await Promise.all(
        (story.chapters || []).map(async (_, i) => {
            const url = story.images?.[i]?.image;
            if (!url) return null;
            try {
                return await loadImageAsDataUrl(url);
            } catch {
                return null;
            }
        })
    );

    // ---------- Cover page ----------
    onProgress("Laying out cover…");
    fillPageBackground(doc);
    drawEyebrow(doc, "", MARGIN, MARGIN);
    drawEyebrow(
        doc,
        story.source === "fallback" ? "Archive Draft" : "",
        PAGE.width - MARGIN,
        MARGIN,
        "right"
    );

    setColor(doc, COLORS.paper);
    doc.setFont("times", "bold");
    doc.setFontSize(34);
    const titleLines = doc.splitTextToSize(story.title || "Untitled Story", CONTENT_WIDTH - 40);
    let cy = PAGE.height / 2 - 120 - (titleLines.length - 1) * 20;
    titleLines.forEach((line) => {
        doc.text(line, PAGE.width / 2, cy, { align: "center" });
        cy += 42;
    });

    if (story.tagline) {
        setColor(doc, COLORS.paperDim);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(13);
        cy += 14;
        const taglineLines = doc.splitTextToSize(story.tagline, CONTENT_WIDTH - 100);
        taglineLines.forEach((line) => {
            doc.text(line, PAGE.width / 2, cy, { align: "center" });
            cy += 18;
        });
    }

    if (story.openingQuote) {
        setColor(doc, COLORS.paper);
        doc.setFont("times", "italic");
        doc.setFontSize(16);
        cy += 40;
        const quoteLines = doc.splitTextToSize(`"${story.openingQuote}"`, CONTENT_WIDTH - 120);
        quoteLines.forEach((line) => {
            doc.text(line, PAGE.width / 2, cy, { align: "center" });
            cy += 24;
        });
    }
    drawFooter(doc, footerLabel, pageNum);

    const chapters = story.chapters || [];
    for (let i = 0; i < chapters.length; i++) {
        const chapter = chapters[i];
        onProgress(`Printing scene ${i + 1} of ${chapters.length}…`);

        pageNum += 1;
        newPage(doc, footerLabel, pageNum);
        let y = MARGIN;

        const sceneLabel = `Scene ${String(i + 1)}${
            chapter.mood ? `  ·  ${chapter.mood}` : ""
        }`;
        drawEyebrow(doc, sceneLabel, MARGIN, y);
        y += 26;

        setColor(doc, COLORS.paper);
        doc.setFont("times", "bold");
        doc.setFontSize(22);
        const headingLines = doc.splitTextToSize(chapter.title || "", CONTENT_WIDTH);
        headingLines.forEach((line) => {
            doc.text(line, MARGIN, y);
            y += 26;
        });
        y += 10;

        const imgData = images[i];
        const maxImgHeight = 200;
        if (imgData) {
            y += drawFramedImage(doc, imgData, MARGIN, y, CONTENT_WIDTH, maxImgHeight);
        } else {
            y += drawPlaceholderBox(doc, "Frame not developed", MARGIN, y, CONTENT_WIDTH, 90);
        }
        y += 28;

        setColor(doc, COLORS.paper);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(11.5);
        const lineHeight = 16;
        const bottomLimit = PAGE.height - MARGIN - 20;

        const paragraphs = (chapter.content || "").split(/\n+/);
        for (const paragraph of paragraphs) {
            const lines = doc.splitTextToSize(paragraph, CONTENT_WIDTH);
            for (const line of lines) {
                if (y > bottomLimit) {
                    pageNum += 1;
                    newPage(doc, footerLabel, pageNum);
                    drawEyebrow(doc, `${sceneLabel} (cont'd)`, MARGIN, MARGIN);
                    y = MARGIN + 30;
                    setColor(doc, COLORS.paper);
                    doc.setFont("helvetica", "normal");
                    doc.setFontSize(11.5);
                }
                doc.text(line, MARGIN, y);
                y += lineHeight;
            }
            y += 8;
        }
    }

    onProgress("Closing the reel…");
    pageNum += 1;
    newPage(doc, footerLabel, pageNum);
    drawEyebrow(doc, "End of Reel", PAGE.width / 2, PAGE.height / 2 - 90, "center");

    setColor(doc, COLORS.paper);
    doc.setFont("times", "bold");
    doc.setFontSize(30);
    doc.text("The End", PAGE.width / 2, PAGE.height / 2 - 50, { align: "center" });

    if (story.ending) {
        setColor(doc, COLORS.paper);
        doc.setFont("times", "italic");
        doc.setFontSize(15);
        let ey = PAGE.height / 2 + 10;
        const endingLines = doc.splitTextToSize(story.ending, CONTENT_WIDTH - 100);
        endingLines.forEach((line) => {
            doc.text(line, PAGE.width / 2, ey, { align: "center" });
            ey += 22;
        });
    }

    onProgress("Saving PDF…");
    const safeName = (story.title || "legacy-story")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
    doc.save(`${safeName || "legacy-story"}.pdf`);
}
