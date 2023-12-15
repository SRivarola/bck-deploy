export default function (req, res, next){
    try {
        let { first_name, last_name, mail, password } = req.body;
        if (first_name && last_name && mail && password){
            next()
        } else {
            return res.status(400).json({
                status: 400,
                method: req.method,
                path: req.url,
                message: 'name, mail and password are required.'
            })
        }
    } catch (error) {
        next(error)
    }
}