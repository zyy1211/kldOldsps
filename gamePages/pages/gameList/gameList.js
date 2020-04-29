let http = require('../../../utils/request.js');
let API = require('../../../utils/config.js');
let App = getApp();
let util = require('../../../utils/util');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataList: [],
    total: 0,
    pageNum: 1,
    pageSize: 10,
    img_host: API.img_host,
    api: API.img_host,
    url:'/competition/queryAllDetails',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.getListData(0);
  },
  onShow:function(){
    this.getListData(0);
  },

  getListData: function (isConcat) {
    let self = this;
    let { pageNum,pageSize,url } = this.data;
    // console.log(url)
    http.get(url, { pageNum,pageSize }).then(function (data) {
      console.log(data);
      if (data.data.status != 200) {
        data.data.message = {
          records:[]
        };
      }
      if (data.data.message == null) {
        data.data.message =  {
          records:[]
        };
      }
      let records = data.data.message.records;
      records.forEach((item,index,arr) =>{
        item.setime = (util.timeSlot(item.beginTime,item.endTime))
      })
      let dataList = records;
      if (isConcat == 0) {
        dataList = records;
      } else {
        dataList = self.data.dataList.concat(records);
      }
      self.setData({
        dataList: dataList,
        total: data.data.message.total
      });
    })
  },

  onPullDownRefresh: function () {
    wx.stopPullDownRefresh();
    this.reloadPage();
  },
  reloadPage: function () {
    this.setData({
      pageNum: 1,
      total:0,
    });
    this.getListData(0);
  },

  toDetail: function (e) {
    let id = e.currentTarget.dataset.cid;
    wx.navigateTo({
      // url: '../gamePageList/gamePageList?cid=' + cid,
      url: '../gameDetail/gameDetail?id=' + id,
    })
  },

  onReachBottom: function () {
    console.log('触底');
    if (this.data.dataList.length == this.data.total) {
      return;
    }
    let pageNum = (this.data.pageNum) + 1;
    this.setData({
      pageNum: pageNum
    });
    this.getListData();
  },

})