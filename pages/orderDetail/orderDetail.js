let http = require('../../utils/request');
let API = require('../../utils/config.js');
let util = require('../../utils/util');
let app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    sceneId: -1,
    timeLeft: '',
    disabled: false,
    myCardId: '',
    endTotal:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let self = this;
    let sceneId = options.sceneId;
    // sceneId = '1247759782192451586';
    this.setData({
      sceneId: sceneId
    });
    this.initData();
    app.watch(this, {
      myCardId: function (newVal) {
        console.log(newVal)
        console.log(self.data.cardObj);
        let obj = self.data.cardObj;
        console.log(self.data.order);
        if (obj.cardType == '次数卡') {
          let list = self.data.order.sceneDesc.length;
          console.log(list)

          self.setData({
            endTotal: list + '次'
          })
        } else if (obj.cardType == '折扣卡') {
          let content = obj.discount.length == 2 ? (parseInt(obj.discount) / 100) : (parseInt(obj.discount) / 10)
          console.log(content)
          console.log(self.data.order.total)
          let money = (self.data.order.scene.price * content).toFixed(2)

          self.setData({
            endTotal: money
          })

        } else if (obj.cardType == '充值卡') {
          let list = self.data.order.sceneDesc.length;
          let content = obj.discount;
          console.log(list)
          console.log(content)
          let money = (list * content).toFixed(2);
          console.log(money)
          self.setData({
            endTotal: money
          })
          console.log(self.data.endTotal)

        }
      }
    })

  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
   
  },
  onUnload: function () {
    console.log('fs')
    app.globalData.isreload = 1;
  },
  onHide: function () {
    console.log('fs')
    app.globalData.isreload = 1;
  },

  toCard: function (res) {
    let order = this.data.order;
    order.sceneDesc.forEach(item => {
      console.log(item)
      item['time'] = item.showDate.substring(item.showDate.length - 11);
    })
    let local = {
      type: order.sceneDesc[0].sportType,
      days: {
        days: new Date(order.sceneDesc[0].showDate).getTime(),
        week: order.week,
      },
      reLists: order.sceneDesc
    }
    wx.setStorageSync('order', JSON.stringify(local))


    let sid = this.data.order.scene.sid
    wx.navigateTo({
      url: '../myCard/myCard?sid=' + sid,
    })
  },
  initData: function () {
    let self = this;
    let {
      sceneId
    } = this.data;
    http.get('/stadium/queryOrderBySceneId', {
      sceneId
    }).then(function (res) {
      // console.log(res)
      if (!app.isNull(res.data.message)) {
        let expand = 0;
        if (!app.isNull(res.data.message.scene.expand)) {
          expand = res.data.message.scene.expand;
        }
        let endTotal = res.data.message.scene.price;
        self.setData({
          order: res.data.message,
          endTotal
        })
        self.data.timer = setInterval(() => {
          self.setData({
            timeLeft: util.getTimeLeft(expand),
            expand: expand
          });
          expand--;
          if (self.data.timeLeft == "0分0秒") {
            console.log('clear')
            clearInterval(self.data.timer);
          }
        }, 1000);
      };
    });
  },
  cancel: function () {
    let self = this;
    let {
      sceneId
    } = this.data;
    http.get('/stadium/cancelReserve', {
      sceneId
    }).then(function (res) {
      console.log(res);
      if (res.data.status == 200) {
        self.initData();
      }
    })
  },
  submit: function (res) {
    let self = this;
    let {
      sceneId
    } = this.data;
    self.setData({
      disabled: true
    })
    setTimeout(() => {
      self.setData({
        disabled: false
      })
    }, 2000);
    http.post('/stadium/repayReserve', {
      sceneId
    }).then(function (res) {
      if (res.data.status == 200) {
        // self.initData();
        self.wxPay(res.data.message)
      }
    })
  },
  // submit_card:function(){
  //   let self = this;
  //   if (app.isNull(myCardId)) {
  //     return wx.showToast({
  //       title: '请选择会员卡',
  //       icon: 'none'
  //     })
  //   }
  //   let {
  //     sceneId
  //   } = this.data;
  //   http.post('/repayCardReserve',{sceneId}).then(function(res){
  //     if (res.data.status == 200) {
  //       self.paySuccess();
  //     }
  //   })
  // },


  //微信支付
  wxPay: function (data) {
    var that = this;
    console.log(data);
    let {
      order
    } = that.data;
    let {
      timeStamp,
      paySign,
      appId,
      sceneId,
      signType,
      nonceStr
    } = data;
    this.setData({
      sceneId
    });
    let package1 = data.package;
    wx.requestPayment({
      timeStamp: timeStamp,
      nonceStr: nonceStr,
      package: package1,
      signType: signType,
      paySign: paySign,
      success(res) {
        that.paySuccess();
        wx.redirectTo({
          url: '../venuesDetail/venuesDetail?id=' + order.scene.sid
        })
      },
      fail(res) {
        wx.showToast({
          title: '订单未支付',
          icon: 'none',
          duration: 1000
        });
        that.initData();
      },
    })
  },

  paySuccess: function (data) {
    let {
      sceneId
    } = this.data;
    console.log(sceneId);
    http.get('/stadium/paySuccess', {
      sceneId
    }).then(function (res) {
      console.log(res)
    })
  },



})