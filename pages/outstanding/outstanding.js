// pages/outstanding/outstanding.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[1,2,3,4,5,6],
    active:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  changeTabs:function(e){
    this.setData({
      active:e.currentTarget.dataset.key
    })
  }
})