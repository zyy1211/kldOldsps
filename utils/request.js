let API = require('./config.js');
let $http = {
  $post: function (url, data, header) {
    let head = header === 1 ? 'application/json' : 'application/x-www-form-urlencoded';
    return new Promise(function (resolve, reject) {
      wx.showLoading({
        title: "加载中",
        mask:true
      });
      let token = wx.getStorageSync('token');
      // console.log('token' + token);
      wx.request({
        url: API.API_HOST + url,
        method: 'Post',
        header: {
          'Content-type': head,
          'token': token,
        },
        data: data,
        success: function (res) {
          wx.hideLoading();
          if (res.data.status == 200) {
            resolve(res);
          } else {
            wx.showToast({title: res.data.message,icon:'none',duration:3000});
          }
        },
        fail: function (res) {
          wx.hideLoading();
          reject(res)
        },
        complete:function(){
          setTimeout(() => {  
            wx.hideLoading();  
          }); 
        }
      })
    })
  },
  $creat:function(url,data){
    return new Promise(function (resolve, reject) {
      let token = wx.getStorageSync('token');
      wx.request({
        url: API.API_HOST + url,
        method: 'Post',
        header: {
          'content-type': 'application/x-www-form-urlencoded',
          'token': token,
        },
        data: data,
        success: function (res) {
          resolve(res);
        },
        fail: function (res) {
          reject(res)
        }
      })
    })
  },
  $get:function(url,data){
    return new Promise(function (resolve, reject) {
      wx.showLoading({
        title: "加载中",
        mask:true,
      });
      let token = wx.getStorageSync('token');
      wx.request({
        url: API.API_HOST + url,
        data: data,
        method: 'Get',
        header: {
          'content-type': 'application/x-www-form-urlencoded',
          'token': token,
        },
        success: function (res) {
          wx.hideLoading();
          if (res.data.status == 200) {
            resolve(res);
          } else {
            wx.showToast({title: res.data.message ,icon:'none',duration:3000});
            resolve(res);
          }
        },
        fail: function (res) {
          wx.hideLoading();
          reject(res)
        },
        complete:function(){
          setTimeout(() => {  
            wx.hideLoading();  
          }, 100);  
        }
      })
    })
  }
}
module.exports = {
  post: $http.$post,
  get:$http.$get,
  creat:$http.$creat

};