const { Contact } = require("../models/contact");

const { ctrlWrapper } = require("../helpers");

const getAll = async (req, res) => {
  const { _id: owner } = req.user;
  const { page = 1, limit = 20 } = req.query;
  const skip = (page - 1) * limit;
  const allContacts = await Contact.find({ owner }, "-createdAt -updatedAt", {
    skip,
    limit,
  }).populate("owner", "email");
  res.json(allContacts);
};

const getById = async (req, res) => {
  const { contactId } = req.params;
  const { _id: owner } = req.user;
  const contact = await Contact.findById(contactId, owner);
  if (!contact) {
    return res.status(404).json({ message: "Not found" });
  }
  res.json(contact);
};

const add = async (req, res) => {
  const { _id: owner } = req.user;
  const newContact = await Contact.create({ ...req.body, owner });

  res.status(201).json({ data: newContact });
};

const updateById = async (req, res) => {
  const { contactId } = req.params;
  const { _id: owner } = req.user;

  if (!req.body) {
    return res.status(400).json({ message: "missing fields" });
  }
  const contact = await Contact.findByIdAndUpdate(
    contactId,
    req.body,
    {
      new: true,
    },
    owner
  );
  if (!contact) {
    return res.status(404).json({ message: "Not found" });
  }
  res.json(contact);
};

const deleteById = async (req, res) => {
  const { contactId } = req.params;
  const { _id: owner } = req.user;
  const contact = await Contact.findByIdAndRemove(contactId, owner);
  if (!contact) {
    return res.status(404).json({ message: "Not found" });
  }
  res.json({
    message: "contact deleted",
  });
};

const updateStatusContact = async (req, res) => {
  const { contactId } = req.params;
  const { _id: owner } = req.user;
  const contact = await Contact.findByIdAndUpdate(
    contactId,
    req.body,
    {
      new: true,
    },
    owner
  );
  if (!contact) {
    return res.status(404).json({ message: "Not found" });
  }
  res.json(contact);
};

module.exports = {
  getAll: ctrlWrapper(getAll),
  getById: ctrlWrapper(getById),
  add: ctrlWrapper(add),
  updateById: ctrlWrapper(updateById),
  deleteById: ctrlWrapper(deleteById),
  updateStatusContact: ctrlWrapper(updateStatusContact),
};
