import ldap from 'ldapjs';

export default class Ldap {
  constructor(conf = {}) {
    // ldap配置
    // {
    //  url: 'ldap://x.x.x.x:389',
    //  ldap_baseDn: 'dc=ldap,dc=example,dc=com'
    // }
    this.config = {
      url: conf.ldap_url,
      log: conf.ldap_log === '1' ? true : false,
      ...conf,
    };

    this.session = {};
  }

  async getUserInfo(username) {
    let session = this.session;
    let { url, ldap_baseDn, ldap_connect_timeout = 5000 } = this.config;

    if (!url || !ldap_baseDn) {
      throw new Error('ldap config missing!');
    }

    //创建LDAP client，把服务器url传入
    let client = ldap.createClient({url: url});
    let res = new Promise((resolve, reject) => {
      // 创建LDAP查询选项 filter的作用就是相当于SQL的条件
      let opts = {
        filter: `(cn=${username})`, // 查询条件过滤器，查找uid=kxh的用户节点
        scope: 'sub', // 查询范围，sub表示没有深度限制
        timeLimit: 500, // 查询超时
      };

      client.search(ldap_baseDn, opts, function (err, res1) {
        //查询结果事件响应
        res1.on('searchEntry', function (entry) {
          //获取查询的对象
          let user = entry.object;
          // let userText = JSON.stringify(user);
          session = user;
          resolve(user);
        });

        //查询错误事件
        res1.on('error', function (err) {
          console.error(`error: ${err.message}`, 'LDAP');
          //unbind操作，必须要做
          client.unbind(function(error) {
            if(error) {
              console.log(error.message, 'LDAP');
            }
          });
          reject(err);
        });

        //查询结束
        res1.on('end', function (result) {
          // 校验是否有结果
          if(!session.dn) {
            console.log('result: No such user', 'LDAP');
            resolve({});
          }

          //unbind操作，必须要做
          client.unbind(function(error) {
            if(error) {
              console.log(error.message, 'LDAP');
            }
          });
        });
      });

      setTimeout(() => {
        reject('timeout');
      }, ldap_connect_timeout);
    }).catch(error => {
      return error;
    });

    return res;
  }

  async validate(username, password) {
    let { url, ldap_baseDn, ldap_connect_timeout = 5000 } = this.config;

    if (!url) {
      throw new Error('ldap url must setup!');
    }

    //创建LDAP client，把服务器url传入
    let client = ldap.createClient({url: url});
    let ldapCn = `cn=${username},${ldap_baseDn}`;
    let res = new Promise((resolve, reject) => {
      // 将client绑定LDAP Server 第一个参数：是用户，必须是从根节点到用户节点的全路径 第二个参数：用户密码
      client.bind(ldapCn, password, function (err) {
        resolve(!err);
        client.unbind(function(error) {
          if(error) {
            console.log(error.message, 'LDAP');
          }
        });
      });

      setTimeout(() => {
        reject('timeout');
      }, ldap_connect_timeout);
    }).catch(error => {
      return error;
    });

    return res;
  }
}
