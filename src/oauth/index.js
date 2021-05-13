let db = require("../model");
let model = module.exports;
let bcrypt = require("bcrypt");
let constant = require("../constant");

// Used to authenticate the client
model.getClient = function (clientId, clientSecret, callback) {
  console.log(
    "in getClient (clientId: " +
      clientId +
      ", clientSecret: " +
      clientSecret +
      ")"
  );
  let where = {
    clientId: clientId,
    clientSecret: clientSecret,
  };
  if (clientSecret === null) {
    return db.OAuthClients.findOne({ where: { clientId: clientId } }).then(
      callback
    );
  }
  db["client"]
    .findOne({ where: where })
    .then((client) => {
      console.log("client found in get client ==>", client);
      if (!client) {
        callback("unauthorized client found");
      }
      client.grants = [
        "authorization_code",
        "password",
        "refresh_token",
        "client_credentials",
      ];
      callback(null, client);
    })
    .catch((error) => {
      console.log("error in getting");
      callback(error);
    });
};

// Used to authenticate the user. Supports password grant type
model.getUser = function (username, password, callback) {
  console.log(
    "in getUser (username: " +
      username.toLowerCase() +
      ", password: " +
      password +
      ")"
  );
  db["user"]
    .findOne({
      where: {
        email: username,
      },
      attributes: [
        "id",
        "scope",
        "role",
        "email",
        "name",
        "isLogin",
        "password",
      ],
    })
    .then((userFound) => {
      console.log("user found in get user ==>", userFound);
      if (!userFound) callback("please check your email");
      bcrypt.compare(password, userFound.password, (err, same) => {
        if (same) callback(null, userFound.dataValues);
        else callback("please check your password");
      });
    })
    .catch((error) => {
      console.log("error in get user ===>", error);
      callback(error);
    });

  // db['wm_user'].findOne({
  //     where:{
  //         // $and:{
  //         $or:{
  //             user_name:username.toLowerCase(),
  //             email: username.toLowerCase()
  //         },
  //         // isActive:true,
  //         // }
  //     }
  // }).then(user => {

  //     if(user){

  //         console.log("is Active...................",JSON.parse(user.isActive))

  //         if(JSON.parse(user.isActive)){
  //         comparePassword(password,user.dataValues.password, function(err, isMatch) {
  //             if (isMatch === true) {

  //                 db.OAuthAccessTokens.destroy({ where: { user: user.dataValues.id}}).then(token =>{
  //                     if(token){
  //                         db.OAuthRefreshTokens.destroy({ where: { user: user.dataValues.id }}).then(refreshToken => {
  //                             // token.destroy({force: true});
  //                             // refreshToken.destroy({force: true});

  //                         }).catch(err => {
  //                             console.log(err);
  //                         });
  //                     }
  //                     callback(null, user);
  //                 }).catch(err => {
  //                     console.log("Error at oauth token destroy",err);
  //                 });

  //             } else {
  //                 console.log("Eror .....",err)
  //                 return callback(err);
  //             }
  //         });
  //         }else{
  //         //     console.log("in else user is inactive")
  //             callback(null,null)
  //         }
  //     }else {
  //         callback(null,null);
  //     }
  // }).catch(err => {
  //     console.log("Error at get user...................",err);
  //     return callback(err)
  // });
};

// Used to save the generated token in db.
model.saveToken = async function (token, clientId, user, callback) {
  console.log(
    "in saveAccessToken (token: " +
      token +
      ", clientId: " +
      clientId +
      ", userId: " +
      user +
      ", expires: "
  );
  let userId = user.id;
  let accessToken = await db["access_token"].findOne({
    where: { user_id: user.id },
  });
  let refreshToken = await db["refresh_token"].findOne({
    where: { user_id: user.id },
  });
  if (accessToken) {
    await db["access_token"].destroy({
      where: {
        id: accessToken.id,
      },
    });
  }
  if (refreshToken) {
    await db["refresh_token"].destroy({
      where: {
        id: refreshToken.id,
      },
    });
  }
  Promise.all([
    db["access_token"].create({
      token: token.accessToken,
      expire_time: token.accessTokenExpiresAt,
      client_id: clientId.id,
      user_id: userId,
    }),
    db["refresh_token"].create({
      token: token.refreshToken,
      expire_time: token.refreshTokenExpiresAt,
      client_id: clientId.id,
      user_id: userId,
    }),
  ])
    .then(async (accessToken) => {
      db["user"]
        .update(
          {
            current_login: Date.now(),
            previous_login: Date.now(),
            isLogin: true,
            token: token.accessToken,
            token_expiry: token.accessTokenExpiresAt,
          },
          { where: { id: userId } }
        )
        .then((userLoginUpdate) => {
          console.log("User updated........", userLoginUpdate);
        })
        .catch((err) => {
          console.log("Error..in save access token user update..", err);
        });

      callback(null, {
        accessToken: token.accessToken,
        accessTokenExpiresAt: token.accessTokenExpiresAt,
        refreshToken: token.refreshToken,
        refreshTokenExpiresAt: token.refreshTokenExpiresAt,
        client: clientId,
        user: {
          id: user.id,
          scope: user.scope,
          role: user.role,
          isLogin: user.isLogin,
          name: user.name,
          email: user.email,
        },
      });
    })
    .catch((error) => {
      console.log("error in save token ===>", error);
      callback(error);
    });
};

