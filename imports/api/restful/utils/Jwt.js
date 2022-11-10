const jwt = require('jsonwebtoken');

class Jwt {
  constructor(data, secret) {
    this.data = data;
    this.secret = secret || 'ai$Bot!9527';
  }

  //生成token
  getToken() {
    let data = this.data;
    if(typeof data === 'string') {
      data = {data}
    }
    const secret = this.secret;
    const created = Math.floor(Date.now() / 1000);
    //expiresIn : 表示有效期  不带单位默认为秒  如带单位如: "2 days", "10h", "7d"
    let token = jwt.sign(data, secret, {expiresIn: created + 3600});
    return token;
  }

  // 校验token
  verifyToken() {
    let token = this.data;
    if(typeof token !== 'string') {
      return 'error';
    }
    const secret = this.secret;
    let res;
    try {
      let result = jwt.verify(token, secret) || {};
      let {exp = 0} = result, current = Math.floor(Date.now() / 1000);
      if (current <= exp) {
        res = result.data || {};
      }
    } catch (e) {
      res = 'error';
    }
    return res;
  }
}

module.exports = Jwt;
