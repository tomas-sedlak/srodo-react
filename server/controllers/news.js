import News from "../models/News.js";

export const getNews = async (req, res) => {
    try {
        const category = req.query.category;
        const news = await News.find({ category: category })
            .sort({ createdAt: -1 })

        res.status(200).json(news);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
}