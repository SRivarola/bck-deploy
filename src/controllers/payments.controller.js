import createService from '../services/payments.service.js'

export default async function (req, res, next) {
  try {
    const { amount } = req.params;
    const intent = await createService(amount, 'usd')
    return res.sendSuccessCreate({
      message: "done",
      payload: intent,
    });
  } catch (error) {
    next(error);
  }
}
