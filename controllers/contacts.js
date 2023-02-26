const { Contact } = require("../models/contacts/contact");

const { ctrlWrapper } = require("../helpers");

const getAll = async (req, res) => {
  const allContacts = await Contact.find({}, "-createdAt -updatedAt");
  res.json(allContacts);
};

const getById = async (req, res) => {
  const { contactId } = req.params;
  const contact = await Contact.findById(contactId);
  if (!contact) {
    return res.status(404).json({ message: "Not found" });
  }
  res.json(contact);
};

const add = async (req, res) => {
  const newContact = await Contact.create(req.body);
  res.status(201).json({ data: newContact });
};

const updateById = async (req, res) => {
  const { contactId } = req.params;
  if (!req.body) {
    return res.status(400).json({ message: "missing fields" });
  }
  const contact = await Contact.findByIdAndUpdate(contactId, req.body, {
    new: true,
  });
  if (!contact) {
    return res.status(404).json({ message: "Not found" });
  }
  res.json(contact);
};

const deleteById = async (req, res) => {
  const { contactId } = req.params;
  const contact = await Contact.findByIdAndRemove(contactId);
  if (!contact) {
    return res.status(404).json({ message: "Not found" });
  }
  res.json({
    message: "contact deleted",
  });
};

const updateStatusContact = async (req, res) => {
  const { contactId } = req.params;
  const contact = await Contact.findByIdAndUpdate(contactId, req.body, {
    new: true,
  });
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
