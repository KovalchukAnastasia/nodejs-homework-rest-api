const fs = require("fs/promises");
const path = require("path");
const { nanoid } = require("nanoid");

const contactsPath = path.join(__dirname, "./contacts.json");

const listContacts = async () => {
  const data = await fs.readFile(contactsPath);
  const contacts = JSON.parse(data);
  return contacts;
};

const getContactById = async (contactId) => {
  const contacts = await listContacts();
  const result = contacts.find((item) => item.id === contactId);
  if (!result) {
    return null;
  }
  return result;
};

const removeContact = async (contactId) => {
  const contacts = await listContacts();
  const idx = contacts.findIndex((item) => item.id === contactId);
  if (idx === -1) {
    return null;
  }
  const [removeContact] = contacts.splice(idx, 1);
  await fs.writeFile(contactsPath, JSON.stringify(contacts));
  return removeContact;
};

const addContact = async (body) => {
  const contactsData = await listContacts();
  const newContact = { id: nanoid(), ...body };
  contactsData.push(newContact);
  await fs.writeFile(contactsPath, JSON.stringify(contactsData));
  return newContact;
};

const updateById = async (contactId, body) => {
  const contactsData = await listContacts();
  const idx = contactsData.findIndex((item) => item.id === contactId);
  if (idx === -1) {
    return null;
  }
  contactsData[idx] = { id: contactId, ...body };
  await fs.writeFile(contactsPath, JSON.stringify(contactsData));
  return contactsData[idx];
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateById,
};
