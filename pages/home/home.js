//index.js
//获取应用实例
let util = require('../../utils/util');
let QQMapWX = require('../../utils/qqmap-wx-jssdk.js');
let Api = require('../../utils/config');
let http = require('../../utils/request.js');
let App = getApp();

Page({
  data: {
    value: '',
    typeList: [],
    dataList: [],
    dataList1: [],
    apiImg: Api.img_host,
    ihidden: true,
    banner1:Api.cvs_img +'/20200430/4d502c37e1fcdade4207be92c5bdd733.png',
    banner2:Api.cvs_img +'/20200430/1647fc15194fe420ba00509a6d85ba6e.png',
    bannerData:[],
  },

  toLanjue: function () {
    wx.navigateToMiniProgram({
      appId: 'wx74d68057620f067c', //小程序appid
      path: 'pages/cateGory/index', //跳转关联小程序app.json配置里面的地址
      extraData: { //需要传递给目标小程序的数据，目标小程序可在 App.onLaunch()，App.onShow() 中获取到这份数据。
        bannerUrl: '1'
      },
      //**重点**要打开的小程序版本，有效值 develop（开发版），trial（体验版），release（正式版） 
      envVersion: 'release',
      success(res) {
        // 打开成功
      }
    })
  },
  toActivityList: function () {
    wx.navigateTo({
      url: '../activityList/index'
    })
  },
  toActivityDetail:function(e){
    let url = e.currentTarget.dataset.url
    wx.navigateTo({
      url: url,
    })
  },

  toGzh: function () {
    wx.navigateTo({
      url: '../webviews/webviews'
    })
  },

  onLoad: function () {
    let self = this;
    App.getToken(function () {
      self.getTypeList();
      self.initPageLogin();
      self.getBnner();
    })

    // this.selectComponent('#pst').getPst();


    // setTimeout(() => {
    //   wx.navigateTo({
    //     url: '../myAccount/myAccount',
    //     success: function(res){
    //       // success
    //     },
    //     fail: function() {
    //       // fail
    //     },
    //     complete: function() {
    //       // complete
    //     }
    //   })
    // }, 600);

  },
  getBnner:function(){
    let self = this;
    http.get('/activities/queryBanner','').then(function(res){
      console.log(res);
      if(res.data.status == 200){
        self.setData({
          bannerData:res.data.message
        })
      }
    })
  },
  initPageLogin: function () {
    let self = this;
    this.selectComponent("#authorize").getAuthorizeLocation(self.getLocationName);
  },
  // 位置
  getLocationName: function (t) {
    var self = this;
    let map = new QQMapWX({
      key: Api.QQmapsdkKey
    });
    let latitude = t.latitude || Api.latitude;
    let longitude = t.longitude || Api.longitude;
    self.setData({
      latitude: latitude,
      longitude: longitude
    })
    self.getListData();
    self.getListData1();
  },
  // 列表
  getListData: function () {
    let self = this;
    let {
      latitude,
      longitude
    } = this.data;
    let params = {
      time: '',
      distance: 99999,
      chargeModel: -1,
      type: -1,
      pageNum: 1,
      pageSize: 10,
      latitude: latitude,
      longitude: longitude
    }
    http.get('/activities/selectActivities', params).then(function (data) {
      if (data.data.status != 200 || App.isNull(data.data.message)) {
        data.data.message = {
          records: []
        };
      }
      let records = data.data.message.records;
      records.forEach((item, index, arr) => {
        // console.log(item)
        item.setime = (util.timeSlot(item.activityStartTime, item.activityEndTime))
      })
      let dataList = records;
      dataList = dataList.slice(0, 3);
      self.setData({
        dataList: dataList,
      });
    })
  },

  getListData1: function () {
    let self = this;
    let params = {
      pageNum: 1,
      pageSize: 10,
    }
    http.get('/competition/queryAllDetails', params).then(function (data) {
      if (data.data.status != 200 || App.isNull(data.data.message)) {
        data.data.message = {
          records: []
        };
      }
      let records = data.data.message.records;
      records.forEach((item, index, arr) => {
        // console.log(item)
        item.setime = (util.timeSlot(item.beginTime, item.endTime))
      })
      let dataList = records;
      dataList = dataList.slice(0, 3);
      self.setData({
        dataList1: dataList,
      });
    })
  },

  // 获取下拉框数据
  getTypeList: function () {
    let self = this;
    http.get('/stadium/index/sportType').then(function (res) {
      // console.log(res);
      if (res.data.message != null) {
        let datas = res.data.message;
        datas = datas.slice(0, 7);
        self.setData({
          typeList: datas,
        });
        // console.log(self.data.typeList)
      }
    })
  },
  // 详情
  toVenuesList: function (e) {
    let key = e.currentTarget.dataset.key;
    if (key != -1) {
      wx.navigateTo({
        url: '../venuesList/venuesList?sportType=' + key,
      })

    } else {
      wx.navigateTo({
        url: '../allBalls/allBalls'
      })
    }
  },
  toActiveList: function () {
    wx.navigateTo({
      url: '../activityList/index',
    })
  },
  toGameList: function () {
    wx.navigateTo({
      // url: '/gamePages/pages/venuesDetail/venuesDetail',
      url: '/gamePages/pages/gameList/gameList',
      // url: '/gamePages/pages/gamePageList/gamePageList?cid=42',
      // url: '/gamePages/pages/g_issue/g_issue?id=60',
      // url: '/gamePages/pages/gameList/gameList',
      // url: '/gamePages/pages/gameDetail/gameDetail?id=4',
      // url: '/gamePages/pages/add_single/add_single',
      // url: '/gamePages/pages/add_group/add_group',
      // url: '/gamePages/pages/component/addTag/addTag',
    })
  },
  toDetail: function (e) {
    let id = e.currentTarget.dataset.id;
    App.isToDetail(function () {
      wx.navigateTo({
        url: '../activityDetail/activityDetail?id=' + id,
      })
    })
  },
  toDetail1: function (e) {
    let id = e.currentTarget.dataset.cid;
    wx.navigateTo({
      // url: '../gamePageList/gamePageList?cid=' + cid,
      url: '/gamePages/pages/gameDetail/gameDetail?id=' + id,
    })
  },

  onShareAppMessage: function () {
    return {
      title: '栎刻动体育',
      path: 'pages/home/home',
      success: function (res) {
        console.log(res)
      }
    }
  },
  onPullDownRefresh: function () {
    let self = this;
    self.getTypeList();
    self.initPageLogin();
    setTimeout(() => {
      wx.stopPullDownRefresh();
    }, 300);
  },
  // onReachBottom:function(){
  //   this.setData({
  //     ihidden:false
  //   })
  // },
  // onPageScroll:function(e){
  //   console.log(e);
  //   let self  = this;
  //   if(e.scrollTop<500){
  //     self.setData({
  //       ihidden:true
  //     })
  //   }
  // }

})