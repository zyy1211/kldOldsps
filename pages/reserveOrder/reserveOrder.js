let http = require('../../utils/request');
let API = require('../../utils/config.js');
let util = require('../../utils/util');
let app = getApp();
Page({
  data: {
    order: {},
    myCardId: '',
  },


  submit_card: function () {
    let self = this;
    console.log(this.data.order)
    let phone = this.data.order.phone;
    console.log(this.data.order);
    let date = this.data.order.days.time;
    let sid = this.data.order.detailData.id;
    let sportType = this.data.order.type;
    let scene = this.data.order.reLists;
    let myCardId = this.data.myCardId;
    let url = '/stadium/reserveByCard/' + myCardId + '?phone=' + phone + '&date=' + date + '&sid=' + sid + '&sportType=' + sportType;
    let params = {
      scene
    };
    if (app.isNull(myCardId)) {
      return wx.showToast({
        title: '请选择会员卡',
        icon: 'none'
      })
    }
    wx.showModal({
      title: '提示',
      content: '确定使用会员卡支付？',
      success: function (res) {
        if (res.confirm) {
          http.post(url, params, 1).then(function (res) {
            console.log(res);
            if (res.data.status == 200) {
              self.paySuccess(res.data.message);
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      },
    })
  },

  submit: function () {

    let self = this;
    console.log(this.data.order)
    let phone = this.data.order.phone;
    console.log(this.data.order);
    let date = this.data.order.days.time;
    let sid = this.data.order.detailData.id;
    let sportType = this.data.order.type;
    let scene = this.data.order.reLists;
    let url = '/stadium/reserve?phone=' + phone + '&date=' + date + '&sid=' + sid + '&sportType=' + sportType;
    let params = {
      scene
    };
    http.post(url, params, 1).then(function (res) {
      console.log(res);
      if (res.data.status == 200) {
        self.wxPay(res.data.message)
      }
    })
  },

  //微信支付
  wxPay: function (data) {
    var that = this;
    let {
      order
    } = that.data;
    console.log(data);
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
      },
      fail(res) {
        // wx.showToast({
        //   title: '订单未支付',
        //   icon: 'none',
        //   duration: 1000
        // });
        wx.redirectTo({
          url: '../orderDetail/orderDetail?sceneId=' + sceneId
        })
      },
    })
  },

  paySuccess: function (data) {
    let that = this;
    let {
      sceneId
    } = this.data;
    if (data) {
      sceneId = data;
    }
    let {
      order
    } = that.data;
    console.log(sceneId);
    http.get('/stadium/paySuccess', {
      sceneId
    }).then(function (res) {
      console.log(res)
      wx.redirectTo({
        url: '../venuesDetail/venuesDetail?id=' + order.detailData.id
      })
    })
  },

  toCard: function (res) {
    let sid = this.data.order.detailData.id
    wx.navigateTo({
      url: '../myCard/myCard?sid=' + sid,
    })
  },



  onLoad: function (options) {
    let self = this;
    let order = JSON.parse(wx.getStorageSync('order'));
    console.log(wx.getStorageSync('order'));
    let endTotal = order.total;
    this.setData({
      order: order,
      endTotal
    });

    app.watch(this, {
      myCardId: function (newVal) {
        console.log(newVal)
        console.log(self.data.cardObj);
        let obj = self.data.cardObj;
        if(obj.cardType == '次数卡' ){
          let list = self.data.order.reLists.length;
          console.log(list)

          self.setData({
            endTotal: list + '次'
          })
        }else if(obj.cardType == '折扣卡'){
          let content = obj.discount.length == 2 ? (parseInt(obj.discount)/100) : (parseInt(obj.discount)/10)
          console.log(content)
          console.log(self.data.order.total)
          let money = (self.data.order.total * content).toFixed(2)

          self.setData({
            endTotal:money
          })

        }else if(obj.cardType == '充值卡'){
          let list = self.data.order.reLists.length;
          let content = obj.discount;
          console.log(list)
          console.log(content)
          let money = (list * content).toFixed(2);
          self.setData({
            endTotal:money
          })

        }
      }
    })

  },


})