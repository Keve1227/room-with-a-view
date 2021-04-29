const { Router } = require("express");
const path = require("path");

const router = new Router();

router.get("/browse", async (req, res, next) => {
    return res.renderMin(
        "default",
        {
            pageId: "browse-page",
            contentPath: path.join(__views, "pages", "browse.ejs"),
            locale: req.locale.pages.browse,
            lang: req.locale.__name,
        },
        (err, html) => {
            if (err) {
                console.error(err);
                return next();
            }

            return res.send(html);
        }
    );
});

module.exports = router;
