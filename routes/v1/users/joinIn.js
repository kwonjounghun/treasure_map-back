const jwt = require("jsonwebtoken");
const User = require("../../../models/User");

const joinIn = (req, res) => {
  const { username, userEmail, password } = req.body;
  let newUser = null;

  const create = (user) => {
    if (user) {
      throw new Error("username existes");
    } else {
      return User.create(username, userEmail, password);
    }
  };
  const count = (user) => {
    newUser = user;
    return User.count({}).exec();
  };

  const assign = (count) => {
    if (count === 1) {
      return newUser.assignAdmin();
    } else {
      return Promise.resolve(false);
    }
  };

  const respond = (isAdmin) => {
    res.json({
      message: "registered successfully",
      admin: isAdmin ? true : false
    });
  };

  const onError = (error) => {
    res.status(409).json({
      message: error.message
    });
  };

  User.findOneByUsername(userEmail)
    .then(create)
    .then(count)
    .then(assign)
    .then(respond)
    .catch(onError);
};

exports.login = (req, res) => {
  const { userEmail, password } = req.body;
  const secret = process.env.SECRET_CODE;
  const check = (user) => {
    if (!user) {
      throw new Error("login failed");
    } else {
      if (user.verify(password)) {
        const p = new Promise((resolve, reject) => {
          jwt.sign({
            _id: user._id,
            username: user.username,
            userEmail: user.userEmail,
            admin: user.admin
          },
          secret,
          {
            expiresIn: "7d",
            issuer: "placelist.com",
            subject: "userInfo"
          }, (err, token) => {
            if (err) reject(err);
            resolve(token);
          });
        });
        return p;
      } else {
        throw new Error("login failed");
      }
    }
  };

  const respond = (token) => {
    res.json({
      message: "logged in successfully",
      token
    });
  };

  const onError = (error) => {
    res.status(403).json({
      message: error.message
    });
  };

  User.findOneByUsername(userEmail)
    .then(check)
    .then(respond)
    .catch(onError);
};

module.exports = joinIn;
