import { Router } from "express";

const sessionsRouter = Router()

sessionsRouter.get('/get', (req, res, next) => {
    try {
        return res.status(200).json(req.session)
    } catch (error) {
        next(error)
    }
})

sessionsRouter.get('/counter', (req, res) => {
    if(!req.session.counter){
        req.session.counter = 1
    } else {
        req.session.counter++
    }
    return res.status(200).json({
        message: `were signed in ${req.session.counter} users`
    })
})

sessionsRouter.post('/login', (req, res, next) => {
    try {
        req.session.data = req.body
        return res.status(200).json({
            session: req.session,
            message: req.session.data.mail + ' has been signed in'
        })
    } catch (error) {
        next(error)
    }
})

sessionsRouter.post('/signout', (req, res, next) => {
    try {
        req.session.destroy()
        return res.status(200).json({
            success: true,
            message: 'signed out',
            dataSession: req.session
        })
    } catch (error) {
        next(error)
    }
})

export default sessionsRouter;