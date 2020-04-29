// pages/signIn/signIn.js
let http = require('../../utils/request');
let API = require('../../utils/config.js');
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    signIned: '',
    ids:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options);
    let self = this;
    let obj = wx.getLaunchOptionsSync();
    let scene = obj.scene;
    let activityId = options.activityId;
    let uid = options.uid;
    console.log(obj);
    if(scene == 1011 || scene == 1012 || scene == 1013){
      // console.log(obj)
      let query = obj.query.scene.split('-');
      console.log(query);
      activityId = query[0];
      uid = query[1];
    }
    app.getToken(function(){
      app.getLogin(function(){
        let userInfo = app.getUserInfo();
        // console.log(userInfo)
        let isSelf = "false";
        if(uid == userInfo.id){
          isSelf = "true";
        }
        self.setData({
          activityId: activityId,
          isSelf: isSelf,
          uid:uid,
          userId:userInfo.id
        });
        if(scene == 1011 || scene == 1012 || scene == 1013){
          self.signByIds('scan',[userInfo.id]);
        }else{
          self.getList(options.activityId);
        }
      })
    })
  },
  getList: function () {
    let self = this;
    http.get('/activities/queryAppliedAboutSign', {
      activityId: self.data.activityId
    }).then(function (res) {
      if (res.data.status == 200) {
        if (res.data.message != null) {
          self.setData({
            signedData: res.data.message.signed.signedData,
            unSignedData: res.data.message.unSign.unSignedData
          })
        }
      }
    })
  },
  checkboxChange: function (e) {
    this.setData({
      ids: e.detail.value
    })
  },

  signByIds: function (isScan,ids) {
    let self = this;
    let params = {
      ids: self.data.ids,
      id: self.data.activityId
    }
    // console.log(isScan != 'scan')
    // console.log(self.data.ids.length);
    if(isScan != 'scan' && self.data.ids.length == 0){
      return;
    }
    if(isScan == 'scan'){ params.ids = ids }

    http.post('/activities/signByIds', params).then(function (res) {
      // console.log(res);
      self.getList(self.data.activityId);
    })
  },
   // 生成海报
   createPoster: function () {
    this.selectComponent('#getPoster').scanSign();
  },
})