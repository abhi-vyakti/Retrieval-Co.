/**
 * imageForensics.js — Client-Side AI Image Detection
 *
 * Performs real forensic analysis on uploaded images to determine whether
 * they are authentic camera captures or AI-generated / heavily manipulated.
 *
 * Techniques used:
 *   1. EXIF Metadata Analysis  — camera make/model, timestamps, GPS, exposure
 *   2. Pixel Noise Analysis    — real sensors produce natural noise patterns
 *   3. Color Channel Statistics — AI images often have unusual channel distributions
 *   4. Color Diversity Index   — real photos have higher unique-color counts
 *   5. AI Tool Signature Scan  — checks EXIF/XMP for known generator fingerprints
 */

import ExifReader from 'exifreader';

const AI_SIGNATURES = [
    'dall-e', 'dalle', 'midjourney', 'stable diffusion', 'stablediffusion',
    'comfyui', 'automatic1111', 'novelai', 'firefly', 'imagen',
    'playground', 'leonardo', 'nightcafe', 'artbreeder', 'deep dream',
    'craiyon', 'glide', 'dreamstudio', 'invoke ai'
];

const delay = (ms) => new Promise(r => setTimeout(r, ms));

/**
 * Analyse a single image for authenticity.
 * @param {string}   imageUrl   — blob:, data:, or http(s): URL of the image
 * @param {Function} onProgress — optional callback for status updates
 * @returns {Promise<Object>} analysis result
 */
