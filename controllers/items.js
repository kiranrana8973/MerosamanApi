const ErrorResponse = require("../utils/errorResponse");
const Item = require("../model/items");
const asyncHandler = require("../middleware/async");
//To get the file name extension line .jpg,.png
const path = require("path");

//-------------------SHOW ALL ITEMS

exports.getItems = asyncHandler(async (req, res, next) => {
  const items = await Item.find({});

  res.status(201).json({
    success: true,
    count: items.length,
    data: items,
  });
});

//--------------------CREATE ITEM------------------

exports.createItem = asyncHandler(async (req, res, next) => {
  req.body.user = req.user.id;

  const item = await Item.create(req.body);

  if (!item) {
    return next(new ErrorResponse("Error adding item"), 404);
  }

  res.status(201).json({
    success: true,
    data: item,
  });
});

// -----------------FIND ITEM BY ID-------------------

exports.getItemById = asyncHandler(async (req, res, next) => {
  const item = await Item.findById(req.params.id);

  if (!item) {
    return next(new ErrorResponse("Item not found"), 404);
  }

  res.status(200).json({
    success: true,
    data: item,
  });
});
// -----------------DELETE ITEM------------------------

exports.deleteItem = asyncHandler(async (req, res, next) => {
  const item = await Item.findById(req.params.id);

  if (!item) {
    return next(new ErrorResponse(`No item found `), 404);
  }

  await item.remove();

  res.status(200).json({
    success: true,
    count: item.length,
    data: {},
  });
});

// ------------------UPLOAD IMAGE-----------------------

exports.ItemPhotoUpload = asyncHandler(async (req, res, next) => {
  const item = await Item.findById(req.params.id);

  console.log(item);
  if (!item) {
    return next(new ErrorResponse(`No item found with ${req.params.id}`), 404);
  }

  if (item.user.toString() != req.user.id) {
    return next(
      new ErrorResponse(`You are not authorized to update this item.`),
      401
    );
  }

  if (!req.files) {
    return next(new ErrorResponse(`Please upload a file`, 400));
  }

  const file = req.files.file;

  // Make sure the image is a photo and accept any extension of an image
  // if (!file.mimetype.startsWith("image")) {
  //   return next(new ErrorResponse(`Please upload an image`, 400));
  // }

  // Check file size
  if (file.size > process.env.MAX_FILE_UPLOAD) {
    return next(
      new ErrorResponse(
        `Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`,
        400
      )
    );
  }

  file.name = `photo_${item.id}${path.parse(file.name).ext}`;

  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
    if (err) {
      console.err(err);
      return next(new ErrorResponse(`Problem with file upload`, 500));
    }

    //insert the filename into database
    await Item.findByIdAndUpdate(req.params.id, {
      photo: file.name,
    });
  });

  res.status(200).json({
    success: true,
    data: file.name,
  });
});