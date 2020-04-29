// pages/venuesList/venuesList.js
let util = require('../../utils/util');
let Api = require('../../utils/config');
let http = require('../../utils/request.js');
let App = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    selectType: [{
      text: '距离最近',
      value: '',
    }],
    select: '',
    optionsDate: [{
        text: '全部地区',
        value: ''
      },
      {
        text: '上城区',
        value: '上城区'
      },
      {
        text: '下城区',
        value: '下城区'
      },
      {
        text: '江干区',
        value: '江干区'
      },
      {
        text: '拱墅区',
        value: '拱墅区'
      },
      {
        text: '西湖区',
        value: '西湖区'
      },
      {
        text: '滨江区',
        value: '滨江区'
      },
      {
        text: '萧山区',
        value: '萧山区'
      },
      {
        text: '余杭区',
        value: '余杭区'
      },
      {
        text: '桐庐县',
        value: '桐庐县'
      },
      {
        text: '淳安县',
        value: '淳安县'
      },
      {
        text: '建德市',
        value: '建德市'
      },
      {
        text: '富阳区',
        value: '富阳区'
      },
      {
        text: '临安市',
        value: '临安市'
      },
    ],
    addr: '',
    typeList: [{
      text: '全部类型',
      value: ''
    }],
    sportType: '',
    longitude: '',
    latitude: '',
    distance: '10000',
    pageSize: 10,
    pageNum: 1,
    dataList: [],
    apiImg:Api.img_host
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.initPageLogin();
    this.getTypeList();
    if(options.sportType){
      this.setData({
        sportType:options.sportType
      })
    }
  },

  tabsChange: function (e) {
    console.log(e);
    let self = this;
    let key = e.currentTarget.dataset.key;
    self.setData({
      [key]: e.detail
    });
    let {addr,sportType} = this.data;
    self.setData({
      addr,
      sportType,
      pageNum: 1,
      pageSize: 10
    })
    this.getInit(0);
  },
  toDetail:function(e){
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../venuesDetail/venuesDetail?id=' + id,
    })
  },
  // 获取列表
  getInit: function (isConcat) {
    let self= this;
    let {
      sportType,
      addr,
      longitude,
      latitude,
      distance,
      pageSize,
      pageNum
    } = this.data;
    let params = {
      sportType,
      addr,
      longitude,
      latitude,
      distance,
      pageSize,
      pageNum
    }
    // console.log(params);
    http.get('/stadium/queryAllDetails', params).then(function (data) {
      console.log(data);
      if (data.data.status != 200 || App.isNull(data.data.message)) {
        data.data.message = {
          records: []
        };
      }
      let records = data.data.message.records;
      let dataList;
      if (isConcat == 0) {
        dataList = records;
      } else {
        dataList = self.data.dataList.concat(records);
      }
      self.setData({
        dataList: dataList,
        total: data.data.message.total
      });
      console.log(self.data.dataList)
    })
  },
  // 获取下拉框数据
  getTypeList: function () {
    let self = this;
    http.get('/stadium/sportType').then(function (res) {
      // console.log(res);
      if (res.data.message != null) {
        let datas = res.data.message;
        let newData = datas.map((item) => {
          let obj = {
            text: item,
            value: item
          };
          return obj;
        })
        self.setData({
          typeList: [...self.data.typeList, ...newData],
        });
      }
    })
  },
  // 获取经纬度
  initPageLogin: function () {
    let self = this;
    this.selectComponent("#authorize").getAuthorizeLocation(self.getLocationName);
  },
  getLocationName: function (e) {
    // console.log(e);
    this.setData({
      latitude: e.latitude,
      longitude: e.longitude
    });
    this.getInit(0);
  },
  // 下拉刷新
  onPullDownRefresh: function() {
    this.initPageLogin();
    setTimeout(() => {
      wx.stopPullDownRefresh();
    }, 300);
  },
  // 上啦加载
  onReachBottom: function() {
    console.log('触底');
    if (this.data.dataList.length == this.data.total) {
      return;
    }
    let pageNum = (this.data.pageNum) + 1;
    this.setData({pageNum})
    this.getInit();
  },
  // 防止穿透
  _touchmove: function () {}
})