// Used to check if the user scope is valid or not.
model.validateScope = async function (user, client, scope) {
  if (user.scope != scope) {
    return false;
  }
  return scope;
};

// Used to verify the scope.
model.verifyScope = async function (token, scope) {
  if (!token.scope) {
    return false;
  }
  return true;
};

// Used to check access token is valid or not.
model.getAccessToken = async function (accessToken, callback) {
  try {
    console.log("in getAccessToken (bearerToken: " + accessToken + ")");
    let checkToken = await db["access_token"].findOne({
      where: {
        token: accessToken,
      },
      include: [
        {
          model: db["user"],
          attributes: ["id", "scope", "role"],
        },
        {
          model: db["client"],
          attributes: ["id"],
        },
      ],
    });
    if (checkToken) {
      callback(null, {
        accessToken: checkToken.token,
        accessTokenExpiresAt: checkToken.expire_time,
        scope: checkToken.user.scope,
        client: checkToken.client.id, // with 'id' property
        user: checkToken.user,
      });
    }
  } catch (error) {
    console.log("error in get token ===>", error);
    callback(400, error);
  }
};

// This will have to be updated as per our need.

// This will very much depend on your setup, I wouldn't advise doing anything exactly like this but
// it gives an example of how to use the method to restrict certain grant types
// var authorizedClientIds = [constant.oauth.CLIENT_ID];

model.grantTypeAllowed = function (clientId, grantType, callback) {
  console.log(
    "in grantTypeAllowed (clientId: " +
      clientId +
      ", grantType: " +
      grantType +
      ")"
  );
  // if (grantType === 'password') {
  //     return callback(false, authorizedClientIds.indexOf(clientId) >= 0);
  // }
  // callback(false, true);
};

/* * Required to support refreshToken grant type  */
model.saveRefreshToken = function (token, clientId, expires, user, callback) {
  console.log(
    "in saveRefreshToken (token: " +
      token +
      ", clientId: " +
      clientId +
      ", userId: " +
      user +
      ", expires: " +
      expires +
      ")"
  );
  // let userId = user;
  // if(typeof user === 'object'){
  //     userId = user.dataValues.id ;
  // }

  // db.OAuthRefreshTokens.create({
  //     refreshToken: token,
  //     clientId: clientId,
  //     user: userId,
  //     expires: expires
  // }).then(refreshToken => {
  //     callback(null, refreshToken);
  // }).catch(err => {
  //     console.log('Save refresh token error.......',err);
  //     callback(err);
  // });
};

model.getRefreshToken = function (refreshToken, callback) {
  console.log("in getRefreshToken (refreshToken: " + refreshToken + ")");
  // db.OAuthRefreshTokens.findOne({where:{
  //         refreshToken: refreshToken
  //     }}).then(refreshToken => {
  //     callback(null, refreshToken);
  // }).catch(err => {
  //     console.log("Error at get refresh token .................",err);
  //     callback(err);
  // });
};

model.revokeRefreshToken = function (refreshToken, callback) {
  console.log("in revoke token" + refreshToken);
  // db.OAuthRefreshTokens.findOne({where:{
  //         refreshToken: refreshToken
  //     }}).then(refreshToken => {
  //     db.OAuthAccessTokens.findOne({where:{user: refreshToken.dataValues.user}})
  //         .then(token => {
  //             token.destroy({force: true});
  //             refreshToken.destroy({force: true});
  //             callback(null, refreshToken);
  //         }).catch(err => {
  //         console.log("Error in revolk refresh token.....................",err);
  //         console.log(err);
  //     });
  // }).catch(err => {
  //     console.log("Error in revolk refresh token.....................",err);
  //     callback(err);
  // });
};

comparePassword = function (candidatePassword, password, cb) {
  // bcrypt.compare(candidatePassword, password, function(err, isMatch) {
  //     console.log(isMatch);
  //     if (err) return cb(err);
  //     cb(null, isMatch);
  // });
};
