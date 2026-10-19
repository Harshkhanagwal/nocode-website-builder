const llm = (req, res) => {
    const { prompt, websiteName } = req.body || {};

    if (!prompt || !websiteName) {
        return res.status(400).json({
            success: false,
            message: "prompt and websiteName are required"
        });
    }

    return res.status(200).json({
        success: true,
        message: `Generating your website + ${websiteName}`
    });
};

module.exports = { llm };