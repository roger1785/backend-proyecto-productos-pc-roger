import Category from "../models/Category.js";

export const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name || !description) {
      return res
        .status(422)
        .json({ message: "Todos los campos son obligatorios" });
    }

    const categoryExists = await Category.findOne({
      name: { $regex: new RegExp(`^${name}$`, "i") },
    });

    if (categoryExists) {
      return res.status(400).json({ message: "La categoría ya existe" });
    }

    const category = await Category.create({ name, description });

    res.status(201).json(category);
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(422).json({ message: error.message });
    }
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const getCategories = async (req, res) => {
  try {
    const {
      sortBy = "name",
      order = "asc",
      search = "",
      description,
    } = req.query;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 4;
    const skip = (page - 1) * limit;

    const categories = await Category.find({
      $and: [
        {
          $or: [
            {
              name: {
                $regex: search,
                $options: "i",
              },
            },
            {
              description: {
                $regex: search,
                $options: "i",
              },
            },
          ],
        },
        description ? { description } : {},
      ],
    })
      .select("-description -__v")
      .sort({ [sortBy]: order === "desc" ? -1 : 1 })
      .skip(skip)
      .limit(limit);

    const totalCategories = await Category.countDocuments();

    res.json({
      categories,
      totalCategories,
      totalPages: Math.ceil(totalCategories / limit),
      currentPage: page,
    });
  } catch (error) {

    res.status(500).json({ message: "Error al obtener las categorías" });
  }
};

export const getCategoryById = async (req, res) => {
  const { id } = req.params;

  try {
    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({ message: "Categoría no encontrada" });
    }

    res.json(category);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener la categoría" });
  }
};

export const updateCategory = async (req, res) => {
  try {


    const { id } = req.params;

    if (typeof req.body.name != "string") {
      return res
        .status(422)
        .json({ message: "El nombre tiene que ser un string" });
    }

    const category = await Category.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json(category);
  } catch (error) {
    // console.log(error);

    if (error.name === "ValidationError") {
      return res.status(422).json({ message: error.message });
    }

    if (error.name === "CastError") {
      return res.status(404).json({ message: error.message });
    }

    res.status(500).json({ message: "Error al actualizar la categoría" });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    await new Promise((resolve) => setTimeout(resolve, 3000));

    const { id } = req.params;

    const category = await Category.findByIdAndDelete(id);

    if (!category) {
      return res.status(404).json({ message: "Categoría no encontrada" });
    }

    res.json({ message: "Categoría borrada" });
  } catch (error) {
    res.status(500).json({ message: "Error al borrar la categoría" });
  }
};
