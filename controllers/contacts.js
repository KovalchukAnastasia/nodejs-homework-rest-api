const contacts = require("../models/contacts");

const { ctrlWrapper } = require("../helpers");

const getAll = async (req, res) => {
  const allContacts = await contacts.listContacts();
  res.json(allContacts);
};

const getById = async (req, res) => {
  const { contactId } = req.params;
  const contact = await contacts.getContactById(contactId);
  if (!contact) {
    return res.status(404).json({ message: "Not found" });
  }
  res.json(contact);
};

const add = async (req, res) => {
  const newContact = await contacts.addContact(req.body);
  res.status(201).json({ data: newContact });
};

const updateById = async (req, res) => {
  const { contactId } = req.params;
  if (!req.body) {
    return res.status(400).json({ message: "missing fields" });
  }
  const contact = await contacts.updateById(contactId, req.body);
  if (!contact) {
    return res.status(404).json({ message: "Not found" });
  }
  res.json(contact);
};

const deleteById = async (req, res) => {
  const { contactId } = req.params;
  const contact = await contacts.removeContact(contactId);
  if (!contact) {
    return res.status(404).json({ message: "Not found" });
  }
  res.json({
    message: "contact deleted",
  });
};

module.exports = {
  getAll: ctrlWrapper(getAll),
  getById: ctrlWrapper(getById),
  add: ctrlWrapper(add),
  updateById: ctrlWrapper(updateById),
  deleteById: ctrlWrapper(deleteById),
};
