module.exports = notFound = (req, res) => res.status(404).json({
    message: 'Route does not exist !, please check the url or read the documentation'
});