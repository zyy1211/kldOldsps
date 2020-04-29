// pages/city/city.js
let cityList = require('../../utils/town')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cityList: cityList,
    province:cityList.province,
    city:cityList.city,
    intoView:"",
    value:''
  },
  getKeyWord: function (t) {
    this.setData({
      intoView: t.currentTarget.dataset.id.title,
      seletedId: t.currentTarget.dataset.id.title
    });
  },
  onSearch:function(){
    let value = this.data.value;
    value==''&& this.setData({city:cityList.city});
    let city = this.data.city.filter(item =>{
      return item.title.indexOf(value) != -1;
    });
    this.setData({
      city:city
    })
  },

  onChange:function(e){
    this.setData({
      value:e.detail
    });
    this.onSearch();
  },
  choiseItem:function(e){
    let item = e.currentTarget.dataset.item;
    console.log(item);
    let pages = getCurrentPages();
    let prevPage = pages[pages.length - 2]; //上一级页面
    prevPage.setData({
      city:item.title
    });
    wx.navigateBack({
      delta: 1
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  }
})