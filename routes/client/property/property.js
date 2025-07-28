const express = require('express');
const router = express.Router();
const userController = require('../../../controllers/user');
const { addPropertyVal, paramsVal, addPropertyDocument, viewPropertyDocumentValidator } = require('../../../validation/client/property');
const validate = require('../../../middlewares/validate');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

router
  .route('/:userId/')
  .post(validate(addPropertyVal), userController.addProperty)
  .get(validate(paramsVal), userController.getAllProperties);
router.route('/portfolio/:userId').get(validate(paramsVal), userController.getPortfolio);
router
  .route('/')
  .post(upload.single('file'), validate(addPropertyDocument), userController.addPropertyDocument);
router.route('/:uuid/:propertyId').get(validate(viewPropertyDocumentValidator),userController.viewPropertyDocument);
module.exports = router;