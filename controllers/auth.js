const { User } = require("../models/user");

const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");

const gravatar = require("gravatar");

const path = require("path");

const fs = require("fs/promises");

const jimp = require("jimp");

const { ctrlWrapper, HttpError, sendEmail } = require("../helpers");

const nanoid = require("nanoid");

const { SECRET_KEY, BASE_URL } = process.env;

const avatarsDir = path.join(__dirname, "../", "public", "avatars");

/* Registration */
const register = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user) {
    throw HttpError(409, "Email in use");
  }

  const hashPassword = await bcrypt.hash(password, 10);
  const avatarURL = gravatar.url(email);
  const verificationToken = nanoid();

  const newUser = await User.create({
    ...req.body,
    password: hashPassword,
    avatarURL,
    verificationToken,
  });

  const mail = {
    to: email,
    subject: "Confirm email",
    html: `<a href="${BASE_URL}/api/users/verify/${verificationToken}" target="_blank">Click to confirm email</a>`,
  };
  await sendEmail(mail);

  res.status(201).json({
    email: newUser.email,
    password: newUser.password,
  });
};

/* Login */
const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(401, "Email or password is wrong");
  }
  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw HttpError(401, "Email or password is wrong");
  }

  const payload = {
    id: user._id,
  };

  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "12h" });
  await User.findByIdAndUpdate(user._id, { token });

  res.status(200).json({
    token,
    user: { email, subscription: user.subscription },
  });
};

/* Current */
const getCurrent = async (req, res) => {
  const { email, subscription } = req.user;

  res.status(200).json({
    email,
    subscription,
  });
};

/* Logout */
const logout = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: "" });

  res.status(204).json({
    message: "Logout success",
  });
};

/* Subscription */
const updateSubscription = async (req, res) => {
  const { _id } = req.user;
  const { subscription } = req.body;

  const updatedUser = await User.findByIdAndUpdate(
    _id,
    { subscription },
    {
      new: true,
    }
  );

  res.json({
    data: updatedUser,
  });
};

/* Update avatar */

const updateAvatar = async (req, res) => {
  const { _id } = req.user;
  const { path: tempUpload, originalname } = req.file;
  const filename = `${_id}_${originalname}`;
  const resultUpload = path.join(avatarsDir, filename);
  const avatar = await jimp.read(tempUpload);
  await avatar
    .autocrop()
    .cover(250, 250, jimp.HORIZONTAL_ALIGN_CENTER || jimp.VERTICAL_ALIGN_MIDDLE)
    .writeAsync(tempUpload);
  await fs.rename(tempUpload, resultUpload);
  const avatarURL = path.join("avatars", filename);
  await User.findByIdAndUpdate(_id, { avatarURL });

  res.json({
    avatarURL,
  });
};

/*  verify Email */
const verifyEmail = async (req, res) => {
  const { verificationToken } = req.params;
  const user = await User.findOne({ verificationToken });
  if (!user) {
    throw HttpError("Not found verification token");
  }
  await User.findByIdAndUpdate(user._id, {
    verify: true,
    verificationToken: "",
  });
  res.json({
    message: "Email was successfully verified",
  });
};

/*  resend Verify Email */

const resendVerifyEmail = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError("Not found");
  }
  if (user.verify) {
    throw HttpError("Verification has already been passed");
  }
  const mail = {
    to: email,
    subject: "website registration confirmation",
    html: `<a href="${BASE_URL}/api/users/verify/${user.verificationToken}" target="_blank">Click to confirm email</a>`,
  };
  await sendEmail(mail);
  res.json({ message: "Verification email sent" });
};

module.exports = {
  register: ctrlWrapper(register),
  login: ctrlWrapper(login),
  getCurrent: ctrlWrapper(getCurrent),
  logout: ctrlWrapper(logout),
  updateSubscription: ctrlWrapper(updateSubscription),
  updateAvatar: ctrlWrapper(updateAvatar),
  verifyEmail: ctrlWrapper(verifyEmail),
  resendVerifyEmail: ctrlWrapper(resendVerifyEmail),
};
