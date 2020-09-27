const bcrypt = require('bcrypt');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

const User = require('../../models/User');

// importa factories functions
const makePostRegister = require("./post-register");
const makePostLogin = require("./post-login");
const makePostForgotPassword = require("./post-forgot-password");

// exporta functions para controlar registos
exports.postRegister = makePostRegister({ User, bcrypt });

// exporta functions para controlar login
exports.postLogin = makePostLogin({ User, bcrypt });

// exporta functions para controlar recuperação de conta!
exports.postForgotPassword = makePostForgotPassword({
    User, crypto, nodemailer
});
