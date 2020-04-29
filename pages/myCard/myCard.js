let http = require('../../utils/request');
let API = require('../../utils/config.js');
let util = require('../../utils/util');
let app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    cardList: [],
    timeOutCard: [],
    activeNames: [''],
    weekaend: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
    dayTime: ['07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00', '24:00'],
    myCardId: '',
  },

  onPullDownRefresh: function () {
    let self = this;
    let {
      sid
    } = this.data;
    if (app.isNull(sid)) {
      self.getCardList()
    } else {
      self.getCard()
    }

    setTimeout(() => {
      wx.stopPullDownRefresh();
    }, 300);
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let self = this;
    let sid = options.sid;
    console.log(sid)
    if (app.isNull(sid)) {
      this.setData({
        sid: ''
      });
      this.getCardList();
      return;
    }
    let order = JSON.parse(wx.getStorageSync('order'));
    this.setData({
      order,
      sid
    })
    self.getCard()
  },
  getCardList: function () {
    let self = this;
    http.get('/card/myCardList').then(function (res) {
      console.log(res);
      if (res.data.status == 200) {
        let message = res.data.message.inUseCardList;
        let timeOutCard = res.data.message.timeOutCardList;
        message.forEach(item => {
          if (item.effectiveType == 1) {
            // item['expirationStart'] = util.formatStamp(item.expirationStartDate).date;
            item['expirationEnd'] = util.formatStamp(item.expirationEndDate).date;
          }
        })
        timeOutCard.forEach(item => {
          if (item.effectiveType == 1) {
            // item['expirationStart'] = util.formatStamp(item.expirationStartDate).date;
            item['expirationEnd'] = util.formatStamp(item.expirationEndDate).date;
          }
        })


        self.setData({
          cardList: message,
          timeOutCard
        })
      }
    })
  },
  getCard: function () {
    let self = this;
    let {
      sid,
      weekaend,
      dayTime,
      order
    } = self.data;
    http.get('/card/myCardList', {
      sid,
      sportType: order.type

    }).then(function (res) {
      console.log(res);
      if (res.data.status == 200) {
        let message = res.data.message.inUseCardList;
        let timeOutCard = res.data.message.timeOutCardList;
        timeOutCard.forEach(item => {
          if (item.effectiveType == 1) {
            // item['expirationStart'] = util.formatStamp(item.expirationStartDate).date;
            item['expirationEnd'] = util.formatStamp(item.expirationEndDate).date;
          }
        })
        message.forEach(item => {
          let weekStart = weekaend.indexOf(item.useDate.split('~')[0]);
          let weekEnd = weekaend.indexOf(item.useDate.split('~')[1]);
          let timeStart = dayTime.indexOf(item.useTime.split('-')[0]);
          let timeEnd = dayTime.indexOf(item.useTime.split('-')[1]);
          let optionWeek = weekaend.slice(weekStart, weekEnd + 1);
          let optionTime = dayTime.slice(timeStart, timeEnd + 1);
          item['expirationEnd'] = util.formatStamp(item.expirationEndDate).date;
          item['able'] = 'true';
          item['optionWeek'] = optionWeek;
          item['optionTime'] = optionTime;

        })
        self.valid(message, timeOutCard);

      }
    })
  },
  valid: function (message, timeOutCard) {
    let self = this;
    let order = this.data.order;
    let days = order.days.days;
    let week = order.days.week;
    let reLists = order.reLists;
    let time = [];
    reLists.forEach(item => {
      time = time.concat(item.time.split('-'))
    })

    message.forEach(item => {
      let expirationEndDate = item.expirationEndDate;
      if (days > expirationEndDate) {
        item.able = "false"
        return;
      }
      if (item.optionWeek.indexOf(week) == -1) {
        console.log('fassfsf')
        item.able = "false"
        return;
      }
      console.log(time)
      console.log(item.optionTime)
      var mix = time.filter(function (fil) {
        return item.optionTime.indexOf(fil) == -1
      });
      console.log(mix)
      if (mix.length > 0) {
        item.able = 'false'
      }
    })
    console.log(message);
    self.setData({
      cardList: message,
      timeOutCard
    })
  },

  chooseCard: function (e) {
    let sid = this.data.sid;
    let out = e.currentTarget.dataset.out;
    if (app.isNull(sid)) {
      let item = e.currentTarget.dataset.item;
      app.setCardDetail(item);
      wx.navigateTo({
        url: '../myCardDetail/myCardDetail',
      })
      return;
    }
    if (out == 1) {
      return;
    }
    let myCardId = e.currentTarget.dataset.mycardid;
    let able = e.currentTarget.dataset.able;
    let item = e.currentTarget.dataset.item;
    if (able == 'false' || item.cardType == '固定场次卡') {
      return;
    }
    console.log(myCardId)
    this.setData({
      myCardId: myCardId
    })
    let pages = getCurrentPages();
    let prevPage = pages[pages.length - 2];
    prevPage.setData({
      cardObj: item,
      myCardId: myCardId
    })
    wx.navigateBack({
      delta: 1, // 回退前 delta(默认为1) 页面
    })
  },

  onChange(event) {
    this.setData({
      activeNames: event.detail
    });
  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },



  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})