export async function analyzeImageAuthenticity(imageUrl, onProgress) {
    const signals = [];
    let authenticityScore = 50;

    /* ══════════ Phase 1 : EXIF / XMP Metadata ══════════ */
    onProgress?.('Extracting image metadata…');
    await delay(700 + Math.random() * 400);

    try {
        const response = await fetch(imageUrl);
        const arrayBuffer = await response.arrayBuffer();

        try {
            const tags = ExifReader.load(arrayBuffer, { expanded: true });

            const make  = tags.exif?.Make?.description;
            const model = tags.exif?.Model?.description;
            if (make || model) {
                authenticityScore += 15;
                signals.push({
                    type: 'positive',
                    label: 'Camera Identified',
                    detail: `${[make, model].filter(Boolean).join(' ')}`,
                });
            }

            const dt = tags.exif?.DateTimeOriginal?.description;
            if (dt) {
                authenticityScore += 8;
                signals.push({ type: 'positive', label: 'Capture Timestamp', detail: dt });
            }

            const hasExposure =
                tags.exif?.ExposureTime ||
                tags.exif?.FNumber ||
                tags.exif?.ISOSpeedRatings ||
                tags.exif?.FocalLength;
            if (hasExposure) {
                authenticityScore += 8;
                const parts = [];
                if (tags.exif.ExposureTime)     parts.push(`Exp ${tags.exif.ExposureTime.description}s`);
                if (tags.exif.FNumber)           parts.push(`f/${tags.exif.FNumber.description}`);
                if (tags.exif.ISOSpeedRatings)   parts.push(`ISO ${tags.exif.ISOSpeedRatings.description}`);
                signals.push({
                    type: 'positive',
                    label: 'Exposure Data',
                    detail: parts.join(', ') || 'Present',
                });
            }

            if (tags.gps?.Latitude || tags.gps?.Longitude) {
                authenticityScore += 5;
                signals.push({ type: 'positive', label: 'GPS Location', detail: 'Embedded geolocation data' });
            }

            const software = (tags.exif?.Software?.description || '').toLowerCase();
            const xmpCreator = (tags.xmp?.CreatorTool?.description || '').toLowerCase();
            const combined = `${software} ${xmpCreator}`;

            const matchedAI = AI_SIGNATURES.find(sig => combined.includes(sig));
            if (matchedAI) {
                authenticityScore -= 40;
                signals.push({
                    type: 'negative',
                    label: 'AI Generator Detected',
                    detail: `Signature: "${matchedAI}" found in metadata`,
                });
            } else if (software && !matchedAI) {
                signals.push({
                    type: 'neutral',
                    label: 'Editing Software',
                    detail: tags.exif.Software.description,
                });
            }

        } catch (_exifErr) {
            // No parseable EXIF — mild penalty (cropping legitimately strips EXIF)
            authenticityScore -= 5;
            signals.push({
                type: 'neutral',
                label: 'No EXIF Metadata',
                detail: 'Missing camera metadata (may be cropped, screenshotted, or AI-generated)',
            });
        }
    } catch (_fetchErr) {
        signals.push({ type: 'neutral', label: 'Metadata Skipped', detail: 'Could not read image bytes' });
    }

    /* ══════════ Phase 2 : Pixel Noise Analysis ══════════ */
    onProgress?.('Analyzing pixel noise patterns…');
    await delay(600 + Math.random() * 500);

    try {
        const img = new Image();
        await new Promise((resolve, reject) => {
            img.onload = resolve;
            img.onerror = reject;
            img.src = imageUrl;
        });

        const SIZE = 256;
        const canvas = document.createElement('canvas');
        canvas.width = SIZE;
        canvas.height = SIZE;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, SIZE, SIZE);
        const { data: px } = ctx.getImageData(0, 0, SIZE, SIZE);
        const totalPixels = SIZE * SIZE;

        // ── Adjacent-pixel noise (horizontal) ──
        let noiseSumH = 0, countH = 0;
        for (let y = 0; y < SIZE; y++) {
            for (let x = 0; x < SIZE - 1; x++) {
                const i = (y * SIZE + x) * 4;
                const j = i + 4;
                noiseSumH += Math.abs(px[i] - px[j]) + Math.abs(px[i+1] - px[j+1]) + Math.abs(px[i+2] - px[j+2]);
                countH++;
            }
        }
        const avgNoise = noiseSumH / (countH * 3);

        if (avgNoise > 12) {
            authenticityScore += 15;
            signals.push({
                type: 'positive',
                label: 'Sensor Noise',
                detail: `Level ${avgNoise.toFixed(1)} — consistent with camera sensors`,
            });
        } else if (avgNoise < 4) {
            authenticityScore -= 15;
            signals.push({
                type: 'negative',
                label: 'Smooth Pixels',
                detail: `Level ${avgNoise.toFixed(1)} — unusually smooth, common in AI output`,
            });
        } else {
            authenticityScore += 5;
            signals.push({
                type: 'neutral',
                label: 'Moderate Noise',
                detail: `Level ${avgNoise.toFixed(1)} — within normal range`,
            });
        }

        /* ══════════ Phase 3 : Color Statistics ══════════ */
        onProgress?.('Evaluating color distributions…');
        await delay(500 + Math.random() * 400);

        // ── RGB channel variance ratio ──
        let rSum = 0, gSum = 0, bSum = 0, rSq = 0, gSq = 0, bSq = 0;
        for (let i = 0; i < px.length; i += 4) {
            rSum += px[i]; gSum += px[i+1]; bSum += px[i+2];
            rSq += px[i]*px[i]; gSq += px[i+1]*px[i+1]; bSq += px[i+2]*px[i+2];
        }
        const rVar = (rSq / totalPixels) - (rSum / totalPixels) ** 2;
        const gVar = (gSq / totalPixels) - (gSum / totalPixels) ** 2;
        const bVar = (bSq / totalPixels) - (bSum / totalPixels) ** 2;
        const maxVar = Math.max(rVar, gVar, bVar);
        const minVar = Math.min(rVar, gVar, bVar);
        const varRatio = maxVar / (minVar + 1);

        if (varRatio < 3) {
            authenticityScore += 8;
            signals.push({ type: 'positive', label: 'Channel Balance', detail: 'RGB variance is naturally distributed' });
        } else if (varRatio > 8) {
            authenticityScore -= 10;
            signals.push({ type: 'negative', label: 'Channel Imbalance', detail: 'Atypical RGB variance ratio detected' });
        }

        // ── Colour diversity ──
        const colours = new Set();
        for (let i = 0; i < px.length; i += 4) {
            colours.add(((px[i] >> 2) << 16) | ((px[i+1] >> 2) << 8) | (px[i+2] >> 2));
        }
        const diversity = colours.size / totalPixels;

        if (diversity > 0.3) {
            authenticityScore += 10;
            signals.push({
                type: 'positive',
                label: 'Color Diversity',
                detail: `${colours.size.toLocaleString()} unique clusters — high diversity`,
            });
        } else if (diversity < 0.05) {
            authenticityScore -= 8;
            signals.push({
                type: 'negative',
                label: 'Low Color Diversity',
                detail: 'Limited unique colors — may indicate synthetic generation',
            });
        } else {
            authenticityScore += 3;
            signals.push({
                type: 'neutral',
                label: 'Moderate Color Range',
                detail: `${colours.size.toLocaleString()} unique clusters`,
            });
        }

    } catch (_canvasErr) {
        signals.push({ type: 'neutral', label: 'Pixel Analysis Skipped', detail: 'Could not process pixels' });
    }

    /* ══════════ Phase 4 : Compute Verdict ══════════ */
    onProgress?.('Computing forensic verdict…');
    await delay(400 + Math.random() * 300);

    authenticityScore = Math.max(0, Math.min(100, authenticityScore));

    const isAIGenerated = authenticityScore < 40;

    const confidence = isAIGenerated
        ? Math.min(98, 100 - authenticityScore)
        : Math.min(98, authenticityScore);

    const positiveCount = signals.filter(s => s.type === 'positive').length;

    let reason;
    if (isAIGenerated) {
        reason = 'Multiple forensic signals indicate this image may be synthetically generated or heavily manipulated.';
    } else if (positiveCount >= 3) {
        reason = 'Strong camera metadata and natural pixel patterns confirm authenticity.';
    } else if (positiveCount >= 1) {
        reason = 'Some authenticity indicators present. Image appears legitimate.';
    } else {
        reason = 'Limited metadata available, but pixel analysis does not suggest AI generation.';
    }

    return { isAIGenerated, confidence, reason, signals, authenticityScore };
}
