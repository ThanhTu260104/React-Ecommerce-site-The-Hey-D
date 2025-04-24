const secret = "rat_met";
const jwt = require("jsonwebtoken");
const maxAge = "1h";
const bcrypt = require("bcryptjs");
exports.adminAuth = (req, res, next) => {
  let beartoken = req.headers.authorization; //Bearer 52A2b39agsdg2342
  // console.log("beartoken =", beartoken);
  if (!beartoken)
    return res
      .status(401)
      .json({ thong_bao: "Không vào được. Thiếu token nhé" });
  let token = beartoken.split(" ")[1]; //52A2b39agsdg2342
  // console.log("token =", token);
  // console.log("Token received:", token);
  // console.log("Secret key:", secret);
  jwt.verify(token, secret, (err, datadDecoded) => {
    if (err)
      return res.status(401).json({ thong_bao: "Sai token. Không vào được" });
    
    console.log("Decoded token data:", datadDecoded);
    
    // Check vai_tro instead of role
    if (datadDecoded.vai_tro !== 1)
      return res
        .status(401)
        .json({ thong_bao: "Bạn không phải admin để vào " });
    else next();
  });
};

