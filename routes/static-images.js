const { Router } = require("express");
const path = require("path");
const sharp = require("sharp");

const router = new Router();

router.get("/static/images/*", async (req, res, next) => {
    const { 0: fileName } = req.params;
    const filePath = path.join(__static, "images", fileName);

    // Check that the path provided does not try to access files outside of ./static/images
    if (path.relative(path.join(__static, "images"), filePath).includes("..")) {
        return next();
    }

    const width = roundAndClip(parseInt(req.query["w"]), 0, 2048) || null;
    const height = roundAndClip(parseInt(req.query["h"]), 0, 2048) || null;
    const quality = roundAndClip(parseInt(req.query["q"]), 0, 100) || 80;

    try {
        const data = await sharp(filePath)
            .resize(width, height)
            .jpeg({ mozjpeg: true, quality })
            .toBuffer();

        return res.type("image/jpeg").send(data);
    } catch (err) {
        return next();
    }
});

module.exports = router;

function roundAndClip(x, min, max) {
    return Math.max(min, Math.min(max, Math.round(x)));
}
