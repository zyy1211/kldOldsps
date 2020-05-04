//index.js
//获取应用实例
let util = require('../../utils/util');
let QQMapWX = require('../../utils/qqmap-wx-jssdk.js');
let Api = require('../../utils/config');
let http = require('../../utils/request.js');
let App = getApp();
Page({
  data: {
    dataList: [],
    address: '定位中',
    isqueen:false,
    time: '',
    distance: 99999,
    type: -1,
    chargeModel: -1,
    pageNum: 1,
    pageSize: 10,
    total: 0,
    optionsDate: [{
      text: '全部日期',
      value: ''
    }],
    addressList: [{
      text: '全部位置',
      value: 99999
    }, {
      text: '附近',
      value: 3
    }, {
      text: '10KM',
      value: 10
    }, {
      text: '20KM',
      value: 20
    }],
    selectMoney: [{
      text: '全部价格',
      value: -1,
    }, {
      text: '免费',
      value: 0,
    }, {
      text: '线上收费',
      value: 1,
    }, {
      text: '线下收费',
      value: 2,
    }],
    selectType: [{
      text: '全部类型',
      value: -1
    }],
  },
  onLoad: function(option) {
    let self = this;
    App.getToken(function() {
      self.getDate();
      self.getType();
      self.initPageLogin();
    });

  },

  // 时间
  getDate: function() {
    let self = this;
    let optionsDate = self.data.optionsDate;
    for (let i = 0; i < 4; i++) {
      let dateObj = JSON.parse(util.GetDateStr(i))
      optionsDate.push(dateObj);
    }
    self.setData({
      optionsDate: optionsDate,
    });
  },
  // 类型
  getType: function() {
    let self = this;
    let typeList = wx.getStorageSync('activityType');
    if (typeList) {
      self.setData({
        typeList: JSON.parse(typeList)
      });
      self.formatTypeList(self.data.typeList);
      // console.log(self.data.typeList)
      return;
    };
    http.get('/sports/types').then(function(res) {
      console.log(res);
      if (res.data.message != null) {
        self.setData({
          typeList: res.data.message.types
        });
        self.formatTypeList(self.data.typeList);
        wx.setStorageSync('activityType', JSON.stringify(res.data.message.types));
      }
    })
  },
  formatTypeList: function(list) {
    // console.log(list)
    let self = this;
    let selectType = self.data.selectType;
    list.forEach(item => {
      item.sportsNames.forEach(type => {
        let obj = {
          text: type.sportName,
          value: type.id
        }
        selectType.push(obj)
      })
    });
    self.setData({
      selectType: selectType
    })
  },
  // 位置
  getLocationName: function(t) {
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
    self.getListData(0);
    map.reverseGeocoder({
      location: {
        latitude: latitude,
        longitude: longitude
      },
      success: function(t) {
        // console.log(t)
        let address = t.result.formatted_addresses.recommend;
        self.setData({
          address: address
        })
      },
      fail: function(e) {
        console.log(e)
      }
    });
  },
  toDetail: function(e) {
    let id = e.currentTarget.dataset.id;
    App.isToDetail(function() {
      wx.navigateTo({
        url: '../activityDetail/activityDetail?id=' + id,
      })
    })
  },
  follow: function(e) {
    let self = this;
    App.getLogin(function() {
      let id = e.currentTarget.dataset.id;
      let index = e.currentTarget.dataset.index;
      let url = '/activities/enshrine';
      if (e.currentTarget.dataset.key == 1) {
        url = '/activities/cancelEnshrine'
      };
      self.enshrine(url, id, index);
    });

  },
  enshrine: function(url, id, index) {
    let self = this;
    let params = {
      activityId: id
    }
    let enshrine = self.data.dataList[index].enshrine;
    let keys = 'dataList[' + index + '].enshrine';
    http.get(url, params).then(function(res) {
      if (res.data.status == 200) {
        self.setData({
          [keys]: !enshrine
        })
      }
    })
  },
  reloadPage: function() {

    this.setData({
      pageNum:1
    })
    this.getListData(0);
  },

  onReachBottom: function() {
    console.log('触底');
    if (this.data.dataList.length == this.data.total) {
      return;
    }
    let pageNum = (this.data.pageNum) + 1;
    this.setData({pageNum})
    this.getListData();
  },

  tabsChange: function(e) {
    let self = this;
    let key = e.currentTarget.dataset.key;
    self.setData({
      [key]: e.detail
    });
    let time = self.data.time;
    let distance = self.data.distance;
    let chargeModel = self.data.chargeModel;
    let type = self.data.type;
    self.setData({
      time,
      distance,
      chargeModel,
      type,
      pageNum: 1,
      pageSize: 10
    })
    this.getListData(0);
  },

  // 列表
  getListData: function(isConcat) {
    let self = this;
    let {time,distance,chargeModel,type,pageNum,pageSize,latitude,longitude} = this.data;
    http.get('/activities/selectActivities', {time,distance,chargeModel,type,pageNum,pageSize,
      latitude,
      longitude
    }).then(function(data) {

      if (data.data.status != 200 || App.isNull(data.data.message)) {
        data.data.message = {
          records: []
        };
      }
      let records = data.data.message.records;
      records.forEach((item,index,arr) =>{
        // console.log(item)
        item.setime = (util.timeSlot(item.activityStartTime,item.activityEndTime))
      })
      let dataList;
      if (isConcat == 0) {
        dataList = records;
      } else {
        dataList = self.data.dataList.concat(records);
      }
      let token = wx.getStorageSync('token');
      if(token == '1204961653178908673'){
        self.setData({isqueen:true})
      }
      self.setData({
        dataList: dataList,
        total: data.data.message.total
      });
    })
  },
  toAddress: function() {
    let self = this;
    wx.navigateTo({
      url: '/pages/address/address?address=' + self.data.address,
    })
  },
  onPullDownRefresh: function() {
    this.initPageLogin();
    wx.stopPullDownRefresh();
  },
  onShareAppMessage: function() {
    return {
      title: '栎刻动体育活动列表',
      path: 'pages/activityList/index',
      success: function(res) {
        console.log(res)
      }
    }
  },
  initPageLogin: function() {
    let self = this;
    this.selectComponent("#authorize").getAuthorizeLocation(self.getLocationName);
  },
  // 防止穿透
  _touchmove: function() {}

})