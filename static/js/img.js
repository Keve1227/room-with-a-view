document.querySelectorAll("img[data-src]").forEach((img) => {
    img.setAttribute(
        "src",
        "/static/images/empty.png?" + img.getAttribute("data-meta") || "w=1&h=1"
    );
    img.removeAttribute("data-meta");

    img.addEventListener("load", function load() {
        img.removeEventListener("load", load);

        const url = new URL(img.getAttribute("data-src"), document.baseURI);
        const { width, height } = window.getComputedStyle(img);

        url.searchParams.set("w", img.getAttribute("data-width") || width);
        url.searchParams.set("h", img.getAttribute("data-height") || height);
        if (img.getAttribute("data-quality"))
            url.searchParams.set("q", img.getAttribute("data-quality"));

        img.removeAttribute("data-src");
        img.removeAttribute("data-width");
        img.removeAttribute("data-height");
        img.removeAttribute("data-quality");

        img.setAttribute("src", url.href);
    });
});
