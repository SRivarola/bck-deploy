export default function (req, res, next){
    try {
        if (req.session.role === 1){
            next()
        } else {
            return res.sendForbidden();
        }
    } catch (error) {
        next(error)
    }
}