const mongoose = require("mongoose");
const slugify = require("slugify");

const ItemSchema = new mongoose.Schema(
  {
    itemName: {
      type: String,
      required: [true, "Please enter item name"],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Please enter an item price"],
    },
    photo: {
      type: String,
      default: "no-photo.jpg",
    },
    category: {
      type: String,
      default: "All",
    },
    description: {
      type: String,
      required: [true, "Please add a description"],
      trim: true,
      maxlength: [500, "Description cannot be more than 500 characters"],
    },
    slug: String,
    createdAt: {
      type: Date,
      default: Date.now,
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User", // refer to User model
      required: true,
    },
  },
  {
    // This are the virtual colums, i.e we want to show all the items associated users
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ItemSchema.pre("save", function (next) {
//   //create a slug from name , if name : kiran rana then slug :kiran-rana
//   this.slug = slugify(this.name, { lower: true });
//   next();
// });

module.exports = mongoose.model("Items", ItemSchema);
