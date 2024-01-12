const cheerio = require("cheerio");
const News = require("./models/news");

const categories = [
    {
        id: "CAAqJggKIiBDQkFTRWdvSUwyMHZNRGRqTVhZU0FuTnJHZ0pUU3lnQVAB",
        name: "technology",
    },
    {
        id: "CAAqJggKIiBDQkFTRWdvSUwyMHZNRFp0Y1RjU0FuTnJHZ0pUU3lnQVAB",
        name: "science",
    }
];

const scrape = async () => {
    console.log("Scraping...");

    await News.deleteMany();

    categories.map(async category => {
        const url = "https://news.google.com/topics/" + category.id + "?hl=sk&gl=SK";

        const response = await fetch(url);
        const body = await response.text();
        const $ = cheerio.load(body);
    
        $(".XBspb").map((i, article) => {
            const author = $(article).find(".vr1PYe").text();
            const title = $(article).find(".JtKRv").text();
            const url = "https://news.google.com" + $(article).find(".JtKRv").attr("href");
            const image = "https://news.google.com" + $(article).find(".Quavad").attr("src");
            const timestamp = $(article).find(".hvbAAd").attr("datetime");
    
            const timeAgo = Date.now() - Date.parse(timestamp);
            if (timeAgo < 1000 * 60 * 60 * 24) {
                News.create({
                    category: category.name,
                    author: author,
                    title: title,
                    url: url,
                    image: image,
                    index: i,
                    timestamp: timestamp,
                });
            }
        });
    });

    console.log("Done!");
}

module.exports = scrape;