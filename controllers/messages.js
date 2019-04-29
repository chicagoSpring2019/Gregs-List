const express = require('express');
const router = express.Router();
const Message = require('../models/message')
const nodemailer = require('nodemailer')

router.post('/', async (req, res, next) => {
  try{
    let transporter = await nodemailer.createTransport({
      service: req.body.service,
      auth: {
        user: req.body.fromEmail,
        pass: req.body.password
      }
    });
    let info = await transporter.sendMail({
      from: req.body.fromEmail,
      to: req.body.toEmail,
      subject: req.body.subject,
      text: req.body.text
    });
    res.redirect('/')
  }
  catch(err){
    next(err)
  }
})

module.exports = router;