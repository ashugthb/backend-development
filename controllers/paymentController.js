import Payment from "../models/paymentModel.js";

//add a new payment
export const addController = async (req, res) => {
  const payment = new Payment({
    userId: req.body.userId,
    orderId: req.body.orderId,
    paymentStatus: req.body.paymentStatus,
    gatewayResponse: req.body.gatewayResponse,
    paymentMode: req.body.paymentMode,
  });

  await payment
    .save()
    .then((data) => {
      res.send({
        message: "Payment added successfully!!",
        payment: data,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while doing payment",
      });
    });
};

// to get all payments
export const getAllController = async (req, res) => {
  try {
    const payment = await Payment.find();
    res.status(200).json(payment);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

//to get single payment by id
export const getOneController = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);
    res.status(200).json(payment);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

//update the payment
export const updateController = async (req, res) => {
  if (!req.body) {
    res.status(400).send({
      message: "Data to update can not be empty!",
    });
  }

  const id = req.params.id;

  await Payment.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Payment not found.`,
        });
      } else {
        res.send({ message: "Payment updated successfully." });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message,
      });
    });
};

//delete the payment
export const deleteController = async (req, res) => {
  const payment = await Payment.findById(req.params.id);

  await payment
    .deleteOne()
    .then((data) => {
      res.send({
        message: "Payment deleted successfully!!",
        payment: data,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while deleting payment",
      });
    });
};
