const { Category } = require("../../models");
const cloudinary = require("../../utils/cloud");

// create category
const createCategory = async (req, res) => {
  try {
    // file
    if (!req.file)
      return res.status(400).json({ message: "Image is required" });

    // check if the category is already exists
    isCategoryExist = await Category.findOne({ name: req.body.name });
    if (isCategoryExist)
      return res
        .status(409)
        .json({ success: false, message: "Category already exists" });

    // upload image to cloudinary
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      req.file.path,
      { folder: `${process.env.CLOUDINARY_FOLDER_NAME}/category` }
    );

    // create category
    const category = await Category.create({
      name: req.body.name,
      image: { url: secure_url, id: public_id },
      createdBy: req.user._id,
    });

    return res.status(201).json({ success: true, category });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// get all categories
const getCategories = async (req, res) => {
  try {
    let { page, limit, search } = req.query;

    page = !page || page < 1 || isNaN(page) ? 1 : page;
    limit = !limit || limit < 1 || isNaN(limit) ? 20 : limit;
    search = !search ? "" : search;

    const count = await Category.aggregate([
      {
        $match: {
          name: { $regex: search, $options: "i" },
        },
      },
    ]);

    const categories = await Category.aggregate([
      {
        $match: {
          name: { $regex: search, $options: "i" },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "createdBy",
          foreignField: "_id",
          as: "createdBy",
        },
      },
      { $unwind: "$createdBy" },
      { $sort: { createdAt: -1 } },
      { $skip: (page - 1) * limit },
      { $limit: Number(limit) },
      {
        $project: {
          name: 1,
          description: 1,
          image: 1,
          createdAt: 1,
          createdBy: {
            _id: 1,
            firstName: 1,
            lastName: 1,
          },
        },
      },
    ]);

    return res.status(200).json({
      success: true,
      current: page,
      total: Math.ceil(count.length / limit),
      numberOfCategories: count.length,
      categories,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// get category by id
const getCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.categoryId);

    // check if the category is found
    if (!category)
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });

    return res.status(200).json({ success: true, category });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// update category by id
const updateCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    // check if body is empty
    if (!name && !description && !req.file)
      return res.status(400).json({ message: "Body is empty" });

    // check if the category is already exists
    if (name) {
      isCategoryExist = await Category.findOne({ name });
      if (isCategoryExist)
        return res
          .status(409)
          .json({ success: false, message: "Category already exists" });
    }

    // update category
    const category = await Category.findByIdAndUpdate(req.params.categoryId, {
      name,
      description,
    });

    // check if the category is found
    if (!category)
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });

    // file
    if (req.file) {
      const { secure_url } = await cloudinary.uploader.upload(req.file.path, {
        public_id: category.image.id,
      });
      category.image.url = secure_url;
      await category.save();
    }

    return res.status(200).json({ success: true, message: "Category updated" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// delete category by id
const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.categoryId);

    // check if the category is found
    if (!category)
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });

    // delete image from cloudinary
    await cloudinary.uploader.destroy(category.image.id);

    return res.status(200).json({ success: true, message: "Category deleted" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createCategory,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory,
};
