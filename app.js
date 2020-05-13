//app.js
let http = require('./utils/request.js');
App({
  onLaunch: function (options) {
    wx.clearStorage();
    let t = wx.getSystemInfoSync().SDKVersion;
    // console.log(t);
    if (t = t.replace(/\./g, ""), parseInt(t) < 164) {
      return wx.showModal({
        title: "提示",
        content: "你的微信版本过低，可能无法使用此小程序的部分功能，请升级到最新微信版本后重试。"
      })
    }
    if (wx.canIUse("getUpdateManager")) {
      const updateManager = wx.getUpdateManager();
      updateManager.onCheckForUpdate(function (res) {})
      updateManager.onUpdateReady(function () {
        wx.showModal({
          title: '更新提示',
          content: '新版本已经准备好，是否重启应用？',
          success: function (res) {
            if (res.confirm) {
              // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
              updateManager.applyUpdate()
            }
          }
        })
      })
    };
  },
  // 设置监听器
  watch: function (ctx, obj) {
    Object.keys(obj).forEach(key => {
      this.observer(ctx.data, key, ctx.data[key], function (value) {
        obj[key].call(ctx, value)
      })
    })
  },
  // 监听属性，并执行监听函数
  observer: function (data, key, val, fn) {
    Object.defineProperty(data, key, {
      configurable: true,
      enumerable: true,
      get: function () {
        return val
      },
      set: function (newVal) {
        if (newVal === val) return
        fn && fn(newVal)
        val = newVal
      },
    })
  },
  getToken: function (callback) {
    let self = this;
    if (!self.globalData.isToken) {
      wx.login({
        success: res => {
          console.log(res);
          self.setCode(res.code);
          http.get('/login/' + res.code, '').then(function (data) {
            self.globalData.isToken = 1;
            console.log(data);
            self.setToken(data.header.token)
            console.log(data.header.token)
            http.get('/login/getUserInfo', '').then(function (data) {
              self.setUserInfo(data.data.message);
              // self.setUserInfo('');
              callback();
            })
          });
        }
      })
    } else {
      callback();
    }
  },
  getLogin: function (callback) {
    let self = this;
    if (!self.globalData.isLogin) {
      wx.navigateTo({
        url: '/pages/userInfo/userInfo',
      });
    } else {
      callback();
    }
  },
  getAuth: function (callback) {
    let self = this;
    // if (self.globalData.isAuth == -1) {
    http.get('/certification/queryAuditStatusById').then(function (data) {
      console.log(data);
      if (data.data.status == 200) {
        self.globalData.isAuth = data.data.message.status;
        self.globalData.cause = data.data.message.msg + data.data.message.cause;
      }
      callback(self.globalData.isAuth, self.globalData.cause)
    })
    // }else{
    //   callback(self.globalData.isAuth,self.globalData.cause)
    // }

  },
  saveUser: function (userInfo, callback) {
    http.post('/login/saveUserInfo', userInfo, 1).then(function (data) {
      callback(data)
    })
  },

  // 储存
  setCode: function (code) {
    wx.setStorageSync('code', code);
  },
  setToken: function (token) {
    wx.setStorageSync('token', token);
  },
  setUserInfo: function (info) {
    let self = this;
    if (self.isNull(info)) {
      info = '';
    } else {
      self.globalData.isLogin = 1;
    }
    wx.setStorageSync('userInfo', JSON.stringify(info));
  },
  setPhone: function (phone) {
    wx.setStorageSync('phone', JSON.stringify(phone))
  },

  setGameType: function (type) {
    wx.setStorageSync('gameType', JSON.stringify(type))
  },
  getGameType: function (type) {
    return JSON.parse(wx.getStorageSync('gameType'))
  },

  setCardDetail:function(data){
    wx.setStorageSync('cardDetail', JSON.stringify(data))
  },
  getCardDetail: function (data) {
    return JSON.parse(wx.getStorageSync('cardDetail'))
  },

  setVenuCvs:function(data){
    wx.setStorageSync('venuCvs', JSON.stringify(data))
  },
  getVenuCvs:function(){
    return JSON.parse(wx.getStorageSync('venuCvs'))
  },

  // 取本地
  getUserInfo: function () {
    let self = this;
    console.log(wx.getStorageSync('userInfo'))
    let userInfo = JSON.parse(wx.getStorageSync('userInfo'));
    return userInfo;
  },


  getPhone: function () {
    let phone = wx.getStorageSync('phone');
    if (phone) {
      return JSON.parse(phone);
    }
    return '';
  },

  isNull: function (str) {
    if (str == undefined || str == null || str == '' || str == "undefined") {
      return true;
    } else if (Array.prototype.isPrototypeOf(str) && str.length === 0) {
      return true;
    }
    return false;
  },

  isToDetail: function (callback) {
    let userInfo = wx.getStorageSync('userInfo');
    if (userInfo == '') {
      wx.navigateTo({
        url: '../userInfo/userInfo',
      })
      return;
    }
    callback();
  },

  globalData: {
    isToken: !1,
    isLogin: !1,
    isAuth: -1,
    cause: '',
    userInfo: '',
    latitude: 30.21231,
    longitude: 120.21269,
    isreload: 0,
  }
})