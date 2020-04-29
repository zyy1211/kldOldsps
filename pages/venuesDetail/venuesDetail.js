// pages/venuesDetail/venuesDetail.js
let http = require('../../utils/request');
let API = require('../../utils/config.js');
let util = require('../../utils/util');
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detailData: {},
    type: '',
    date: '',
    place: [],
    reLists: [],
    reListsId: [],
    apiImg: API.img_host,
    left: 0,
    top: 0,
    cardList: [],
    isFlag: false,
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
    this.selectComponent('#getPoster').getPst();
  },
  onSelect: function (e) {
    // console.log(e.detail);
    let self = this;
    if (e.detail.name == '生成海报') {
      app.setVenuCvs(self.data.detailData)
      self.createPoster();
    } else {
      self.tapmMask();
    }
  },

  onShow: function () {
    let isreload = app.globalData.isreload;
    if (isreload != 0) {
      this.initData();
      this.setData({
        reListsId: [],
        reLists: []
      })
    }
  },


  onUnload: function () {
    app.globalData.isreload = 0;
  },
  onHide: function () {
    app.globalData.isreload = 0;
  },

  scroll: function (e) {
    var that = this;
    that.setData({
      left: e.detail.scrollLeft,
      top: e.detail.scrollTop
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onPullDownRefresh: function () {
    let self = this;
    self.initData();
    self.getCard();
    setTimeout(() => {
      wx.stopPullDownRefresh();
    }, 300);
  },
  onLoad: function (options) {
    // console.log(options);
    let self = this;
    let id = options.id;


    if (options.scene) {
      // console.log(options)
      let scene = decodeURIComponent(options.scene);
      id = scene;
    }
    app.getToken(function (res) {
      let user = app.getUserInfo();
      let userId = '';
      if (!app.isNull(user)) {
        userId = user.id;
      }
      self.setData({
        id,
        userId
      });
      // console.log({
      //   id,
      //   userId
      // });
      self.initData();
      self.getCard();
    })
  },
  getCard: function () {
    let self = this;
    let sid = this.data.id;
    http.get('/card/type', {
      sid
    }).then(function (res) {
      // console.log(res);
      if (res.data.status == 200) {
        self.setData({
          cardList: res.data.message
        })
      }
    })
  },
  // 羽毛球、篮球
  changeType: function (e) {
    // console.log(e)
    let key = e.currentTarget.dataset.key;
    let days = e.currentTarget.dataset.days || this.data.days;
    let value = e.currentTarget.dataset.value;
    // console.log(days);
    this.setData({
      [key]: value,
      days: days,
      reLists: [],
      reListsId: []
    });

    this.queryByTypeAndDate();
  },
  // 选择场地
  choisePlace: function (e) {
    // console.log(e);
    let self = this;
    app.getLogin(function (res) {
      let {
        reLists,
        reListsId
      } = self.data;
      let item = e.currentTarget.dataset.item;
      let index = e.currentTarget.dataset.index;
      let ids = e.currentTarget.dataset.ids;
      let id = e.currentTarget.dataset.id;
      let sname = e.currentTarget.dataset.sname;
      let father = e.currentTarget.dataset.father;
      // console.log(father);
      // console.log(ids);
      let keys = 'place[' + index + '].desc[' + ids + '].canChoose';
      // console.log(keys)
      let value = (self.data.place[index].desc)[ids].canChoose
      let indexof = reListsId.indexOf(item.indexof);

      if (reLists.length >= 8 && item.canChoose == false) {
        return wx.showToast({
          title: '最多选择8个场地！',
          icon: 'none'
        })
      }
      let jointly;
      if (ids > 10) {
        let isJointly = ids % 2;
        let isKeys;
        let isin;
        let someArr = [];
        let someArrIds = [];
        if (isJointly == 1) {
          jointly = father[ids + 1];
          isKeys = 'place[' + index + '].desc[' + (parseInt(ids) + 1) + '].canChoose';
          isin = (indexof);
          someArrIds = [item.indexof, jointly.indexof];
          someArr = [{
            ...item,
            sname,
            id
          }, {
            ...jointly,
            sname,
            id
          }];

        } else {
          jointly = father[ids - 1];
          isKeys = 'place[' + index + '].desc[' + (parseInt(ids) - 1) + '].canChoose';
          isin = (indexof - 1)
          someArrIds = [jointly.indexof, item.indexof];
          someArr = [{
            ...jointly,
            sname,
            id
          }, {
            ...item,
            sname,
            id
          }];
        }

        if (item.price == -1 || item.price == -2 || jointly.price == -1 || jointly.price == -2) {
          return wx.showToast({
            title: '抱歉，该场次的该时间段不可选，换个场次或者时间试试吧！',
            icon: 'none',
            duration: 3000
          })
        }

        if (indexof == -1) {
          reListsId = reListsId.concat(someArrIds);
          reLists = reLists.concat(someArr);
        } else {

          reListsId.splice(isin, 2);
          reLists.splice(isin, 2);
        }
        // console.log(keys)
        // console.log(isKeys)
        self.setData({
          [keys]: !value,
          [isKeys]: !value,
          reListsId,
          reLists
        });
        return;
      }


      if (indexof == -1) {
        reListsId.push(item.indexof);
        reLists.push({
          ...item,
          sname,
          id
        })
      } else {
        reListsId.splice(indexof, 1);
        reLists.splice(indexof, 1);
      }
      self.setData({
        [keys]: !value,
        reListsId,
        reLists
      });
      // console.log(self.data.reLists);
    })
  },
  toCard: function (e) {
    let type = e.currentTarget.dataset.type;
    let sid = this.data.id;
    let name = this.data.detailData.sName;
    wx.navigateTo({
      url: '../cardList/cardList?sid=' + sid + '&type=' + type + '&name=' + name,
    })

  },
  submit: function () {
    let {
      reLists,
      detailData,
      days,
      type
    } = this.data;
    if (reLists.length == 0) {
      return
    };
    let total = 0;
    let phone = app.getUserInfo().phoneNum;
    reLists.forEach((item) => {
      total += item.price;
      item.sid = item.id;
      item.time = item.name;
      item.data = item.index;
    });
    total = total.toFixed(2);
    // console.log(phone);
    // console.log(total);
    let detail = {
      reLists: reLists,
      detailData: detailData,
      days: days,
      total,
      phone,
      type
    }
    // console.log(JSON.stringify(detail));
    wx.setStorageSync('order', JSON.stringify(detail))
    wx.navigateTo({
      url: '../reserveOrder/reserveOrder'
    })

  },
  queryByTypeAndDate: function () {
    let self = this;
    let {
      type,
      date,
      id
    } = this.data;
    // console.log(id);
    let params = {
      type,
      date,
      sid: id
    }
    http.get('/stadium/queryByTypeAndDate', params).then(function (res) {
      // console.log(res);
      let data;
      if (res.data.message.data != null) {
        data = res.data.message.data;
        data.forEach((it) => {
          if (!app.isNull(it.desc)) {
            let data = it.desc;
            data.forEach((item) => {
              let arr = item.name.split('-');
              // console.log(arr);
              if (arr[0].length != 5) {
                arr[0] = '0' + arr[0]
              }
              if (arr[1].length != 5) {
                arr[1] = '0' + arr[1]
              }
              item.name = arr[0] + '-' + arr[1];
              item.indexof = it.id + '-' + item.index;
              // console.log(item.name);
            })
          }
        })
        // console.log(self.data.place);
      } else {
        data = [];
      }
      self.setData({
        place: data
      })
    })
  },
  initData: function () {
    let self = this;
    let id = self.data.id;
    // id = 1;
    http.get('/stadium/queryBySid?sid=' + id).then(function (res) {
      // console.log(res);
      if (res.data.message != null) {
        let data = res.data.message;
        let chooseDate = data.chooseDate;
        let facility1 = data.facility.split(',');
        let sportType1 = data.sportType.split(',');
        data = {
          ...data,
          facility1,
          sportType1
        };
        self.setData({
          detailData: data,
          type: sportType1[0],
          date: chooseDate[0].time,
          sportType1: sportType1,
          days: chooseDate[0]
        })
        // console.log(self.data.detailData);
        self.queryByTypeAndDate();
      }
    })
  },
  openMap: function (t) {
    // sAddrLatitude   sAddrLongitude
    let longitude = this.data.detailData.sAddrLongitude;
    let latitude = this.data.detailData.sAddrLatitude;
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
      phoneNumber: self.data.detailData.contactPhone
    })
  },
  onShareAppMessage: function () {
    let self = this;
    let {sAddr,sAddrDesc} = self.data.detailData;
    // console.log(self.data.id)
    return {
      title: sAddr + sAddrDesc,
      path: '/pages/venuesDetail/venuesDetail?id=' + self.data.id
    }
  },

})

