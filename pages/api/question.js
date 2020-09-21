export default (req, res) => {
    console.log(req.body);
    res.status(205).send("");
}