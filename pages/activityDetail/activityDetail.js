 let http = require('../../utils/request');
 let API = require('../../utils/config.js');
 let util = require('../../utils/util');
 let app = getApp();
 Page({

   /**
    * 页面的初始数据
    */
   data: {
    isSelf:false,
     list: [1, 23, 4, 5, 6],
     id: 1,
     isFollow: 0,
     Activities: {},
     ActivitiesCondition: {},
     time_diff: '',
     uid: '',
     activityId: '',
     isApply: false,
     registrationStatus: '',
     userInfo: '',
     api: API.img_host,
     disableUpload: true,
     isFlag: false,
     editHeart: false,
     isqueen:false,
     actions: [{
       name: '生成海报'
     }, {
       name: '转发',
       openType: 'share'
     }]
   },
   // 切换遮罩层
   tapmMask: function () {
     this.setData({
       isFlag: !this.data.isFlag
     })
   },
   // 生成海报
   createPoster: function () {
     this.setData({
       isFlag: !this.data.isFlag
     })
     this.selectComponent('#getPoster').getAvaterInfo();
   },
   toActivityEdit: function () {
     let self = this;
     wx.navigateTo({
       url: '../issue/issue?id=' + this.data.id,
     })
   },
   toSignUpList: function () {
     let self = this;
      let isSelf = self.data.isSelf;

     if (isSelf) {
       wx.navigateTo({
         url: '../signupList/signupList?activityId=' + self.data.activityId + '&self=' + true + '&signupLength=' + self.data.Activities.appliedNum
       })
     } else {
       wx.navigateTo({
         url: '../signupList/signupList?activityId=' + self.data.activityId + '&self=' + false + '&signupLength=' + self.data.Activities.appliedNum
       })
     }
   },
   followPs: function (e) {
     let self = this;
    app.getLogin(function(res){
      if(app.isNull(self.data.userInfo)){
        self.getUserInfo();
      }
      let type = e.currentTarget.dataset.key;
      let url = '/relation/attention'
      if (type == 1) {
        url = '/relation/cancelAttention'
      }
      let isFollow = self.data.isFollow == 1 ? 0 : 1;
      http.get(url, {beFocused: self.data.uid}).then(function (res) {
        // console.log(res)
        if (res.data.status == 200) {
          self.setData({
            isFollow: isFollow
          });
        }
      })
    })
   },

   cancelActivity: function () {
     let self = this;
     wx.showModal({
       title: '提示',
       content: '确定要取消该活动？',
       success: function (res) {
         if (res.confirm) {
           http.get('/activities/cancelActivities', {
             activityId: self.data.activityId
           }).then(function (res) {
             //  console.log(res);
             self.data.editHeart = true;
             if (res.data.status == 200) {
               wx.navigateBack({
                 delta: 1,
               })
             }
           })
         } else if (res.cancel) {
           console.log('用户点击取消')
         }
       },
     })
   },
   goSignupTotal: function (e) {
     let self = this;
     console.log(self.data.userInfo)
    app.getLogin(function(){
      let type = e.currentTarget.dataset.type;
      let url = '../signupTotal/signupTotal?type=0&id=' + self.data.activityId + '&withPeople=' + self.data.ActivitiesCondition.withPeople + '&max=' + self.data.Activities.participantsNum + '&chargeMode=' + self.data.Activities.chargeMode + '&priceMan=' + self.data.ActivitiesCondition.priceMan + '&priceWoman=' + self.data.ActivitiesCondition.priceWoman + '&registrationStatus=' + self.data.Activities.registrationStatus + '&needToPay=' + self.data.Activities.needToPay + '&participantsNum=' + self.data.Activities.participantsNum + '&usid=' + self.data.userInfo.MemberBasicInfo.id + '&isVip=' + self.data.ActivitiesCondition.isVip + '&vipPriceWoman=' + self.data.ActivitiesCondition.vipPriceWoman + '&vipPriceMan=' +  self.data.ActivitiesCondition.vipPriceMan
      if (type == 1) {
        url = '../signupTotal/signupTotal?type=1&id=' + self.data.activityId + '&withPeople=' + self.data.ActivitiesCondition.withPeople + '&time=' + self.data.Activities.registrationCancelTime + '&max=' + self.data.Activities.participantsNum + '&chargeMode=' + self.data.Activities.chargeMode + '&priceMan=' + self.data.ActivitiesCondition.priceMan + '&priceWoman=' + self.data.ActivitiesCondition.priceWoman + '&registrationStatus=' + self.data.Activities.registrationStatus + '&needToPay=' + self.data.Activities.needToPay + '&participantsNum=' + self.data.Activities.participantsNum + '&usid=' + self.data.userInfo.MemberBasicInfo.id + '&isVip=' + self.data.ActivitiesCondition.isVip + '&vipPriceWoman=' + self.data.ActivitiesCondition.vipPriceWoman + '&vipPriceMan=' +  self.data.ActivitiesCondition.vipPriceMan
      }
      wx.navigateTo({
        url: url
      })
    })
   },
   openMap: function (t) {
     let longitude = this.data.Activities.addressLongitude;
     let latitude = this.data.Activities.addressLatitude;
     this.selectComponent("#authorize").getAuthorizeLocation(function (t) {
       wx.openLocation({
         longitude: parseFloat(longitude),
         latitude: parseFloat(latitude)
       });
     });
   },
   makeCall: function () {
     let self = this;
     wx.makePhoneCall({
       phoneNumber: self.data.Activities.phoneNum
     })
   },

   makeWx: function () {
     let self = this;
     wx.setClipboardData({
       data: self.data.Activities.vxNum,
       success: function () {
         wx.showModal({
           title: "提示",
           content: "微信号已复制到剪切板",
           showCancel: !1,
           confirmText: "知道了"
         });
       }
     });
   },
   makeId:function(e){
     let id = e.currentTarget.dataset.id
    wx.setClipboardData({
      data: id,
      success: function () {
        wx.showModal({
          title: "提示",
          content: "微信号已复制到剪切板",
          confirmText: "知道了"
        });
      }
    });
   },

   /**
    * 生命周期函数--监听页面加载
    */
   onUnload: function () {
     let editHeart = this.data.editHeart;
     if (editHeart) {
       let pages = getCurrentPages();
       let prevPage = pages[pages.length - 2]; //上一级页面
       prevPage.reloadPage();
     }
   },
   onLoad: function (options) {
     console.log(options)
     let self = this;
     let id = options.id;
     if (options.scene) {
       let scene = decodeURIComponent(options.scene);
       id = scene;
     }
     app.getToken(function (res) {
       let user = app.getUserInfo();
       let userId = '';
       if (!app.isNull(user)) {
         userId = user.id;
       }
       self.setData({id,userId});
       self.initData();

       let token = wx.getStorageSync('token');
       if(token == '1204961653178908673'){
         self.setData({isqueen:true})
       }

     })
   },
   reloadPage: function () {
     let self = this;
    let user = app.getUserInfo();
    let userId = '';
    if (!app.isNull(user)) {
      userId = user.id;
    }
     self.setData({userId});
     this.data.editHeart = true;
     this.initData();
   },
   initData: function () {
     let self = this;
     let id = self.data.id;
     http.get('/activities/selectActivitiesById?id=' + id).then(function (res) {
       console.log(res);
       if (res.data.message != null) {
         let data = res.data.message
         if (data.Activities != null) {
           let time_diff = self.timer(data.Activities.registrationUptoTime);
           self.getUserInfo(data.Activities.uid);
           let isSelf = data.Activities.uid == self.data.userId ? true : false;
           data.Activities.setime = (util.timeSlot(data.Activities.activityStartTime,data.Activities.activityEndTime))
          //  data.Activities.activityStartTime = (util.formatStamp(data.Activities.activityStartTime)).time;
          //  data.Activities.activityEndTime = (util.formatStamp(data.Activities.activityEndTime)).time;

           data.Activities.registrationCancelTime = (util.formatStamp(data.Activities.registrationCancelTime)).time;
           self.setData({
            isSelf,
             Activities: data.Activities,
             time_diff: time_diff,
             uid: data.Activities.uid,
             activityId: data.Activities.id,
             isApply: data.Activities.isApply,
             registrationStatus: data.Activities.registrationStatus
           })

         }
         if (data.ActivitiesCondition != null) {
           self.setData({
             ActivitiesCondition: data.ActivitiesCondition
           })
         }
       }
     })
   },
   getUserInfo: function (id) {
     let self = this;
     http.get('/member/queryOne', {
       uid: id
     }).then(function (res) {
       console.log(res);
       let isFollow = res.data.message.MemberInfo.attention == true ? 1 : 0;
       self.setData({
         userInfo: res.data.message,
         isFollow: isFollow
       })
     })
   },

   saveImage:function(e){
     let self = this;
     let key = e.currentTarget.dataset.key;
     wx.previewImage({
      urls:[key],
      current:key,
      success:function(res){
        console.log(res)
      }
    })
   },

   onSelect: function (e) {
     // console.log(e.detail);
     let self = this;
     if (e.detail.name == '生成海报') {
       self.createPoster();
     } else {
       self.tapmMask();
     }
   },
   onShareAppMessage: function () {
     let self = this;
     let title = self.data.Activities.title;
    //  console.log(title)
     return {
       title: title,
       path: '/pages/activityDetail/activityDetail?id=' + self.data.id
     }
   },
   timer: function (str) {
     let diff = '';
     let time_diff = str - new Date().getTime();
     console.log(time_diff);
     if (time_diff < 0) {
       this.setData({
         disableUpload: false
       })
     }
     // 计算相差天数  
     let days = Math.floor(time_diff / (24 * 3600 * 1000));
     if (days > 0) {
       diff += days + '天';
     }
     // 计算相差小时数  
     let leave1 = time_diff % (24 * 3600 * 1000);
     let hours = Math.floor(leave1 / (3600 * 1000));
     if (hours > 0) {
       diff += hours + '小时';
     } else {
       if (diff !== '') {
         diff += hours + '小时';
       }
     }
     // 计算相差分钟数  
     let leave2 = leave1 % (3600 * 1000);
     let minutes = Math.floor(leave2 / (60 * 1000));
     if (minutes > 0) {
       diff += minutes + '分';
     } else {
       if (diff !== '') {
         diff += minutes + '分';
       }
     }
     // 计算相差秒数  
     //  let leave3 = leave2 % (60 * 1000);
     //  let seconds = Math.round(leave3 / 1000);
     //  if (seconds > 0) {
     //    diff += seconds + '秒';
     //  } else {
     //    if (diff !== '') {
     //      diff += seconds + '秒';
     //    }
     //  }

     return diff;
   },
   onEnshrine: function (e) {
    let self = this;
    let type = e.currentTarget.dataset.key;
    //  console.log(type);
    let enshrine = self.data.Activities.enshrine;
   //  console.log(enshrine, !enshrine);
    let url = '/activities/enshrine';
    if (type) {
      url = '/activities/cancelEnshrine'
    }
    let params = {
      activityId: self.data.activityId
    }
    //  console.log(params)
    http.get(url, params).then(function (res) {
      //  console.log(res);
      self.data.editHeart = true;
      if (res.data.status == 200) {
        self.setData({
          "Activities.enshrine": !enshrine
        });
      }
    })
  },

 })